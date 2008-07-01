function view_onOpen() {
  plugin.onAddCustomMenuItems = AddCustomMenuItems;
  showCashCall();
  setInterval("showCashCall()", 300000);
}

function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strRefresh) {
    showCashCall();
  }
}

function getCurrentCashCall() {
  //var url = "http://www.radiogames.de/Hit-Radio-Antenne1-Cash-Call/";
  var url = "http://www.desktop-gadgets.net/scripts/cashcall.rss.xml";
  var date = new Date();
  var tmpdate = "?ver="+Math.random();
  url = url + tmpdate;
  gadget.debug.trace("Requesting: "+url);
  try
  {
    var req = new XMLHttpRequest();
    req.open('GET', url, false); 
    req.send(null);
    if (req.status == 200) {
      return req.responseXml;
    }
  }
  catch (E)
  { }
  return null;
}

function showCashCall() {
  var data = getCurrentCashCall();
  var parser = new SimpleXmlParser(data);
   
  // get the channel information
  var items = parser.getItems("item");  
  if (items.length > 0) {
    var item = items[0];
    heading.innerText = item["title"];
    cashCallSum.innerText = item["description"];
  }
  else {
	  heading.innerText = strEndToday;
    cashCallSum.innerText = strGoodDay;
  }
}