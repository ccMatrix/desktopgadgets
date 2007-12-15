var feed = "https://mail.google.com/mail/feed/atom";
var refreshInterval = null;
var detailsViewOpen = false;
var mails = null;
var minimized = false;
var defaultWidth = 180;
var defaultHeight = 120;
var docked = true;

function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh, 0, OnMenuClicked);
	if (docked) {
		var resizeMenu = menu.AddPopup(strZoom);
		for (var i=50; i<=100; i+=10) {
			var isSelected = (options.getValue("zoom") == i)?gddMenuItemFlagChecked:0;
			resizeMenu.AddItem(i+"%", isSelected, OnSetZoomLevel);
		}
	}
}

function OnSetZoomLevel(zoomText) {
	zoom = parseInt(zoomText.replace("%", ""));
	options.putValue("zoom", zoom);
	displayMail();
}

function OnMenuClicked(itemText) {
  if (itemText == strRefresh) {
    checkMail();
  }
}

function view_onOpen() {
  options.putDefaultValue("username", "");
  options.putDefaultValue("password", "");
	options.putDefaultValue("account", "");
	options.putDefaultValue("displayAccount", true);
	options.putDefaultValue("isGoogleApps", false);
	options.putDefaultValue("alwaysAccount", false);
	options.putDefaultValue("interval", 600000);
	options.putDefaultValue("zoom", 100);
	options.putDefaultValue("design", "red");

	plugin.onShowOptionsDlg = ShowOptionsDlg;
	plugin.onAddCustomMenuItems = AddCustomMenuItems;

  newMails.visible = false;
	divTitle.visible = false;
  checkMail();
}

function view_onDock() {
	docked = true;
	displayMail();
}

function view_onUnDock() {
	docked = false;
	displayMail();
}


function view_onMinimize() {
  minimized = true;
	displayMail();
}

function view_onRestore() {
	minimized = false;
	displayMail();
}

function checkMail() {
  clearTimeout(refreshInterval);
	if (options.getValue("username") == "") {
		labelTitle.innerText = strConfig;
		newMailCount.innerText = ">";
		newMails.visible = true;
		divTitle.visible = true;
		return;
	}
  debug.trace("Loading Feed ...");
  var req = new XMLHttpRequest();
  req.open('GET', feed+"?randomTime="+Math.random(), true, options.getValue("username"), options.getValue("password"));
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        var parser = new xml2json();
				var gmailJson = parser.parse(req.responseText);
   
        // get the channel information
				//alert( parser.show_json_structure(gmailJson) );
        var items = gmailJson.feed.entry;
				if (items == undefined) {
					items = [];
				}
				else if (typeof items.author != "undefined") {
					debug.trace("Author is set - single mail in mailbox");
					var temp = [];
					temp.push(items);
					items = temp;
				}
				mails = items;
        displayMail();
      }
      else {
				newMails.visible = true;
				newMailCount.innerText = "!";
				divTitle.visible = true;
				labelTitle.innerText = "no connection";
        debug.error("Error loading page\n");
      }
    }
  };
  req.send(null);
  refreshInterval = setTimeout("checkMail()", options.getValue("interval") );
}

function displayMail() {
	debug.trace("Setting images based on selected design");
	var design = options.getValue("design");
	dot.src = "images\\"+design+"_dot.png";
	titleBg.src = "images\\"+design+"_titlebg.png";
	background.src = "images\\"+design+"_gmail_envelope.png";

	if (!minimized) {
		if (docked) {
			debug.trace("Resizing docked gadget to "+options.getValue("zoom")+"%");
			var newWidth = defaultWidth*(100/options.getValue("zoom"));
			var newHeight = defaultHeight;
			debug.trace("New size is: "+newWidth+"x"+newHeight);
			view.resizeTo(newWidth, newHeight);
			mainDiv.x = (view.width/2)-(mainDiv.width/2);
		}
		else {
			debug.trace("Resizing undocked gadget to normal size");
			view.resizeTo(defaultWidth, defaultHeight);
			mainDiv.x = 0;
		}
	}
	if (options.getValue("username") == "") {
		return;
	}
  if (mails.length > 0) {
		newMails.visible = true;
		newMailCount.innerText = mails.length;
		if (options.getValue("displayAccount")) {
			labelTitle.innerText = options.getValue("account");
			divTitle.visible = true;
			if (minimized) {
				view.caption = options.getValue("account")+" ("+mails.length+")";
			}
		}
		else {
			divTitle.visible = false;
			if (minimized) {
				view.caption = GADGET_NAME+" ("+mails.length+")";
			}
		}
  }
  else {
		if (options.getValue("alwaysAccount")) {
			labelTitle.innerText = options.getValue("account");
			newMailCount.innerText = "0";
			newMails.visible = true;
			divTitle.visible = true;
			if (minimized) {
				view.caption = options.getValue("account");
			}
		}
		else {
			newMails.visible = false;
			divTitle.visible = false;
		}
  }
	if (!minimized) {
		view.caption = GADGET_NAME;
	}
}

function openGmail() {
	if (detailsViewOpen) {
    plugin.closeDetailsView();
  }
	if (options.getValue("isGoogleApps")) {
		var domain = options.getValue("username");
		domain = domain.substring( domain.indexOf("@")+1 );
		visitUrl("https://mail.google.com/a/"+domain);
	}
	else {
		visitUrl("https://mail.google.com");
	}
}

function gmailDetails() {
	if (options.getValue("username") == "") {
		plugin.showOptionsDialog();
		return;
	}
	if (detailsViewOpen) {
    plugin.closeDetailsView();
  }
	if (mails.length > 0) {
		var details = new DetailsView();
		details.detailsViewData.putValue("mails", mails );
		details.SetContent(undefined, undefined, "detailsview.xml", false, 0);
		plugin.showDetailsView(details, strDetailsTitle+" ("+options.getValue("account")+")", gddDetailsViewFlagNone, onDetailsClose);
		detailsViewOpen=true;
	}
}

function onDetailsClose() {
  detailsViewOpen=false;
}