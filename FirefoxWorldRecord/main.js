var pledgeInterval = null;
var minimize = false;

function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh, 0, OnMenuClicked);
  menu.AddItem(strGadgetPage, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strRefresh) {
    getPledgeCount();
  }
  if (itemText == strGadgetPage) {
    framework.openUrl("http://www.desktop-gadgets.net/firefoxrecord/");
  }
}

function view_onOpen() {
	plugin.onAddCustomMenuItems = AddCustomMenuItems;
	options.putDefaultValue("pledges", "unknown ...");
	getPledgeCount();
}

function getPledgeCount() {
	clearInterval(pledgeInterval);
  var url = "http://www.spreadfirefox.com/en-US/worldrecord/?rand="+Math.random();
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.onreadystatechange = function () {
    if (req.readyState == 4) {
      if (req.status == 200) {
        var data = req.responseText;
				var match = data.match(/<dd id="pledge_count">([^>]*)<\/dd>/i);
				labelPledges.innerText = match[1].trim();
				if (minimize) {
					view.caption = "Pledges: "+match[1].trim();
				}
				else {
					view.caption = GADGET_NAME;
				}
				options.putValue("pledges", match[1].trim());
      }
      else {
        labelPledges.innerText = options.getValue("pledges");
      }
    }
  };
	req.send();
	setTimeout("getPledgeCount()", 7200000);
}

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

function divPledges_onclick() {
	framework.openUrl("http://www.spreadfirefox.com/en-US/worldrecord/");
}

function view_onminimize() {
	minimize = true;
	view.caption = "Pledges: "+options.getValue("pledges");
}

function view_onrestore() {
	minimize = false;
	view.caption = GADGET_NAME;
}
