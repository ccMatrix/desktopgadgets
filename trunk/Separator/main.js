function view_onOpen()
 {


}


function fadeIn() {
  beginAnimation("emptyDiv.opacity = event.value", emptyDiv.opacity, 80, 100);
}

function fadeOut() {
  beginAnimation("emptyDiv.opacity = event.value", emptyDiv.opacity, 1, 100);
}