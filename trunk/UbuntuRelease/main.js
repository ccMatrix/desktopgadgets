var updater = null;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strGadgetPage, 0, OnMenuClicked);
  var style = menu.AddPopup(strStyle);
  style.AddItem(styleRing, (options.getValue("STYLE") == styleRing)?gddMenuItemFlagChecked:0, OnMenuClicked);
  style.AddItem(styleCal, (options.getValue("STYLE") == styleCal)?gddMenuItemFlagChecked:0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strGadgetPage) {
    framework.openUrl("http://www.desktop-gadgets.net/ubunturelease/");
  }
  else if (itemText == styleRing) {
    options.putValue("STYLE", styleRing);
    getUbuntuData();
  }
  else if (itemText == styleCal) {
    options.putValue("STYLE", styleCal);
    getUbuntuData();
  }
}

function view_onOpen() {
  options.putDefaultValue("STYLE", styleRing);
  plugin.onAddCustomMenuItems = AddCustomMenuItems;

	errorMsg.visible = false;
	getUbuntuData();
	updater = setInterval( "getUbuntuData();", 3600000 );
}

function getUbuntuData() {
	try {
		var req = new XMLHttpRequest();
    var url = "";
    if (options.getValue("STYLE") == styleRing) {
      url = "http://www.ubuntu.com/files/countdown/display.js";
    }
    else if (options.getValue("STYLE") == styleCal) {
      url = "http://www.ubuntu.com/files/countdown/display2.js";
    }
    debug.trace('URL: ' + url);
		req.open("GET", url, false);
		req.send();
    debug.trace("Req response: " + req.status);
		if (req.status == 200) {
			errorMsg.visible = false;
			var JSdata = req.responseText;
			//JSdata = JSdata.replace(/\/\/([^\n]*)/, "");
			JSdata = JSdata.replace(/document.write/gi, "//document.write");
			eval(JSdata);
			var srcPart = JSdata.match("src=\"([^\"]*)\"");
			var srcEval = "JSdata = '"+srcPart[1]+"';";
			eval(srcEval);
			countdownImg.src = ajaxPicture(JSdata);
			countdownImg.mask = ajaxPicture(JSdata);
			view.width = countdownImg.srcWidth;
			view.height = countdownImg.srcHeight;
		}
		else {
			errorMsg.visible = true;
			errorMsgText.innerText = errorNoData;
		}
	}
	catch (E) {
		errorMsg.visible = true;
		errorMsgText.innerText = errorNoData;
	}
}

function ajaxPicture(url) {
  var req = new XMLHttpRequest();
  req.open('GET', url, false); 
  req.send(null);
  if(req.status == 200)
    return req.responseStream;
}

function view_onclose() {
	clearInterval( updater );
}

function countdownImg_onclick() {
	framework.openUrl("http://www.ubuntu.com");
}
