String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}
String.prototype.decode = function() {
	var regExp = "%26#([0-9]*);";
	var thisStr = this;
	while (true) {
		var data = thisStr.match( unescape(regExp) );
		if (!data) break;
		thisStr = thisStr.replace( data[0], String.fromCharCode( data[1] ) );
	}
	return thisStr;
}