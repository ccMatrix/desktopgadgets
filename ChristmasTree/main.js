var curPos = new Point(0, 0);
var resetActive = false;
var dragActive = false;
var dragOffset = new Point(0, 0);
var dragObject = "";
var snow = null;
var snowInterval = null;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {

	if (!resetActive) {
		var ballMenu = menu.AddPopup(strAddBalls);
		ballMenu.AddItem(strBallRed, 0, OnAddObject);
		ballMenu.AddItem(strBallYellow, 0, OnAddObject);
		ballMenu.AddItem(strBallGreen, 0, OnAddObject);
		ballMenu.AddItem(strBallBlue, 0, OnAddObject);
		ballMenu.AddItem(strBallOrange, 0, OnAddObject);
		ballMenu.AddItem(strBallPurple, 0, OnAddObject);
		
		var starMenu = menu.AddPopup(strAddStars);
		starMenu.AddItem(strStarRed, 0, OnAddObject);
		starMenu.AddItem(strStarYellow, 0, OnAddObject);
		starMenu.AddItem(strStarGreen, 0, OnAddObject);
		starMenu.AddItem(strStarBlue, 0, OnAddObject);
		starMenu.AddItem(strStarOrange, 0, OnAddObject);
		starMenu.AddItem(strStarPurple, 0, OnAddObject);

		var candleMenu = menu.AddPopup(strAddCandles);
		candleMenu.AddItem(strCandleRed, 0, OnAddObject);
		candleMenu.AddItem(strCandleYellow, 0, OnAddObject);
		candleMenu.AddItem(strCandleGreen, 0, OnAddObject);
		candleMenu.AddItem(strCandleBlue, 0, OnAddObject);
		candleMenu.AddItem(strCandleOrange, 0, OnAddObject);
		candleMenu.AddItem(strCandlePurple, 0, OnAddObject);

		var giftMenu = menu.AddPopup(strAddGifts);
		giftMenu.AddItem(strGiftRed, 0, OnAddObject);
		giftMenu.AddItem(strGiftYellow, 0, OnAddObject);
		giftMenu.AddItem(strGiftGreen, 0, OnAddObject);
		giftMenu.AddItem(strGiftBlue, 0, OnAddObject);
		giftMenu.AddItem(strGiftOrange, 0, OnAddObject);
		giftMenu.AddItem(strGiftPurple, 0, OnAddObject);

		var miscMenu = menu.AddPopup(strAddMisc);
		miscMenu.AddItem(strMiscBell, 0, OnAddObject);
		miscMenu.AddItem(strMiscTinsel, 0, OnAddObject);

	}

	menu.AddItem(strReset, 0, OnMenuClicked);
	menu.AddItem(strSnow, options("snow")?gddMenuItemFlagChecked:0, OnMenuClicked);

}

function OnMenuClicked(itemText) {
	switch (itemText) {
		case strReset:
			var doIt = confirm( strResetQuest );
			if (doIt) {
				decoration.removeAllElements();
			}
			break;
		case strSnow:
			options("snow") = !options("snow");
			if (options("snow")) {
				snowContainer.visible = true;
				clearInterval(snowInterval);
				snowInterval = setInterval("snow.snow()", 25);
			}
			else {
				clearInterval(snowInterval);
				snowContainer.visible = false;
			}
			break;
	}
}

function OnAddObject(itemText) {
	gadget.debug.trace("Called AddObject: "+itemText);
  var img = "";
  var repos = "center";
	switch (itemText) {
		case strBallRed:
			img = "ballred";
			break;
		case strBallBlue:
			img = "ballblue";
			break;
		case strBallGreen:
			img = "ballgreen";
			break;
		case strBallYellow:
			img = "ballyellow";
			break;
		case strBallPurple:
			img = "ballpurple";
			break;
		case strBallOrange:
			img = "ballorange";
			break;
		
		
		case strStarRed:
			img = "starred";
			break;
		case strStarBlue:
			img = "starblue";
			break;
		case strStarGreen:
			img = "stargreen";
			break;
		case strStarYellow:
			img = "staryellow";
			break;
		case strStarPurple:
			img = "starpurple";
			break;
		case strStarOrange:
			img = "starorange";
			break;
		
		
		case strCandleRed:
			img = "candlered";
			repos = "bottom";
			break;
		case strCandleBlue:
			img = "candleblue";
			repos = "bottom";
			break;
		case strCandleGreen:
			img = "candlegreen";
			repos = "bottom";
			break;
		case strCandleYellow:
			img = "candleyellow";
			repos = "bottom";
			break;
		case strCandlePurple:
			img = "candlepurple";
			repos = "bottom";
			break;
		case strCandleOrange:
			img = "candleorange";
			repos = "bottom";
			break;
		
		
		case strGiftRed:
			img = "giftred";
			break;
		case strGiftBlue:
			img = "giftblue";
			break;
		case strGiftGreen:
			img = "giftgreen";
			break;
		case strGiftYellow:
			img = "giftyellow";
			break;
		case strGiftPurple:
			img = "giftpurple";
			break;
		case strGiftOrange:
			img = "giftorange";
			break;
		
		
		case strMiscBell:
			img = "miscbell";
			break;
		case strMiscTinsel:
			img = "misctinsel";
			repos = "top";
			break;
	}

	var imgPath = "images/"+img+".png";
  var imgName = img+"_"+curPos.X()+"x"+curPos.Y();
	var imgObj = "<img name=\""+imgName+"\" cursor=\"hand\" enabled=\"true\" onmousedown=\"dragStart('"+imgName+"')\" onmouseup=\"dragEnd('"+imgName+"')\" src=\""+imgPath+"\" x=\""+curPos.X()+"\" y=\""+curPos.Y()+"\" />";
	imgObj = decoration.appendElement( imgObj );
	if (repos == "center") {
		imgObj.x = imgObj.x-(imgObj.srcWidth/2);
		imgObj.y = imgObj.y-(imgObj.srcHeight/2);
	}
	else if (repos == "bottom") {
		imgObj.x = imgObj.x-(imgObj.srcWidth/2);
		imgObj.y = imgObj.y-imgObj.srcHeight;
	}
	else if (repos == "top") {
		imgObj.x = imgObj.x-(imgObj.srcWidth/2);
	}

  storePositions();
}

function dragStart(obj) {
	dragActive = true;
	dragOffset = new Point(event.x, event.y);
	dragObject = obj;

	gadget.debug.trace("Start drag for: "+dragObject);
}

function dragEnd(obj) {
	dragActive = false;
	dragObject = "";
	gadget.debug.trace("Drag completed: "+dragObject);
}

function view_onOpen() {
	options.putDefaultValue("snow", true);
	plugin.onAddCustomMenuItems = AddCustomMenuItems;

	snow = new Snow( snowContainer, 10);
	if (options.getValue("snow")) {
		snowContainer.visible = true;
		snowInterval = setInterval("snow.snow()", 25);
	}
	else {
		snowContainer.visible = false;
	}
	restorePositions();
}

function view_onClose() {
	clearInterval(snowInterval);
}

function getCurPos() {
	resetActive = false;
	curPos = new Point(event.x, event.y);

	if (event.x < 5 || event.x > (decoration.width-5)) {
		resetCurPos();
	}
	if (event.y < 5 || event.y > (decoration.height-5)) {
		resetCurPos();
	}

	if (dragActive) {
		gadget.debug.trace("Moving dragObject: "+dragObject);
		decoration.children[ dragObject ].x = event.x-dragOffset.X();
		decoration.children[ dragObject ].y = event.y-dragOffset.Y();
	}
  curPos.print();
}

function resetCurPos() {
	resetActive = true;
  curPos = new Point( decoration.width/2, decoration.height/2 );
  curPos.print();
}
