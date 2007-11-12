var mails = null;

function detailsview_onopen() {
 
  mails = detailsViewData.getValue("mails");
	labelTitle.innerText = strDetailsTitle+" ("+options.getValue("account")+")";

	for (var i=0; i<mails.length; i++) {
		var summary = mails[i].summary;
		if (typeof summary == "object") {
			summary = strNoSummary;
		}
		summary = summary.replace("&amp;hellip;", " ..."+strMore);
		var title = mails[i].title;
		if (typeof title == "object") {
			title = strNoSubject;
		}
		try {
			var item = "<item width=\"100%\"><label width=\"100%\" tooltip=\""+mails[i].author.name+": "+title+"\" valign=\"middle\" bold=\"true\">"+mails[i].author.name+": "+title+"</label><label wordwrap=\"true\" width=\"100%\" height=\"42\" y=\"18\" valign=\"top\">"+summary+"</label></item>";
		}
		catch (E) {
			gadget.debug.error( E.Message );
		}
		mailList.appendElement(item);
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
