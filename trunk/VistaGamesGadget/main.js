var DISPLAY_LIST = 0;
var DISPLAY_ICONSMALL = 1;
var DISPLAY_ICONLARGE = 2;
var DISPLAY_BOXART = 3;
var DISPLAY_BOXARTLARGE = 4;

/*
Settings and variables
*/
var contentCounter = 0;
var displayStart = 0;
var displayRowItems = 0;
var displayLines = 0;
var displayItemCount = 0;
var displayMode = DISPLAY_LIST;
var contentItemWidth = 16;
var contentItemHeight = 16;


// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh,		0,	OnMenuClicked);
  menu.AddItem(strStatusBar,	options.getValue("statusbar")?gddMenuItemFlagChecked:0,	OnMenuClicked);
  menu.AddItem("-",	0x800,	OnMenuClicked);
  menu.AddItem(strDisplayList, 		(displayMode==DISPLAY_LIST)?gddMenuItemFlagChecked:0, 		OnMenuClicked);
  menu.AddItem(strDisplayIconSmall, 	(displayMode==DISPLAY_ICONSMALL)?gddMenuItemFlagChecked:0, 	OnMenuClicked);
  menu.AddItem(strDisplayIconLarge, 	(displayMode==DISPLAY_ICONLARGE)?gddMenuItemFlagChecked:0, 	OnMenuClicked);
  menu.AddItem(strDisplayBoxArt, 	(displayMode==DISPLAY_BOXART)?gddMenuItemFlagChecked:0, 	OnMenuClicked);
  menu.AddItem(strDisplayBoxArtLarge,	(displayMode==DISPLAY_BOXARTLARGE)?gddMenuItemFlagChecked:0,	OnMenuClicked);
}

function OnMenuClicked(itemText) {
  switch (itemText)
  {
    case strRefresh:
			options.putValue("LastCatCheck", 0);
			displayGames();
			break;
		case strStatusBar:
			options.putValue("statusbar", !options.getValue("statusbar"));
			drawDesign();
			break;
    case strDisplayList:
			setDisplayVars(DISPLAY_LIST);
			break;
    case strDisplayIconSmall:
			setDisplayVars(DISPLAY_ICONSMALL);
			break;
    case strDisplayIconLarge:
			setDisplayVars(DISPLAY_ICONLARGE);
			break;
    case strDisplayBoxArt:
			setDisplayVars(DISPLAY_BOXART);
			break;
		case strDisplayBoxArtLarge:
			setDisplayVars(DISPLAY_BOXARTLARGE);
			break;
  }
  displayGames();
}

function setDisplayVars(mode)
{
  gadget.debug.trace("DisplayVars setting to "+mode);

  switch (mode)
  {
    case DISPLAY_LIST:
			contentItemWidth = UIGameList.width;
			contentItemHeight = 32;
			break;
    case DISPLAY_ICONSMALL:
			contentItemWidth = 24;
			contentItemHeight = 24;
			break;
    case DISPLAY_ICONLARGE:
			contentItemWidth = 32;
			contentItemHeight = 32;
			break;
    case DISPLAY_BOXART:
			contentItemWidth = 64;
			contentItemHeight = 64;
			break;
    case DISPLAY_BOXARTLARGE:
			contentItemWidth = 96;
			contentItemHeight = 96;
			break;
  }
  displayMode = mode;
  displayRowItems = Math.floor( UIGameList.width / contentItemWidth );
  gadget.debug.trace(displayRowItems);
  displayLines = Math.floor( UIGameList.height / contentItemHeight );
  displayItemCount = displayRowItems * displayLines;
  displayItemCount = (displayItemCount>0)?displayItemCount:1;
  options.putValue("DisplayMode", displayMode);
  UIGameList.y = 0;
  gadget.debug.trace("DisplayVars set successfully");
}

function getItemRect()
{
  try
  {
    var itemX = contentCounter%displayRowItems;
    var itemY = (displayRowItems>1)?Math.floor(contentCounter/displayRowItems):contentCounter;
    var rect = new Rect(
               itemX*contentItemWidth, 
               itemY*contentItemHeight, 
               contentItemWidth, 
               contentItemHeight
         );
    return rect;
  }
  catch (E)
  {
    gadget.debug.error("SetContentItemRect(): "+E.description);
  }
}

/*
QuickLaunch Item Functions
*/
function OpenSubFolder(item) {
  displayFolder(item.source);
}
// Called to find out the height of each content item
function GetItemHeight(item, target, graphics, width) {
  return graphics.GetTextHeight(item.heading, width, 0, gddFontNormal);;
}

function view_onOpen() {
  options.putDefaultValue("DisplayMode", DISPLAY_BOXART);
  options.putDefaultValue("statusbar", true),

  view_onSize();

  var os = new OS();
  if (os.isVista()) {
    vistaRequired.visible = false;
    UIGameListDiv.visible = true;
    plugin.onAddCustomMenuItems = AddCustomMenuItems;
    setDisplayVars( options.getValue("DisplayMode") );
    displayGames();
  }
  else {
    vistaRequired.visible = true;
    UIGameListDiv.visible = false;
    vistaRequired.innerText = strVistaRequired+"\n"+os.name;
    vistaRequired.tooltip = strVistaRequired+"\n"+os.name;
  }
}

function drawDesign() {
  var border = 5;

  UIGameListDiv.y = border*2;
  UIGameListDiv.x = border;
  UIGameListDiv.width=view.width-(border*2);
  UIGameListDiv.height=view.height-(border*3)-infoLabel.height;

  if (options.getValue("statusbar")) {
    infoLabel.visible = true;
    infoLabel.x = border;
    infoLabel.y = UIGameListDiv.y + UIGameListDiv.height;
    infoLabel.width = UIGameListDiv.width;
  }
  else {
    infoLabel.visible = false;
    UIGameListDiv.height = view.height-(border*3);
  }

  UIGameList.width = UIGameListDiv.width-scrollarea.width;

  vistaRequired.y = border;
  vistaRequired.x = border;
  vistaRequired.height = view.height-(border*2);
  vistaRequired.width = view.width-(border*2);

  scrollarea.x=UIGameListDiv.width-scrollarea.width;
  scrollarea.y=0;
  scrollarea.height=UIGameListDiv.height;
  sb.height=scrollarea.height+(border*2);

  background.width = view.width;
  background.height = view.height;
  bgtopleft.x=0;
  bgtopleft.y=0;

  bgtopright.x=view.width-bgtopright.width;
  bgtopright.y=0;

  bgtop.x=bgtopleft.width-4;
  bgtop.y=0;
  bgtop.width=view.width-bgtopleft.width-bgtopright.width+8;

  bgbottomleft.x=0;
  bgbottomleft.y=view.height-bgbottomleft.height;

  bgbottomright.x=view.width-bgbottomright.width;
  bgbottomright.y=view.height-bgbottomright.height;

  bgbottom.x=bgbottomleft.width-4;
  bgbottom.y=view.height-bgbottom.height;
  bgbottom.width=view.width-bgbottomleft.width-bgbottomright.width+8;
  
  bgleft.x=0;
  bgleft.y=bgtopleft.height-4;
  bgleft.height=view.height-bgtopleft.height-bgbottomleft.height+8;

  bgright.x=view.width-bgright.width;
  bgright.y=bgtopright.height-4;
  bgright.height=view.height-bgtopright.height-bgbottomleft.height+8;

  bgcenter.x=bgtopleft.width;
  bgcenter.y=bgtopleft.height;
  bgcenter.width=view.width-bgtopleft.width-bgbottomright.width;
  bgcenter.height=view.height-bgtopleft.height-bgbottomright.height;
}

function view_onSize() {
  drawDesign();
  setDisplayVars(displayMode)
  displayGames();
}

function displayGames() {
  var os = new OS();
  if (!os.isVista()) return;
  var games = getGamesList();
  UIGameList.removeAllElements();
  contentCounter=0;
  for (var i=0; i<games.length; i++) {
    var imageData = "";
    if (displayMode == DISPLAY_BOXART || displayMode == DISPLAY_BOXARTLARGE) {
      if (games[i].getBoxArt() != "") {
        imageData = games[i].getBoxArt();
      }
      else {
        imageData = games[i].getIcon();
      }
    }
    else {
      imageData = games[i].getIcon();
    }
    var rect = getItemRect();
    //gadget.debug.trace( rect.toString());
    var div = UIGameList.appendElement("<div name=\"div"+i+"\" x=\""+rect.X()+"\" y=\""+rect.Y()+"\" width=\""+rect.Width()+"\" height=\""+rect.Height()+"\"></div>");
    // var label = div.appendElement("<label color=\"#FF00FF\"></label>");
    //label.innerText = games[i].getName();
    var img = div.appendElement("<img></img>");
    img.src = imageData;
    if (img.srcWidth < rect.Width()) {
      img.width = img.srcWidth;
      img.height = img.srcHeight;
    }
    else {
      var srcRatio = img.srcWidth/img.srcHeight;
      var targetRatio = rect.Width()/rect.Height();
      if (srcRatio > targetRatio) {
        img.width = rect.Width();
        img.height = img.width/srcRatio;
      }
      else {
        img.height = rect.Height();
        img.width = img.height*srcRatio;
      }
    }
    if (displayMode == DISPLAY_LIST) {
      img.x = 0;
      img.y = 0;
      var label = div.appendElement("<label></label>");
      label.innerText = games[i].getName();
      label.tooltip = games[i].getName();
      label.x = img.width+5;
      label.y = 0;
      label.width = div.width - label.x;
      label.height = rect.Height();
      label.align = "left";
      label.valign = "middle";
      label.wordwrap = true;
      label.bold = true;
      label.size = 8;
      label.color = "#FFFFFF";
    }
    else {
      img.x = rect.Width()/2-img.width/2;
      img.y = rect.Height()/2-img.height/2;
    }
    img.tooltip = games[i].getName();
    div.cursor = "hand";
    div.enabled = true;
    div.onMouseover = "hoverDiv(\"div"+i+"\");";
    div.onMouseout = "leaveDiv(\"div"+i+"\");";
    div.onClick = "runGame(\""+escape(games[i].getExe())+"\", \""+games[i].getName()+"\");";
    div.tooltip = games[i].getName();

    UIGameList.height = rect.Y()+rect.Height();
    contentCounter++;
  }
  sb.max=UIGameList.height-UIGameListDiv.height;
  scrollarea.height=UIGameListDiv.height;
  sb.height=scrollarea.height+20;
  if (sb.max<0) sb.max=0;
}

function getDivByName(name) {
  for (var i=0; i<UIGameList.children.count; i++) {
    if (UIGameList.children(i).name == name) {
      return UIGameList.children(i);
    }
  }
  return null;
}

function hoverDiv(name) {
  var div = getDivByName(name);
  div.background="#808080";
  infoLabel.innerText = div.tooltip;
}

function leaveDiv(name) {
  var div = getDivByName(name);
  div.background="";
  infoLabel.innerText = "";
}

function runGame(path, name) {
  gadget.debug.trace("Running game: "+unescape(path) );
  var wsh = new ActiveXObject( "WScript.Shell" );
  var folder = unescape(path).substring(0, unescape(path).lastIndexOf("\\"));
  wsh.CurrentDirectory = folder;
  try {
    wsh.Run( "\"" + unescape(path) + "\"" );
  } catch (E) {
    alert( errorRun.replace("[GAME]", unescape(name)) );
  }
}

function sb_onchange() {
  UIGameList.y=-sb.value;
}