function Rect(x,y,w,h) {
  this.posx = x;
  this.posy = y;
  this.width = w;
  this.height = h;
}
Rect.prototype.X = function() {
  return this.posx;
}
Rect.prototype.Y = function() {
  return this.posy;
}
Rect.prototype.Width = function() {
  return this.width;
}
Rect.prototype.Height = function() {
  return this.height;
}
Rect.prototype.toString = function() {
  return "( "+this.posx+", "+this.posy+", "+this.width+", "+this.height+")";
}

function parseXML(str) {
  str = str.replace("&", " and ");
  return str;
}