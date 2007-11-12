function visitUrl(url) {
  gadget.debug.trace("Option link: "+url);
  var wsh = new ActiveXObject( "WScript.Shell" );
  wsh.Run( url ); 
}
