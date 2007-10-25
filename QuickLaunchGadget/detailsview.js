
function detailsview_onopen() {
  displayImagePath = detailsViewData.getValue("imagePath");
  gadget.debug.trace("Detailsview for "+displayImagePath);

  previewImage.src = displayImagePath;
  resizeImage();
}

function resizeImage() {
  var srcRatio = previewImage.srcWidth/previewImage.srcHeight;
  var targetRatio = (view.width)/(view.height);
  var posx, posy, newwidth, newheight;
  if (srcRatio > targetRatio) {
    newwidth = view.width;
    newheight = newwidth/srcRatio;
  }
  else {
    newheight = view.height;
    newwidth = newheight*srcRatio;
  }
  posx = (view.width)/2 - (newwidth/2);
  posy = (view.height)/2 - (newheight/2);
  previewImage.x = posx;
  previewImage.y = posy;
  previewImage.width = newwidth;
  previewImage.height = newheight;
}