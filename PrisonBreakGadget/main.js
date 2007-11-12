var feed = "http://www.fox.com/prisonbreak/images/xml/event_data.xml";
var refreshInterval = null;
var timeout = null;
var parser = null;
var isDocked = true;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh, 0, OnMenuClicked);
  menu.AddItem(strGadgetPage, 0, OnMenuClicked);
  menu.AddItem(strPrisonBreakPage, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strRefresh) {
    requestFeed();
  }
  if (itemText == strGadgetPage) {
    openUrl("http://www.imagine-interactive.de/prisonbreakgadget/");
  }
  if (itemText == strPrisonBreakPage) {
    openUrl("http://www.fox.com/prisonbreak/");
  }
}

function view_onOpen() {
  plugin.onAddCustomMenuItems = AddCustomMenuItems;

  resize();
  requestFeed();

}

function requestFeed() {
  clearTimeout(refreshInterval);
  //gadget.debug.trace("Loading Feed ...");
  var req = new XMLHttpRequest();
  var d = new Date();
  var url = feed+"?CacheBuster="+Math.random()+"&timestamp="+d.getTime();
  //gadget.debug.trace("Loading URL: "+url);
  req.open('GET', url, true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        loadingText.visible = false;
        parser = new SimpleXmlParser(req.responseXml); // (1)
   
        // get the channel information
        //var items = parser.getItems("SLIDE");
        timerDiv.visible = true;
        displayCountDown();
      }
      else {
        loadingText.visible = true;
        loadingText.innerText = strNoInternet;
        timerDiv.visible = false;
        debug.gadget.error("Error loading page\n");
      }
    }
  };
  req.send(null);
  refreshInterval = setInterval("requestFeed()", 3600000);
}

function displayCountDown() {
  var items = parser.getItems("event");
  //gadget.debug.trace("Counters: "+items.length);
  for (var i=0; i<items.length; i++) {
    var d = new Date();
    var dateInfo = items[i]["@startDate"].split("/");
    d.setDate( dateInfo[0] );
    d.setMonth( dateInfo[1]-1 );
    d.setYear( dateInfo[2] );

    var timeInfo = items[i]["@startTime"].split(":");
    var timeZoneDiff = Number(d.getTimezoneOffset()/60-Number(items[i]["@GMT"]));
    var newHours = Number( Number(timeInfo[0])+timeZoneDiff);
    if (newHours > 24) {
      d.setDate( d.getDate()+1 );
      newHours = newHours-24;
    }

    d.setHours( newHours );
    d.setMinutes( timeInfo[1] );
    d.setSeconds( 0 );

    //gadget.debug.trace( d.toGMTString() );
    var now = new Date();
    var timeDiff = new Date(0);
    timeDiff.setMilliseconds( d-now );
    var diff = Math.floor(timeDiff.valueOf()/1000);
    if (diff > 0) {
      labelPlaying.visible = false;
      timerDiv.visible = true;
      displayTimeDiff( diff );
      return;
    }
    if (diff > -1*60*60) {
      labelPlaying.visible = true;
      timerDiv.visible = false;
      labelPlaying.innerText = strPlaying;
      return;
    }
  }
  timerDiv.visible = false;
  labelPlaying.visible = true;
  labelPlaying.innerText = strNoData;
}

function displayTimeDiff(countdown)  {
  //gadget.debug.trace("CountDown is: "+countdown);
  clearTimeout(timeout);
  if (countdown < 0) {
  }
  else {
    var secs = countdown % 60; 
    if (secs < 10) {
      secs = '0'+secs;
    }
    var countdown1 = (countdown - secs) / 60;
    var mins = countdown1 % 60; 
    if (mins < 10) {
      mins = '0'+mins;
    }
    countdown1 = (countdown1 - mins) / 60;
    var hours = countdown1 % 24;
    var days = (countdown1 - hours) / 24;
    curDays.innerText = days;
    curHours.innerText = hours;
    curMinutes.innerText = mins;
    curSeconds.innerText = secs;
    timeout = setTimeout("displayCountDown()", 1000);
  }
}

function openUrl(url) {
  gadget.debug.trace("Opening URL: "+url);
  if (url == "") url = "/Heroes";
  var wsh = new ActiveXObject( "WScript.Shell" );
  wsh.Run( url ); 
}

function goPrisonBreak() {
  openUrl("http://www.fox.com/prisonbreak/");
}

function resize() {
  if (isDocked) {
    view.resizeTo(timerDiv.width, backgroundImage.height);
    prisonBreakLogo.height = 22;
    prisonBreakLogo.width = 135;
  }
  else {
    view.resizeTo(backgroundImage.width, backgroundImage.height);
    prisonBreakLogo.height = 30;
    prisonBreakLogo.width = 180;
  }
}

function view_onDock() {
  gadget.debug.trace("Docked");
  isDocked = true;
  resize();
}

function view_onUnDock() {
  gadget.debug.trace("UnDocked");
  isDocked = false;
  resize();
}