function view_onOpen() {
	//plugin.onAddCustomMenuItems = AddCustomMenuItems;
	plugin.onShowOptionsDlg = ShowOptionsDlg;

	getHuluSeries();

	if (options.getValue("currentSeries") == "") {
		debug.info("No current series set - use random series");
		var rand = Math.round(Math.random()*(huluSeries.length-1));
		debug.trace("Random series: "+huluSeries[rand].getName());
		options.putDefaultValue("currentSeries", huluSeries[rand].getID());
	}

	displayCurrent();
}

function AddCustomMenuItems(menu) {
	var currentSeries = options.getValue("currentSeries");
	var seriesPopup = menu.AddPopup(strSeries);
	for (var i=0; i<huluSeries.length; i++) {
		seriesPopup.AddItem(huluSeries[i].getName(), (huluSeries[i].getID() == currentSeries)?gddMenuItemFlagChecked:0, OnSelectSeries);
	}
}

function OnSelectSeries(itemText) {
	for (var i=0; i<huluSeries.length; i++) {
		if (huluSeries[i].getName() == itemText) {
			options.putValue("currentSeries", huluSeries[i].getID());
			displayCurrent();
			return;
		}
	}
}

function displayCurrent() {
	debug.trace("Looking for seriesFlash");
	if (view.children.item("seriesFlash") != null) {
		debug.trace("Remove seriesFlash");
		view.removeElement( view.children.item("seriesFlash") );
	}

	debug.info("Show series: "+options.getValue("currentSeries"));

	var flash = '<object name="seriesFlash" classid="progid:ShockwaveFlash.ShockwaveFlash" width="200" height="439" x="0" y="0">';
	flash += '<param name="movie" value="http://www.hulu.com/widget/show/'+options.getValue("currentSeries")+'/episodes" />';
	flash += '</object>';
	view.appendElement(flash);
}