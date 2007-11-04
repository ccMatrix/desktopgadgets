function Point(cx, cy) {
	this._x = cx;
	this._y = cy;
}

Point.prototype.X = function() {
	return this._x;
}

Point.prototype.Y = function() {
	return this._y;
}

Point.prototype.print = function() {
	//gadget.debug.trace( this._x + "x" + this._y );
}
