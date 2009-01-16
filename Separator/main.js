function view_onOpen() {
  options.putDefaultValue("width", 200);
  options.putDefaultValue("height", 200);
  view.resizeTo(options.getValue("width"), options.getValue("height"));
}


function fadeIn() {
  beginAnimation("emptyDiv.opacity = event.value", emptyDiv.opacity, 80, 100);
}

function fadeOut() {
  beginAnimation("emptyDiv.opacity = event.value", emptyDiv.opacity, 1, 100);
}

function view_onSize() {
  options.putValue("width", event.srcWidth);
  options.putValue("height", event.srcHeight);
}
