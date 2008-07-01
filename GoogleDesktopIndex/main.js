var indexUrl = "";
var indexSize = 0;
var stats = new Array();

var updateTimer = null;

var minimized = false;

function AddCustomMenuItems(menu) {
	menu.AddItem(strHelp, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strHelp) {
    framework.openUrl( "http://www.desktop-gadgets.net/indexstats/" );
  }
}

function view_onOpen() {
	plugin.onAddCustomMenuItems = AddCustomMenuItems;
	readIndexStatus();
	updateTimer = setInterval("readIndexStatus();", 60000);
}

function view_onClose() {
	if (updateTimer) {
		clearInterval(updateTimer);
	}
}

function view_onMinimize() {
  minimized = true;
	displayStats();
}

function view_onRestore() {
	minimized = false;
	displayStats();
}

function readIndexStatus() {
	var reg = new _Registry();
	var gdUrl = reg.ReadValue( kHKEY_CURRENT_USER, "Software\\Google\\Google Desktop\\API", "search_url", kVALUE_STRING);
	debug.trace("Url: "+gdUrl);
	var req = new XMLHttpRequest();
	req.open("GET", gdUrl, false);
	req.send();
	if (req.status == 200) {
		var data = req.responseText.match("/status([^\"']*)");
		indexUrl = "http://127.0.0.1:4664" + data[0];
		req.open("GET", indexUrl, false);
		req.send();
		if (req.status == 200) {
			var match = req.responseText.match("<td align=right><b>(.+)</b></td>");
			if (match) {
				indexSize = match[1];
				debug.trace("Indexed Objects: "+indexSize);
			}
			else {
				debug.error("Could not find max");
				return;
			}
			
			data = req.responseText;
			data = data.replace(/&nbsp;/gi, " ");
			data = data.replace(/  /gi, " ");
			data = data.replace(/<script([^>]*)([^<]*)([^>]*)/gi, "");
			data = data.replace(/<style([^>]*)([^<]*)([^>]*)/gi, "");
			data = data.replace("<td align=right><b></b></td>", "<td align=right><b>0:00pm</b></td>");
			var start = data.indexOf( "<b>"+indexSize+"</b>" );
			data = data.substring( start + indexSize.length, data.length );
			data = data.substring( data.indexOf("\n"), data.length);
			data = data.replace(/(<)([^>]*)(>)/gi, "");
			var list = data.split("\n");
			var list2 = new Array();
			for (var i=0; i<list.length; i++) {
				var line = trimString(list[i]);
				if (line.length > 0) {
					list2.push(line);
					debug.trace("Adding: "+line);
				}
				else {
					debug.trace("Skipping");
				}
			}
			list2.shift();
			while (stats.pop()) { };
			for (var i=0; i<list2.length; i+=3) {
				debug.trace("IndexStat("+list2[i]+", "+list2[i+1]+", "+list2[i+2]+");");
				var stat = new IndexStat(list2[i], list2[i+1], list2[i+2]);
				stats.push(stat);
				if (stats.length == 4) break;
			}
		}
	}

	displayStats();
}

function displayStats() {
	dataTotal.innerText = indexSize;

	labelMail.innerText = stats[0].type;
	dataMail.innerText = stats[0].count;
	dataMail.tooltip = stats[0].date;

	labelChat.innerText = stats[1].type;
	dataChat.innerText = stats[1].count;
	dataChat.tooltip = stats[1].date;

	labelWeb.innerText = stats[2].type;
	dataWeb.innerText = stats[2].count;
	dataWeb.tooltip = stats[2].date;

	labelFiles.innerText = stats[3].type;
	dataFiles.innerText = stats[3].count;
	dataFiles.tooltip = stats[3].date;

	if (minimized) {
		view.caption = indexSize;
	}
	else {
		view.caption = GADGET_NAME;
	}
}

function IndexStat(t, c, d) {
	this.type = t;
	this.count = c;
	this.date = d;
}

function trimString(str) {
	if (!str || str == undefined) {
		return "";
	}
	else {
		return str.replace(/^\s*/, "").replace(/\s*$/, "");
	}
}