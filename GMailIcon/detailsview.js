var mails = null;

function detailsview_onopen() {
 
  mails = detailsViewData.getValue("mails");
	labelTitle.innerText = strDetailsTitle+" ("+options.getValue("account")+")";

	switch (options.getValue("design")) {
		case "red":
			divDetailsTitle.background = "#C63114";
			break;
		case "gray":
			divDetailsTitle.background = "#6b6b6b";
			break;
		case "blue":
			divDetailsTitle.background = "#086bd9";
			break;
		case "green":
			divDetailsTitle.background = "#047d17";
			break;
	}

	for (var i=0; i<mails.length; i++) {
		var summary = mails[i].summary;
		if (typeof summary == "object") {
			summary = strNoSummary;
		}
		var title = mails[i].title;
		if (typeof title == "object") {
			title = strNoSubject;
		}
		try {
			var item = mailList.appendElement("<item width=\"100%\"></item>");
			var labeltitle = item.appendElement("<label />");
			labeltitle.width = "100&";
			labeltitle.tooltip = mails[i].author.name+": "+stripEntities(title);
			labeltitle.valign = "middle";
			labeltitle.bold = true;
			labeltitle.innerText = mails[i].author.name + ": " + stripEntities(title);
			var labelsummary = item.appendElement("<label />");
			labelsummary.wordwrap = true;
			labelsummary.width = "100%";
			labelsummary.height = 42;
			labelsummary.y = 18;
			labelsummary.valign = "top";
			labelsummary.innerText = stripEntities(summary);
		}
		catch (E) {
			gadget.debug.error( E.Message );
		}
	}

}
function detailsview_onSize() {
	gadget.debug.trace("resizing detailsview");
	mailList.height = view.height-25;
}

function showMail() {
  var idx = mailList.selectedIndex;
  if (idx >= 0) {
		var href = mails[idx].link.href;
		gadget.debug.trace("Open Mail: "+href);
		if (options.getValue("isGoogleApps")) {
			var domain = options.getValue("username");
			domain = domain.substring( domain.indexOf("@")+1 );
			href = href.replace("/mail?", "/a/"+domain+"/mail?");
			while (href.indexOf("&amp;") > 0) {
				href = href.replace("&amp;", "%26");
			}
			visitUrl( unescape(href) );
		}
		else {
			while (href.indexOf("&amp;") > 0) {
				href = href.replace("&amp;", "%26");
			}
			visitUrl( unescape(href) );
		}
	}
}