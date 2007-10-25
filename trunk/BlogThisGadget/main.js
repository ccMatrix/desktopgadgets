var bloggerIE = null;
var ReadyStateInterval = null;

function view_onOpen() {
  var details = new DetailsView();
  details.SetContent(undefined, undefined, "detailsview.xml", false, 0);
  plugin.showDetailsView(details, "", gddDetailsViewFlagNone, undefined);
  plugin.closeDetailsView();
}

function openBlogThis(data) {
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
  
}

function checkReadyState() {
  try {
    if (bloggerIE != null) {
			setTimeout("bloggerIE.document.body.scroll = \"no\";", 200);
      if (bloggerIE.ReadyState == 4) {
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
