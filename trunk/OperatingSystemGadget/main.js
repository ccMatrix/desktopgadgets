var SPACE = " ";

var isDocked = true;
var isMinimized = false;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(menuShowSerial, options.getValue("showSerial")?gddMenuItemFlagChecked:0, OnMenuClicked);
  menu.AddItem(menuShowVersion, options.getValue("showVersion")?gddMenuItemFlagChecked:0, OnMenuClicked);
  menu.AddItem(menuShowServicePack, options.getValue("showServicePack")?gddMenuItemFlagChecked:0, OnMenuClicked);
  menu.AddItem(strHelp, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  switch (itemText)
  {
    case menuShowSerial:
		var value = options.getValue("showSerial");
		options.putValue("showSerial", !value);
		break;
    case menuShowVersion:
		var value = options.getValue("showVersion");
		options.putValue("showVersion", !value);
		break;
    case menuShowServicePack:
		var value = options.getValue("showServicePack");
		options.putValue("showServicePack", !value);
		break;
    case strHelp:
		var wsh = new ActiveXObject( "WScript.Shell" );
		wsh.Run( "http://www.googledesktopgadgets.com/os/" ); 
		break;
  }
  drawGadget();
}

function view_onOpen() {
  plugin.onAddCustomMenuItems = AddCustomMenuItems;

  options.putDefaultValue("showSerial", true);
  options.putDefaultValue("showVersion", true);
  options.putDefaultValue("showServicePack", true);

  isDocked = true;

  drawGadget();

  var os = new OS();
  osName.innerText = os.caption;
  osName.tooltip = os.caption;
  osSerial.innerText = os.serial;
  osSerial.tooltip = os.serial;
  osVersion.innerText = strVersion+SPACE+os.version;
  if (os.servicePackMajor == 0) {
    options.putValue("showServicePack", false);
    osServicePack.visible = false;
  }
  osServicePack.innerText = strServicePack+SPACE+os.servicePackMajor;
  
}

function onDisplayTargetChange(displayTarget) {
  // Find out the new display mode
  if (displayTarget == gddTargetSidebar) {
    debug.trace('Display target changed to docked');
    isDocked = true;
    refresh();
  } else if (displayTarget == gddTargetFloatingView) {
    debug.trace('Display target changed to undocked');
    isDocked = false;
    refresh();
  }
}

function view_onDock() {
  gadget.debug.trace("Triggered: onDock");
  drawGadget();
}

function view_onUndock() {
  gadget.debug.trace("Triggered: onUndock");
  drawGadget();
}

function view_onMinimize() {
  isMinimized = true;
  gadget.debug.trace("Triggered: onMinimize");
  drawGadget();
}

function view_onPopIn() {
  gadget.debug.trace("Triggered: onPopIn");
}

function view_onPopOut() {
  gadget.debug.trace("Triggered: onPopOut");
}

function view_onRestore() {
  isMinimized = false;
  gadget.debug.trace("Triggered: onRestore");
  drawGadget();
}

function view_onSize() {
  drawGadget();
  gadget.debug.trace("Triggered: onSize");
}

function view_onSizing() {
  event.height = view.height;
  drawGadget();
  gadget.debug.trace("Triggered: onSizing");
}

function drawGadget() {

  if (isMinimized) {
    var os = new OS();
    view.caption = os.caption;
  }
  else {
    view.caption = GADGET_NAME;
  }

  var yPos = 10;
  
  osName.x = 10;
  osName.y = yPos;
  osName.width = view.width-20;
  
  if (options.getValue("showSerial")) {
    yPos = yPos + 18;
    osSerial.x = 10;
    osSerial.y = yPos;
    osSerial.width = view.width-20;
  }
  osSerial.visible = options.getValue("showSerial");
  
  if (options.getValue("showVersion")) {
    yPos = yPos + 18;
    osVersion.x = 10;
    osVersion.y = yPos;
    osVersion.width = view.width-20;
  }
  osVersion.visible = options.getValue("showVersion");
  
  if (options.getValue("showServicePack")) {
    yPos = yPos + 18;
    osServicePack.x = 10;
    osServicePack.y = yPos;
    osServicePack.width = view.width-20;
  }
  osServicePack.visible = options.getValue("showServicePack");

  view.height = yPos+26;

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

  background.visible=true;
}