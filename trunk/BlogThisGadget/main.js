var bloggerIE = null;
var ReadyStateInterval = null;
var detailOpen = false;

function view_onOpen() {
  var details = new DetailsView();
  details.SetContent(undefined, undefined, "detailsview.xml", false, 0);
  plugin.showDetailsView(details, "", gddDetailsViewFlagNone, undefined);
  plugin.closeDetailsView();
}

function openBlogThis(data) {
	if (detailOpen) {
		detailOpen = false;
		plugin.closeDetailsView();
		return;
	}
  var params = [];
  if (data != null) {
    params = data;
  }
  else {
    params.push("t=");
    params.push("u=");
    params.push("n=New Blog Post");
  }
  var url = "http://www.blogger.com/blog_this.pyra?"+params.join("&");
  bloggerIE = new WebBrowser();
  bloggerIE.navigate2(url);
  
  ReadyStateInterval = setTimeout("checkReadyState()", 500);

  // Show the details view
  plugin.showDetailsView(bloggerIE, "BlogThis!", gddDetailsViewFlagToolbarOpen, undefined);

	detailOpen = true;
}

function checkReadyState() {
  try {
    if (bloggerIE != null) {
      if (bloggerIE.ReadyState == 4) {
				if (bloggerIE.document.body) {
					setTimeout("bloggerIE.document.body.scroll = \"no\";", 200);
				}
        clearInterval( ReadyStateInterval );
      }
			else {
				ReadyStateInterval = setTimeout("checkReadyState()", 500);
			}
    }
  }
  catch (E) {
    clearInterval( ReadyStateInterval );
  }
}


function blogDragPost() {
  var e = new Enumerator(event.dragFiles);

  while (!e.atEnd()) {
    var path = e.item();
    
    gadget.debug.trace("Dragged: "+path);
    e.moveNext();
  }
}
