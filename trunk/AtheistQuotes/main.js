var detailsViewOpen = false;

function view_onOpen() {
	plugin.plugin_flags = gddPluginFlagToolbarForward;
	plugin.onCommand = ToolbarCommand;
	plugin.onAddCustomMenuItems = AddCustomMenuItems;

	requestQuotes();
}

function AddCustomMenuItems(menu) {
  menu.AddItem(strNext, 0, OnMenuClicked);
	menu.AddItem(strHelp, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strNext) {
    displayQuote();
  }
  if (itemText == strHelp) {
    framework.openUrl( "www.googledesktopgadgets.com/atheistquotes/" );
  }
}

function ToolbarCommand(command) {
	if (command == gddCmdToolbarForward) {
		displayQuote();
	}
}

function displayQuote() {
	if (quoteList.length == 0) return;

	var rand = Math.random()*(quoteList.length-1);
	rand = Math.floor(rand);
	var q = quoteList[rand];
	labelName.innerText = q.name;
	labelQuote.innerText = q.quote;
	labelQuote.toolTip = q.quote;

	debug.trace( q.name + ": " + q.quote );

	fitQuote();
}

function view_onSize() {
	// debug.trace( "Size: " + view.width + "x" + view.height );
	background.width = view.width;
	background.height = view.height;
	labelName.width = view.width-20;
	labelQuote.width = view.width-20;
	labelQuote.height = view.height - labelQuote.y - 10;

	fitQuote();
}

function fitQuote() {
	
}

function wikipediaAuthor() {
	if (quoteList.length == 0) return;
	var wikiUrl = "en.wikipedia.org/wiki/Special:Search?search="+labelName.innerText+"&go=Go";
	debug.trace("Open Wikipedia: "+wikiUrl);
	framework.openUrl( wikiUrl );
}

function detailQuote() {
	if (quoteList.length == 0) return;

	if (detailsViewOpen) {
		plugin.closeDetailsView();
		return;
	}

	var details = new DetailsView();
	details.detailsViewData.putValue("name", labelName.innerText );
	details.detailsViewData.putValue("quote", labelQuote.toolTip );
	details.SetContent(undefined, undefined, "detailsview.xml", false, 0);
	plugin.showDetailsView(details, GADGET_NAME + " - " + labelName.innerText, gddDetailsViewFlagNone, onDetailsClose);
	detailsViewOpen=true;
}

function onDetailsClose() {
	detailsViewOpen=false;
}

function detailsview_onopen() {
  labelName.innerText = detailsViewData.getValue("name");
	labelQuote.innerText = detailsViewData.getValue("quote");
	labelQuote.toolTip = detailsViewData.getValue("quote");
}

function detailsview_onSize() {
	gadget.debug.trace("resizing detailsview");
	mailList.height = view.height-25;
}