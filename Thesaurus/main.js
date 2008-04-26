var colors = new Array();
colors.push( [ strThemeGreen, "#00FF00"] );
colors.push( [ strThemeRed, "#FF0000"] );
colors.push( [ strThemeYellow, "#FFFF00"] );
colors.push( [ strThemeBlue, "#0000FF"] );
colors.push( [ strThemePurple, "#A100FF"] );
colors.push( [ strThemeOrange, "#FFA300"] );

var progressSwf = "";

function AddCustomMenuItems(menu) {
	menu.AddItem(strHelp, 0, OnMenuClicked);
	var colorPopup = menu.AddPopup(strColors);
	colorPopup.AddItem(strThemeDefault, (options.getValue("color")==strThemeDefault)?gddMenuItemFlagChecked:0, ApplyColor);
	colorPopup.AddItem("-",	0x800,	OnMenuClicked);
	for (var i=0; i<colors.length; i++) {
		var style = 0;
		if (options.getValue("color") == colors[i][0])
			style = gddMenuItemFlagChecked;
		colorPopup.AddItem(colors[i][0], style, ApplyColor);
	}
}

function OnMenuClicked(itemText) {
  if (itemText == strHelp) {
    var wsh = new ActiveXObject( "WScript.Shell" );
    wsh.Run( "http://www.googledesktopgadgets.com/thesaurus/" ); 
  }
}

function ApplyColor(color) {
	if (color == strThemeDefault) {
		options.putValue("color", color);
		background.colorMultiply = "#00000000";
		return;
	}
	for (var i=0; i<colors.length; i++) {
		if (colors[i][0] == color) {
			background.colorMultiply = colors[i][1];
			options.putValue("color", color);
			return
		}
	}
}

function view_onOpen() {
	plugin.onAddCustomMenuItems = AddCustomMenuItems;
	options.putDefaultValue("language", LANG_SUPPORTED[0]);
	options.putDefaultValue("color", strThemeDefault);

	colors.sort(colorSort);
	ApplyColor(options.getValue("color"));

	// Icon for starting language
	langIcon.src = "images/country/"+options.getValue("language")+".png";

	// Fill language selection dropdown
	languageList.removeAllElements();
	for (var i=0; i<LANG_SUPPORTED.length; i++) {
		var item = languageList.appendElement("<item name=\""+LANG_SUPPORTED[i]+"\" />");
		//item.name = LANG_SUPPORTED[i];
		item.background = "#FFFFFF";
		var div = item.appendElement("<div />");
		div.x = div.y = 0;
		div.width = 20;
		div.height = 12;
		div.background = "#FFFFFF";
		var flag = div.appendElement("<img />");
		flag.width = 18;
		flag.height = 12;
		flag.src = "images/country/"+LANG_SUPPORTED[i]+".png";
		flag.x = 1;
		flag.y = 1;
	}

	// Create progress indicator in
	progressSwf = storage.extract("images/progress.swf");
	var flashCode = "<object x=\"197\" y=\"1\" name=\"progress\" visible=\"false\" classid=\"progid:ShockwaveFlash.ShockwaveFlash\" width=\"16\" height=\"16\">";
	flashCode += "<param name=\"wmode\" value=\"opaque\" />";
	flashCode += "<param name=\"movie\" value=\""+progressSwf+"\" />";
	flashCode += "</object>";
	var progress = searchArea.appendElement(flashCode);

}

/*
 * Lookup a word in the current language
 */
function lookup(word) {
	// If no word is specified we do not need to search
	if (word.length == 0 || word == strEmptyWord) {
		thesaurusData.innerText = strWordRequest;
		return;		
	}
	// Show progress indicator
	progress.visible = true;
	var lang = options.getValue("language");

	var thesaurus = new Thesaurus(lang);
	// Callback will be fired when the server return data or nothing is found
	thesaurus.callback = function(def) {
			switch (def) {
				case ERROR_NOTFOUND:
					thesaurusData.innerText = strLookupFailed;
					break;
				case ERROR_WEBSITE:
					thesaurusData.innerText = strWebsiteFailed;
					break;
				default:
					thesaurusData.innerText = def;
					break;
			}
			// Set correct size and display scrollbars if necessary
			calcThesaurusSize();
			// Hide progress indicator
			progress.visible = false;
		};
	thesaurus.lookup(word);
}

/*
 * Calculates the needed size to show the thesaurus data
 * Displays scrollbars if necessary
 */
function calcThesaurusSize() {
	sizeCalc.visible = false;
	sizeCalc.x = contentArea.x;
	sizeCalc.y = contentArea.y;
	sizeCalc.width = contentArea.width;
	sizeCalc.height = contentArea.height;
	sizeCalc.value = thesaurusData.innerText;
	var bound = sizeCalc.idealBoundingRect;
	//debug.trace("Bound: "+bound.height+", Content: "+contentArea.height);
	if (bound.height > contentArea.height) {
		thesaurusData.y = 0;
		sb.value = 0;
		scrollarea.visible = true;
		thesaurusData.width = contentArea.width-scrollarea.width-5;
		sizeCalc.width = thesaurusData.width;
		sizeCalc.height = contentArea.height;
		bound = sizeCalc.idealBoundingRect;
		sb.max = bound.height-contentArea.height;
		debug.trace(sb.max);
		thesaurusData.height = bound.height;
	}
	else {
		scrollarea.visible = false;
		thesaurusData.y = 0;
		thesaurusData.width = "100%";
		thesaurusData.height = "100%";
	}
}

/*
 * Scroll text based on scrollbar index
 */
function scrollText() {
	thesaurusData.y = -sb.value;
}

/*
 * Fired when user clicks into query edit
 * Will hide background text and set correct font color
 */
function wordQuery_onfocusin() {
	languageListDiv.visible = false;
	if (wordQuery.value == strEmptyWord) {
		wordQuery.value = "";
		wordQuery.color = "#000000";
	}
}

/*
 * If no word is entered display the request for data
 */
function wordQuery_onfocusout() {
	if (wordQuery.value == "") {
		wordQuery.value = strEmptyWord;
		wordQuery.color = "#A0A0A0";
	}
}

/*
 * Enter and return will search automatically
 * Escape will loose focus
 * Tab will do nothing
 */
function wordQuery_onkeypress() {
	switch (event.keyCode ) {
		case 13: // Enter
		case 10: // Return
			event.returnValue = false;
			lookup(wordQuery.value);
			break;
		case 9: // Tab
			break;
		case 27:
			thesaurusData.focus();
			break;
	}
}

/*
 * execute search when button is clicked
 */
function searchBtn_onclick() {
	languageListDiv.visible = false;
  lookup(wordQuery.value);
}

/*
 * Show/Hide language selection list
 */
function displayLangSelector() {
	if (languageListDiv.visible) {
		languageListDiv.visible = false;
	}
	else {
		languageListDiv.height = 0;
		languageListDiv.visible = true;
		beginAnimation("languageListDiv.height = event.value", 0, languageList.children.Count*languageList.itemHeight, 150);
	}
}

/*
 * Set new current language
 */
function languageList_onchange() {
	options.putValue("language", languageList.selectedItem.name);
	langIcon.src = "images/country/"+options.getValue("language")+".png";
	languageListDiv.visible = false;
}

/*
 * Dynamically change positions and sizes of elements
 */
function reposition() {
	searchArea.width = view.width-20;
	searchBtn.x = searchArea.width - searchBtn.width - 1;
	try {
		progress.x = searchBtn.x-progress.width;
	}
	catch (E) {
		debug.error("Flash not supported");
	}
	wordQuery.width = searchBtn.x-wordQuery.x;

	contentArea.width = view.width-20;
	contentArea.height = view.height-10-contentArea.y;
	scrollarea.height = contentArea.height;
	scrollarea.x = contentArea.width-scrollarea.width;
	sb.height = scrollarea.height+20;
	

	calcThesaurusSize();
}

function view_onsizing() {
	// debug.trace("Resizing ...");
	reposition();

}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

/*
 * Sort handler for colors
 */
function colorSort(color1, color2) {
	var colorNames = [ color1[0], color2[0] ];
	colorNames.sort();
	if (colorNames[0] == color1[0]) {
		return -1;
	}
	else {
		return 1;
	}
}

function view_onclose() {
  try {
		if (framework.filesystem.FileExists(progressSwf)) {
			framework.system.filesystem.DeleteFile( progressSwf );
		}
  } catch (e) {
    gadget.debug.error("Could not remove tempFile: "+progressSwf);
  }

}
