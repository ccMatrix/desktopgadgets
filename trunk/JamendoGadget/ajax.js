function ajaxCall(url, func)
{
  var req = new XMLHttpRequest();
  req.open('GET', url+"&randomTime="+Math.random(), true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        eval(func+"(req.responseText)");
      }
      else {
        debug.gadget.error("Error loading page\n");
      }
    }
  };
  req.send(null);
}

function ajaxPicture(url)
{
  var req = new XMLHttpRequest();
  req.open('GET', url, false); 
  req.send(null);
  if(req.status == 200) {
		if (req.getResponseHeader("Content-Type").match(/image/gi)) {
			debug.trace("Valid image");
		}
    return req.responseStream;
	}
}
