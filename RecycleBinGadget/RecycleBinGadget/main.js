var recyclebin = null;
var checkInterval = null;
var tempFile = "";
var additionalApps = [];
plugin.onAddCustomMenuItems = AddCustomMenuItems;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
	var totalobjects = 0;
	try {
		var ssfBITBUCKET = 10; // (0xa) shell special folder constant (for recycle bin)
		var oSHApp = new ActiveXObject("Shell.Application");
		var oRecycleBin = oSHApp.Namespace(ssfBITBUCKET);
		var stuff = new Enumerator(oRecycleBin.Items());

		for ( ; !stuff.atEnd() ; stuff.moveNext() ) {
			totalobjects++;
		}

	}
	catch (E) {
		debug.error("Error getting status:\n"+E.description);
	}
	menu.AddItem(strEmptyBin, (totalobjects>0)?0:gddMenuItemFlagGrayed, OnMenuClicked);
	menu.AddItem(strOpenRecycle, 0, OnMenuClicked);
	menu.AddItem(strHelp, 0, OnMenuClicked);

  if (additionalApps.length > 0) {
    menu.AddItem("-", 0x800, OnMenuClicked);
    for (var i=0; i<additionalApps.length; i++) {
      var app = additionalApps[i];
      menu.AddItem( app.name, 0, OnAppClicked );
    }
  }

}

function OnMenuClicked(itemText) {
  if (itemText == strEmptyBin) {
    recyclebin.emptyBin();
    checkTrash();
  }
  if (itemText == strOpenRecycle) {
    trash_dblclick();
  }
  if (itemText == strHelp) {
    framework.openUrl( "http://www.desktop-gadgets.net/recyclebin/" ); 
  }
}

function OnAppClicked(appName) {
  for (var i=0; i<additionalApps.length; i++) {
    var app = additionalApps[i];
    if (app.name == appName) {
			gadget.debug.trace("Launching: "+app.file);
      var wsh = new ActiveXObject( "WScript.Shell" );
			wsh.Run( "\"" + app.file + "\"" ); 
      break;
    }
  }
}

function view_onOpen()
{
  try {
    recyclebin = new RecycleBinObj();
  } catch (e) {
    alert("Couldn't load the DLL RecycleBin :(\n"+e.message);
    event.returnValue = false;
    return;
  }

  additionalApps = [];
  var reg = new _Registry();
  var subKeys = reg.GetSubKeys( kHKEY_CLASSES_ROOT, "CLSID\\{645FF040-5081-101B-9F08-00AA002F954E}\\Shell");
  for (var i=0; i<subKeys.length; i++) {
    var cmdText = subKeys[i];
    var cmdFile = reg.ReadValue( kHKEY_CLASSES_ROOT, "CLSID\\{645FF040-5081-101B-9F08-00AA002F954E}\\Shell\\"+subKeys[i]+"\\command", "", kVALUE_STRING);
		var app = new Application( cmdText, cmdFile );
		additionalApps.push(app);
    //gadget.debug.trace("Command "+cmdText+" : "+cmdFile);
  }

  trashPic.src="trashcan_empty.png";
  checkInterval = setInterval( "checkTrash()", 5000 );
}

function checkTrash()
{
	var ssfBITBUCKET = 10; // (0xa) shell special folder constant (for recycle bin)
	var x;
	var totalsize = 0;
	var totalobjects = 0;
	var oSHApp = new ActiveXObject("Shell.Application");
	var oRecycleBin = oSHApp.Namespace(ssfBITBUCKET);
	var stuff = new Enumerator(oRecycleBin.Items());

	for ( ; !stuff.atEnd() ; stuff.moveNext() ) {
		x = stuff.item();
		totalsize += x.size;
		totalobjects++;
	}
	totalsizeround = Math.round(totalsize/1024/1024);

  if (totalobjects > 0)
  {
    trashPic.tooltip=totalobjects+" "+strObjects+"\n"+totalsizeround+" MB";
    trashPic.src="trashcan_full.png";
  }
  else
  {
    trashPic.tooltip=strEmpty;
    trashPic.src="trashcan_empty.png";
  }
}

function trash_dblclick()
{
  tempFile = gadget.storage.extract("recyclelink.lnk");
  var wsh = new ActiveXObject( "WScript.Shell" );
  wsh.Run( tempFile ); 
  setTimeout( "deleteTemp()", 5000 );
}

function deleteTemp()
{
  try {
    framework.system.filesystem.DeleteFile( tempFile );
  } catch (e) {
    gadget.debug.error("Could not remove tempFile: "+tempFile);
    event.returnValue = false;
    return;
  }
}

function createDragFilesList(obj) {
  var files = [];
  var e = new Enumerator(obj);

  while (!e.atEnd()) {
    var path = e.item();
    
    files.push(path + '');
    e.moveNext();
  }
    
  return files;
}

function trash_dragdrop()
{
  var files = createDragFilesList(event.dragFiles);
  for (var i=0; i<files.length; i++)
  {
    recyclebin.moveToBin(files[i]);
  }
}

function view_onClose() {
  clearInterval( checkInterval );
}

function Application( appName, appFile) {
  this.name = appName;
  this.file = appFile;
}