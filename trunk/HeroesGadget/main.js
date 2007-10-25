var feed = "http://www.nbc.com/Heroes/heroespromote.xml";
var refreshInterval = null;
var parser = null;
var slides = [];

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh, 0, OnMenuClicked);
  menu.AddItem(strGadgetPage, 0, OnMenuClicked);
  menu.AddItem(strHeroesPage, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strRefresh) {
    requestFeed();
  }
  if (itemText == strGadgetPage) {
    openUrl("http://www.imagine-interactive.de/heroesgadget/");
  }
  if (itemText == strHeroesPage) {
    openUrl("http://www.nbc.com/Heroes/");
  }
}

function view_onOpen() {
  plugin.onAddCustomMenuItems = AddCustomMenuItems;

  requestFeed();
}

function moveAnim() {
  if (slideImg.x == 0) {
    beginAnimation("slideImg.x = event.value", 0, view.width-slideImg.width, 12000);
    setTimeout("moveAnim()", 15000);
  }
  else if (slideImg.x == (view.width-slideImg.width)) {
    beginAnimation("slideImg.x = event.value", slideImg.x, 0, 12000);
    setTimeout("moveAnim()", 15000);
  }
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
        parser = new SimpleXmlParser(req.responseXml); // (1)
   
        // get the channel information
        //var items = parser.getItems("SLIDE");
        displayNextOn();
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

function displayNextOn() {
  var items = parser.getItems("HEROESPROMOTE");
  var item = items[0];
  slides = [];

  nextOnImg.src = ajaxPicture("http://www.nbc.com"+item["NEXTON@imgsrc"]);
  nextOnLabel.innerText = item["NEXTON"].trim();

  items = parser.getItems("SLIDE");
  //item = items[0];
  //slideImg.src = ajaxPicture("http://www.nbc.com"+item["@imgsrc"]);
  
  item = items[0];
  slides.push(item);
  slideThumb1.src = ajaxPicture("http://www.nbc.com"+item["@thumbsrc"]);
  slideThumb1.onmouseover = function() {
    //gadget.debug.trace("Loading: "+slides[0]["@imgsrc"]);
    //slideImg.src = ajaxPicture("http://www.nbc.com"+slides[0]["@imgsrc"]);
  }
  slideThumb1.tooltip = item["SUBHEAD"];
  if (item["@url"] != "") {
    slideThumb1.cursor = "hand";
    slideThumb1.onclick = function() {
      openUrl("http://www.nbc.com"+slides[0]["@url"]);
    }
  }
  else {
    slideThumb1.cursor = "arrow";
  }

  item = items[1];
  slides.push(item);
  slideThumb2.src = ajaxPicture("http://www.nbc.com"+item["@thumbsrc"]);
  slideThumb2.onmouseover = function() {
    //gadget.debug.trace("Loading: "+slides[1]["@imgsrc"]);
    //slideImg.src = ajaxPicture("http://www.nbc.com"+slides[1]["@imgsrc"]);
  }
  slideThumb2.tooltip = item["SUBHEAD"];
  if (item["@url"] != "") {
    slideThumb2.cursor = "hand";
    slideThumb2.onclick = function() {
      openUrl("http://www.nbc.com"+slides[1]["@url"]);
    }
  }
  else {
    slideThumb2.cursor = "arrow";
  }

  item = items[2];
  slides.push(item);
  slideThumb3.src = ajaxPicture("http://www.nbc.com"+item["@thumbsrc"]);
  slideThumb3.onmouseover = function() {
    //gadget.debug.trace("Loading: "+slides[2]["@imgsrc"]);
    //slideImg.src = ajaxPicture("http://www.nbc.com"+slides[2]["@imgsrc"]);
  }
  slideThumb3.tooltip = item["SUBHEAD"];
  if (item["@url"] != "") {
    slideThumb3.cursor = "hand";
    slideThumb3.onclick = function() {
      openUrl("http://www.nbc.com"+slides[2]["@url"]);
    }
  }
  else {
    slideThumb3.cursor = "arrow";
  }
  
}

function openUrl(url) {
  gadget.debug.trace("Opening URL: "+url);
  if (url == "") url = "/Heroes";
  var wsh = new ActiveXObject( "WScript.Shell" );
  wsh.Run( url ); 
}