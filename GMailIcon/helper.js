function stripEntities(str) {
	var constSrcList = ["%26amp;quot;", "%26amp;", "%26lt;", "%26gt;", "%26hellip;" ]
	var constTargetList = ["\"", "&", "<", ">", " ..."+strMore];

	var regExp = "%26amp;#([0-9]*);";
	var scanning = true;
	while (scanning) {
		var data = str.match( unescape(regExp) );
		if (!data) {
			scanning = false;
		}
		else {
			str = str.replace( data[0], String.fromCharCode( data[1] ) );
		}
	}

	for (var i=0; i<constSrcList.length; i++) {
		var src = constSrcList[i];
		var target = constTargetList[i];
		scanning = true;
		while (scanning) {
			var data = str.match( unescape(src) );
			if (!data) {
				scanning = false;
			}
			else {
				str = str.replace( data[0], target );
			}
		}
	}
	debug.trace(str);
	return str;
}