function storePositions() {
	var objects = [];
	for (var i=0; i<decoration.children.count; i++) {
		var obj = new Object();
		obj.name = decoration.children.item(i).name;
		obj.x = decoration.children.item(i).x;
		obj.y = decoration.children.item(i).y;
		obj.src = decoration.children.item(i).src;
		objects.push( obj );
	}
	options.putValue("positions", objects.toJSONString() );
}

function restorePositions() {
	var objects = options.getValue("positions");
  objects = objects.parseJSON();

	for (var i=0; i<objects.length; i++) {
		var obj = objects[i];
    var imgName = obj.name;
		var imgPath = obj.src;
		var imgPosX = obj.x;
		var imgPosY = obj.y;
		var imgObj = "<img name=\""+imgName+"\" cursor=\"hand\" enabled=\"true\" onmousedown=\"dragStart('"+imgName+"')\" onmouseup=\"dragEnd('"+imgName+"')\" src=\""+imgPath+"\" x=\""+imgPosX+"\" y=\""+imgPosY+"\" />";
		decoration.appendElement( imgObj );
	}
}