var feed = "http://xkcd.com/atom.xml";
var refreshInterval;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh, 0, OnMenuClicked);
  var transSub = menu.AddPopup(strTransparency);
  for (var i=100; i>10; i-=10) {
    var capt = i+"%";
    transSub.AddItem(capt, (getTrans()==i)?gddMenuItemFlagChecked:0, OnMenuClicked);
  }
}

function OnMenuClicked(itemText) {
  if (itemText == strRefresh) {
    requestFeed();
  }
  else {
    var trans = itemText.substring(0, itemText.indexOf("%"));
    setTrans(trans);
  }
}

function view_onOpen() {
  options.putDefaultValue("Trans", 100);
  setTrans( options.getValue("Trans") );
  plugin.onAddCustomMenuItems = AddCustomMenuItems;
  requestFeed();
}

function requestFeed() {
  clearTimeout(refreshInterval);
  gadget.debug.trace("Loading Feed ...");
  var req = new XMLHttpRequest();
  req.open('GET', feed+"?randomTime="+Math.random(), true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        loadingText.visible = false;
        var parser = new SimpleXmlParser(req.responseXml); // (1)
   
        // get the channel information
        var items = parser.getItems("entry");
        displayFeed(items);
      }
      else {
        loadingText.visible = true;
        loadingText.innerText = strNoInternet;
        debug.gadget.error("Error loading page\n");
      }
    }
  };
  req.send(null);
  refreshInterval = setTimeout("requestFeed()", 3600000);
}

function displayFeed(items) {
  if (items.length == 0) return;
  var item = items[0];

  var summary = item["summary"];
  var imgSrc = summary.match("\"([^\"]*)\"")[1];
  comicImg.src = loadPicture(imgSrc);
  comicImg.x = 0;
  comicImg.y = 0;
  comicImg.width = comicImg.srcWidth;
  comicImg.height = comicImg.srcHeight;
  comicImg.tooltip = item["title"];
  comicImg.cursor = "hand";
  comicImg.enabled = true;
  comicImg.onClick = "visitUrl(\""+item["link@href"]+"\");";
  view.resizeTo(comicImg.srcWidth, comicImg.srcHeight);
}

function visitUrl(url) {
  gadget.debug.trace("Option link: "+url);
  var wsh = new ActiveXObject( "WScript.Shell" );
  wsh.Run( url ); 
}

function loadPicture(url)
{
  var req = new XMLHttpRequest();
  req.open('GET', url, false); 
  req.send(null);
  if(req.status == 200)
    return req.responseStream;
}

function setTrans(trans) {
  comicImg.opacity = (255/100)*trans;
  options.putValue("Trans", trans);
  // gadget.debug.trace("SetTrans: "+trans+" => "+comicImg.opacity);
}

function getTrans() {
  var trans = comicImg.opacity/(255/100);
  trans = Math.round(trans);
  // gadget.debug.trace("Opacity: "+comicImg.opacity+" => "+trans);
  return trans;
}