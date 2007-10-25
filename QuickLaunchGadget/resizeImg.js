alert( "hello" );

/*

var image_width = 0;
var image_height = 0;
var image_ratio = 0;

function loadPage() {
  var image = document.getElementById("image"); 
  var image_width = image.width;
  var image_height = image.height;
  var image_ratio = image_width / image_height;

  resizeImg();
}

function resizeImg() { 
  var image = document.getElementById("image"); 
  var target_width = document.body.clientWidth;
  var target_height = document.body.clientHeight;
  var target_ratio = target_width / target_height;

  if (target_ratio > image_ratio)
  {
    if (image_height > target_height)
    {
	image.height = target_height;
        image.width = image.height * image_ratio; // Maintain Ratio
    }
  }
  else
  {
    if (image_width > target_width)
    {
        image.width = target_width;
        image.height = image.width / image_ratio; // Maintain Ratio
    }
  }
}

document.getElementById("image").onload = loadPage;
onresize = resizeImg;
*/