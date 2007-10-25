function Video() {
  this.image = "";
  this.title = "";
  this.link = "";
}

Video.prototype.setImg = function(src) {
  this.image = "http://www.scifi.com/pulse/images/thumbs/"+src;
}

Video.prototype.setTitle = function(t) {
  t = t.split("&quot;");
  t = t.join("\"");
  t = t.split("&amp;");
  t = t.join("&");
  this.title = t;
}

Video.prototype.setLink = function(l) {
  this.link = l;
}

Video.prototype.getImg = function() {
  return this.image;
}