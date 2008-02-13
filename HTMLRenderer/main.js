var webpages = [];
webpages.push("http://www.codename-matrix.de/_private/example.html");
webpages.push("http://www.december.com/html/demo/hello.html");
webpages.push("http://www2.latech.edu/~acm/helloworld/HTML.html");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_basic");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_paragraphs1");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_paragraphs2");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_paragraphs");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_poem");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_headers");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_header");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_hr");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_comment");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_formattingch");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_pre");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_computeroutput");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_abbr");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_q");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_basic");

function view_onOpen() {
	plugin.onAddCustomMenuItems = AddCustomMenuItems;

	Render( webpages[0] );
}

function AddCustomMenuItems(menu) {
	popupRender = menu.addPopup(strRender);
	popupVisit = menu.addPopup(strVisit);
	
	for (var i=0; i<webpages.length; i++) {
		popupRender.AddItem(webpages[i], 0, Render);
		popupVisit.AddItem(webpages[i], 0, Visit);
	}

	menu.AddItem(strCustom, 0, RenderCustom);
}

function RenderCustom(itemText) {
	var url = view.prompt(strCustomPrompt, webpages[0]);
	if (url) {
		Render(url);
	}
}

function Render(url) {
	var req = new XMLHttpRequest();
	// These are some webpages which show Hello World examples, enable each line to test the renderer:
	if (url.indexOf("?") > 0) {
		url += "&" 
	}
	else {
		url += "?";
	}
	url += Math.random();

	req.open("GET", url, false);
	req.send();

	var str = req.responseText;
	renderHTMLCode(str, view, url);
}

function Visit(url) {
	framework.openUrl(url);
}