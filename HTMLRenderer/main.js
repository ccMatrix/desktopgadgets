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
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_font");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_pre");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_computeroutput");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_abbr");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_bdo");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_q");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_del");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_tables");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_images");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_images2");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_bodybgimg");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_image_align");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_images_adj");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_back_good");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_back_bad");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_back_img");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_back_img2");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_back_imgbad");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_lists4");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_lists");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_lists_ordered");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_lists_unordered");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_lists2");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_nestedlists2");
webpages.push("http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_lists3");

var currentPage = 0;
var render = null;

function view_onOpen() {
	plugin.onAddCustomMenuItems = AddCustomMenuItems;
	plugin.plugin_flags = gddPluginFlagToolbarForward | gddPluginFlagToolbarBack;
	plugin.onCommand = ToolbarCommand;

	render = new HTMLRender();
	render.RenderUrl( webpages[30] );

	// Render( "http://www.w3schools.com/html/tryit_view.asp?filename=tryhtml_tables" );
}

function ToolbarCommand(command) {
	if (command == gddCmdToolbarForward) {
		currentPage++;
		if (currentPage >= webpages.length) {
			currentPage = 0;
		}
		render.RenderUrl( webpages[currentPage] );
	}
	if (command == gddCmdToolbarBack) {
		currentPage--;
		if (currentPage < 0) {
			currentPage = webpages.length-1;
		}
		render.RenderUrl( webpages[currentPage] );
	}
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
		render.RenderUrl(url);
	}
}

function Render(url) {
	render.RenderUrl(url);
}

function Visit(url) {
	framework.openUrl(url);
}