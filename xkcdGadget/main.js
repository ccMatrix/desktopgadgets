var feed = "http://xkcd.com/atom.xml";
var feedItems = [];
var currentIndex = 0;
var refreshInterval;
var slideshowInterval;
var gadgetIdle = true;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh, 0, OnMenuClicked);
	menu.AddItem(strIdle, options.getValue("idlemode")?gddMenuItemFlagChecked:0, OnMenuClicked);
	menu.AddItem(strXKCD, 0, OnMenuClicked);
	menu.AddItem(strHelp, 0, OnMenuClicked);
  var transSub = menu.AddPopup(strTransparency);
  for (var i=100; i>10; i-=10) {
    var capt = i+"%";
    transSub.AddItem(capt, (getTrans()==i)?gddMenuItemFlagChecked:0, OnMenuClicked);
  }
}

function ToolbarCommand(command) {
	if (command == gddCmdToolbarForward) {
		displayNext();
	}
	if (command == gddCmdToolbarBack) {
		displayPrev();
	}
}

function OnMenuClicked(itemText) {
  if (itemText == strRefresh) {
    requestFeed();
  }
	else if (itemText == strIdle) {
		options.putValue("idlemode", !options.getValue("idlemode") );
	}
	else if (itemText == strXKCD) {
		framework.openUrl("http://www.xkcd.com");
	}
	else if (itemText == strHelp) {
		framework.openUrl("http://www.googledesktopgadgets.com/xkcd/");
	}
  else {
    var trans = itemText.substring(0, itemText.indexOf("%"));
    setTrans(trans);
  }
}

function view_onOpen() {
  options.putDefaultValue("Trans", 100);
	options.putDefaultValue("idlemode", true);
  setTrans( options.getValue("Trans") );

  plugin.onAddCustomMenuItems = AddCustomMenuItems;
	plugin.plugin_flags = gddPluginFlagToolbarForward | gddPluginFlagToolbarBack;
	plugin.onCommand = ToolbarCommand;

  requestFeed();
	slideshowInterval = setInterval("idleNext()", 60000);
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
	feedItems = items;
  displayItem(0);
}

function idleNext() {
	if (options.getValue("idlemode") && gadgetIdle) {
		displayNext();
	}
}

function displayNext() {
	debug.trace("Next image...");
	if (currentIndex == feedItems.length-1) {
		currentIndex = 0;
	}
	else {
		currentIndex++;
	}
	displayItem(currentIndex);
}

function displayPrev() {
	debug.trace("Previous image...");
	if (currentIndex == 0) {
		currentIndex = feedItems.length-1;
	}
	else {
		currentIndex--;
	}
	displayItem(currentIndex);
}

function displayItem(index) {
	currentIndex = index;

	beginAnimation("comicImg.opacity = event.value;", (255/100)*options.getValue("trans"), 0, 400);
	setTimeout("displayItemAnim();", 400);
}

function displayItemAnim() {
	beginAnimation("comicImg.opacity = event.value;", 0, (255/100)*options.getValue("trans"), 400);
	var item = feedItems[currentIndex];
  var summary = item["summary"];
  var imgSrc = summary.match("\"([^\"]*)\"")[1];
	var imgAlt = summary.match("alt=\"([^\"]*)\"")[1];
  comicImg.src = loadPicture(imgSrc);
  comicImg.x = 0;
  comicImg.y = 0;
  comicImg.width = comicImg.srcWidth;
  comicImg.height = comicImg.srcHeight;
  comicImg.tooltip = item["title"]+"\n\n"+imgAlt;
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

function loadPicture(url) {
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


function view_onclose() {
	clearInterval(slideshowInterval);
	clearInterval(slideshowInterval);
}

function view_onmouseover() {
	gadgetIdle = false;
}

function view_onmouseout() {
	gadgetIdle = true;
}
