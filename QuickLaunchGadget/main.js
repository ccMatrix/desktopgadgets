view.caption = "QuickLaunch";
cnArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout
var filesystem = framework.system.filesystem;
var currentFolder = "";
var rootFolder = "";
var rootFolders = [];
var rootDisplays = [];
var imageRatioStorage = new Object();
var imageDataStorage = new Object();
var detailsViewOpen = false;
var detailsViewItem = "";

/*
Options variables
*/
var options_rootFolders;
var options_addFolder;
var options_removeFolder;
var options_revert;
var options_single;
var options_preview;
var options_extensions;
var options_iconleft;
var options_context;

var fileCounter = 0;

var previewPicture = true;
var previewPictureExt = ".bmp;.gif;.png;.jpg;";
var previewText = true;
var previewTextExt = ".txt;.log;.cfg;";

/*
File/Folder Constants
*/
ATTR_NORMAL = 0;	// Normal file. No attributes are set.
ATTR_READONLY = 1;	// Read-only file. Attribute is read/write.
ATTR_HIDDEN = 2;	// Hidden file. Attribute is read/write.
ATTR_SYSTEM = 4;	// System file. Attribute is read/write.
ATTR_VOLUME = 8;	// Disk drive volume label. Attribute is read-only.
ATTR_DIRECTORY = 16;	// Folder or directory. Attribute is read-only.
ATTR_ARCHIVE = 32;	// File has changed since last backup. Attribute is read/write.
ATTR_ALIAS = 1024;	// Link or shortcut. Attribute is read-only.
ATTR_COMPRESSED = 2048;	// Compressed file. Attribute is read-only.

/*
Display Constants
*/
DISPLAY_LIST = 1;
DISPLAY_ICONSMALL = 2;
DISPLAY_ICONLARGE = 3;
DISPLAY_TILES = 4;
DISPLAY_THUMB = 5;

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
  menu.AddItem(strDisplayList, 		(displayMode==DISPLAY_LIST)?gddMenuItemFlagChecked:0, 		OnMenuClicked);
  menu.AddItem(strDisplayIconSmall, 	(displayMode==DISPLAY_ICONSMALL)?gddMenuItemFlagChecked:0, 	OnMenuClicked);
  menu.AddItem(strDisplayIconLarge, 	(displayMode==DISPLAY_ICONLARGE)?gddMenuItemFlagChecked:0, 	OnMenuClicked);
  menu.AddItem(strDisplayTiles, 	(displayMode==DISPLAY_TILES)?gddMenuItemFlagChecked:0, 		OnMenuClicked);
  menu.AddItem(strDisplayThumb, 	(displayMode==DISPLAY_THUMB)?gddMenuItemFlagChecked:0, 		OnMenuClicked);
}

function OnMenuClicked(itemText) {
  switch (itemText)
  {
    case strDisplayList:
		setDisplayVars(DISPLAY_LIST);
		break;
    case strDisplayIconSmall:
		setDisplayVars(DISPLAY_ICONSMALL);
		break;
    case strDisplayIconLarge:
		setDisplayVars(DISPLAY_ICONLARGE);
		break;
    case strDisplayTiles:
		setDisplayVars(DISPLAY_TILES);
		break;
    case strDisplayThumb:
		setDisplayVars(DISPLAY_THUMB);
		break;
  }
  displayFolder(currentFolder);
}

function PluginCommand(command)
{
  var curIdx = 0;
  for (var i=0; i<rootFolders.length; i++) {
    if (rootFolders[i] == rootFolder) {
      curIdx = i;
      break;
    }
  }

  if (command == gddCmdToolbarBack) {
    if (curIdx == 0) {
      curIdx = rootFolders.length-1;
    }
    else {
      curIdx = curIdx-1;
    }
    rootFolder = rootFolders[curIdx];
  }
  if (command == gddCmdToolbarForward) {
    if (curIdx == rootFolders.length-1) {
      curIdx = 0;
    }
    else {
      curIdx = curIdx+1;
    }
    rootFolder = rootFolders[curIdx];
  }
  setDisplayVars( rootDisplays[curIdx] );
  gadget.debug.trace("Switched root folder to: "+rootFolder);
  displayFolder(rootFolder);
}

function setDisplayVars(mode)
{
  gadget.debug.trace("DisplayVars setting to "+mode);

  var curIdx = 0;
  for (var i=0; i<rootFolders.length; i++) {
    if (rootFolders[i] == rootFolder) {
      rootDisplays[i] = mode;
      break;
    }
  }

  switch (mode)
  {
    case DISPLAY_LIST:
		contentItemWidth = cnAreaDiv.width;
		contentItemHeight = 16;
		break;
    case DISPLAY_ICONSMALL:
		contentItemWidth = 24;
		contentItemHeight = 24;
		break;
    case DISPLAY_ICONLARGE:
		contentItemWidth = 48;
		contentItemHeight = 48;
		break;
    case DISPLAY_TILES:
		contentItemWidth = cnAreaDiv.width;
		contentItemHeight = 42;
		break;
    case DISPLAY_THUMB:
		contentItemWidth = cnAreaDiv.width;
		contentItemHeight = Math.floor( cnAreaDiv.width / 1.33333333333 );
		break;
  }
  displayStart = 0;
  displayMode = mode;
  displayRowItems = Math.floor( cnAreaDiv.width / contentItemWidth );
  displayLines = Math.floor( cnAreaDiv.height / contentItemHeight );
  displayItemCount = displayRowItems * displayLines;
  displayItemCount = (displayItemCount>0)?displayItemCount:1;
  cnArea.maxContentItems = displayItemCount;
  gadget.debug.trace("DisplayVars set successfully");
}

/*
QuickLaunch File Functions
*/
function displayFolder(displayFolder)
{
  //plugin.closeDetailsView();

  if (!filesystem.FolderExists( displayFolder ))
  {
    gadget.debug.error("Folder doesn't exist: "+displayFolder);
    return;
  }

  gadget.debug.trace("DisplayFolder: "+displayFolder);
  currentFolder = displayFolder;
  cnArea.removeAllContentItems();
  imageRatioStorage = null;
  imageDataStorage = null;
  imageRatioStorage = new Object();
  imageDataStorage = new Object();
 
  contentCounter = 0;
  displayFolderHeader();

  var e,di,fi;
  var folder = filesystem.GetFolder(displayFolder);
  var files = folder.Files;
  var folders = folder.subFolders;
  fileCounter = 0;

  e = new Enumerator(folders);
  for (; !e.atEnd(); e.moveNext())
  {
    di = e.item();
    if (di.attributes & ATTR_NORMAL ||
        di.attributes & ATTR_DIRECTORY ||
        di.attributes & ATTR_READONLY ||
        di.attributes & ATTR_ARCHIVE
       )
    {
      addFolder(di);
      fileCounter++;
    }
  }

  e = new Enumerator(files);
  for (; !e.atEnd(); e.moveNext())
  {
    fi = e.item();
    if (fi.attributes & ATTR_NORMAL ||
        fi.attributes & ATTR_READONLY ||
        fi.attributes & ATTR_ARCHIVE
       )
    {
      addFile(fi);
      fileCounter++;
    }
  }

  if (contentCounter+displayStart >= fileCounter) {
    tbNext.opacity = 100;
    tbNext.enabled = false;
  } else {
    tbNext.opacity = 255;
    tbNext.enabled = true;
  }

  if (displayStart > 0) {
    tbPrevious.opacity = 255;
    tbPrevious.enabled = true;
  } else {
    tbPrevious.opacity = 100;
    tbPrevious.enabled = false;
  }

}

function addFile(fileItem)
{
  if (fileCounter < displayStart) return false;
  if (fileCounter >= displayStart+displayItemCount) return false;

  gadget.debug.trace("Adding File: "+fileItem.Name);
  var item = new ContentItem();
  item.onDrawItem = DrawItem;
  item.onGetHeight = GetItemHeight;
  
  var ext = getExtension(fileItem.Name);
  if (ext != null) {
    ext = ext.toLowerCase();
  }

  if (previewPicture && previewPictureExt.indexOf(ext+";") != -1)
  {
    item.onDetailsView = detailsViewPicture;
  }
  else if (previewText && previewTextExt.indexOf(ext+";") != -1)
  {
    item.onDetailsView = detailsViewText;
  }
  else
  {
    if (options.getValue("launchSingle")) {
      item.onDetailsView = openFile;
    }
    else {
      item.onDetailsView = doNothing;
    }
  }
  item.onOpenItem = openFile;
  item.heading = fileItem.Name;
  item.source = fileItem.Path;
  item.tooltip = fileItem.Name+"\n"+getHumanSize(fileItem.size);
  item.snippet = "Detailed description";
  item.flags = gddContentItemFlagNoRemove;
  item.image = graphics.loadImage( framework.system.getFileIcon( fileItem.Path+"\\"+fileItem.Name ) );
  setContentItemRect(item);
  cnArea.addContentItem(item, gddItemDisplayInSidebar);
  contentCounter++;

  return true;
}

function addFolder(fileItem)
{
  if (fileCounter < displayStart) return false;
  if (fileCounter >= displayStart+displayItemCount) return false;

  gadget.debug.trace("Adding Folder: "+fileItem.Name);
  var item = new ContentItem();
  item.onDrawItem = DrawItem;
  item.onGetHeight = GetItemHeight;
  item.onOpenItem = openFile;
  item.onDetailsView = OpenSubFolder;
  item.heading = fileItem.Name;
  item.tooltip = fileItem.Name;
  item.source = fileItem.Path;
  item.flags = gddContentItemFlagNoRemove;
  item.image = graphics.loadImage("ql_images/folder.png");
  setContentItemRect(item);
  cnArea.addContentItem(item, gddItemDisplayInSidebar);
  contentCounter++;

  return true;
}

function setContentItemRect(item)
{
  try
  {
    var itemX = contentCounter%displayRowItems;
    var itemY = (displayRowItems>1)?Math.floor(contentCounter/displayRowItems):contentCounter;
    item.setRect(
               itemX*contentItemWidth, 
               itemY*contentItemHeight, 
               contentItemWidth, 
               contentItemHeight
         );
  }
  catch (E)
  {
    gadget.debug.error("SetContetnItemRect(): "+E.description);
  }
}

function displayFolderHeader()
{
  //gadget.debug.trace("FolderHeader: "+currentFolder + " <> " + rootFolder);
  if (currentFolder != rootFolder)
  {
    tbParent.enabled = true;
    tbParent.opacity = 255;
  }
  else
  {
    tbParent.enabled = false;
    tbParent.opacity = 100;
  }
}

/*
QuickLaunch View Functions
*/
function view_onOpen() {
  // Set default options
  options.putDefaultValue("revertRoot", true);
  options.putDefaultValue("launchSingle", true);
  options.putDefaultValue("previewFiles", true);
  options.putDefaultValue("extensions", ".txt;.log;.cfg");
  options.putDefaultValue("iconLeft", true);
  options.putDefaultValue("filesystemContext", true);

  plugin.onAddCustomMenuItems = AddCustomMenuItems;
  plugin.onShowOptionsDlg = ShowOptionsDlg;
  plugin.onCommand = PluginCommand;
  if (rootFolders.length > 1) {
    plugin.plugin_flags = gddPluginFlagToolbarBack | gddPluginFlagToolbarForward;
  }
  else {
    plugin.plugin_flags = gddPluginFlagNone;
  }

  options.putDefaultValue("rootFolder", "C:\\");
  options.putDefaultValue("rootFolders", ["C:\\"]);
  options.putDefaultValue("rootDisplays", [DISPLAY_LIST]);
  rootFolder = options.getValue("rootFolder");
  rootFolders = options.getValue("rootFolders");
  rootDisplays = options.getValue("rootDisplays");

  if (filesystem.FolderExists( rootFolder )) rootFolder = filesystem.getFolder( rootFolder );
  view_onSize();

  setDisplayVars(displayMode);
  displayFolder(rootFolder);
}

function view_onSize() {
  //gadget.debug.trace("onSize: "+view.width+"x"+view.height);
  if (view.height < 100) view.height = 100;

//  background.width = view.width;
//  background.height = view.height;
  cnAreaDiv.y = 0;
  cnAreaDiv.x = 0;
  cnAreaDiv.width = view.width;
  cnAreaDiv.height = view.height - toolBar.height;
  toolBar.width = cnAreaDiv.width;
  toolBar.x = 0;
  toolBar.y = view.height-toolBar.height;
  tbNext.x = toolBar.width - 16;
  tbPrevious.x = toolBar.width - 32;
  tbRefresh.x = toolBar.width - 52;
  tbContext.x = toolBar.width - 68;

  setDisplayVars(displayMode);
  displayFolder(currentFolder);
}

function view_onSizing() {
  if (event.height < 100) {
    event.height = 100;
    view.resizeTo(event.width, event.height);
  }
  if (view.height < 100) {
    view.height = 100;
  }
  gadget.debug.trace("Sizing() called");
}

/*
Special Buttons Toolbar
*/
function toolbar_ParentFolder() {
  if (!filesystem.FolderExists( currentFolder )) return;
  var fo = filesystem.getFolder(currentFolder);
  displayStart = 0;
  displayFolder(fo.ParentFolder);
}

function toolbar_GoRoot() {
  displayStart = 0;
  displayFolder(rootFolder);
}

function toolbar_Refresh() {
  displayStart = 0;
  displayFolder(currentFolder);
}

function toolbar_Previous() {
  displayStart -= displayItemCount;
  displayFolder(currentFolder);
}

function toolbar_Next() {
  displayStart += displayItemCount;
  displayFolder(currentFolder);
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

function DrawItem(item, display_target, graphics, x, y, width, height)
{
  switch (displayMode)
  {
    case DISPLAY_LIST:
		var iconleft = options.getValue("iconLeft");
		if (item.image != null)
		{
		  if (iconleft) {
		    graphics.DrawImage(x, y, height, height, item.image, 100);
		  }
		  else {
		    graphics.DrawImage(width-height, y, height, height, item.image, 100);
		  }
		}
		if (iconleft) {
		  graphics.DrawText(x+height+3, y, width, height, item.heading, 
		     gddColorNormalText, 0, gddFontNormal);
		}
		else {
		  graphics.DrawText(x, y, width-height-3, height, item.heading, 
		     gddColorNormalText, 0, gddFontNormal);
		}
		break;
    case DISPLAY_TILES:
		if (item.image != null)
		{
		  graphics.DrawImage(x, y, height, height, item.image, 100);
		}
		var str = item.heading;
		var fsi = null;
		if (filesystem.FileExists(item.source)) fsi = filesystem.getFile(item.source);
		if (filesystem.FolderExists(item.source)) fsi = filesystem.getFolder(item.source);
		if (fsi != null) {

		  try {
                    if ( fsi.Attributes > 1024 ) {
                      //gadget.debug.trace("Skipping Alias "+fsi.Name);
                    }
		    else
                    if ( fsi.Attributes == 17 || fsi.Attributes == 18) {
                      //gadget.debug.trace("Skipping 17/18 "+fsi.Name);
                    }
                    else {
		      str += "\n"+getHumanSize(fsi.Size);
                    }
		  }
		  catch (E) {
		    gadget.debug.error("Tiles information (Size) error: "+fsi.Attributes);
		  }

		  try {
		    str += "\n"+fsi.Type;
		  }
		  catch (E) {
		    gadget.debug.error("Tiles information (Type) error: "+E.description);
		  }
		}

		graphics.DrawText(x+height+3, y, width, height, str, gddColorNormalText, 
		   0, gddFontNormal);
		break;
    case DISPLAY_ICONSMALL:
		if (item.image != null)
		{
		  graphics.DrawImage(x, y, height, height, item.image, 100);
		}
		break;
    case DISPLAY_ICONLARGE:
		if (item.image != null)
		{
		  graphics.DrawImage(x, y, height, height, item.image, 100);
		}
		break;
    case DISPLAY_THUMB:
		var ext = getExtension(item.source);
		ext = ext.toLowerCase();
		if (previewPictureExt.indexOf(ext+";") != -1)
		{
                  var srcRatio = 1;
                  if (imageRatioStorage[item.source] == undefined) {
                    gadget.debug.trace("Getting Ratio from image");
                    tempImage.src = item.source;
                    srcRatio = tempImage.srcWidth/tempImage.srcHeight;
                    imageRatioStorage[item.source] = srcRatio;
                  }
                  else {
                    gadget.debug.trace("Getting Ratio from cache");
                    srcRatio = imageRatioStorage[item.source];
                  }
                  var targetRatio = (width)/(height);
                  var img = null;
		  if (imageDataStorage[item.source] == undefined) {
		    img = framework.graphics.loadImage( item.source );
		    imageDataStorage[item.source] = img;
		  }
		  else {
		    img = imageDataStorage[item.source];
		  }
                  var posx, posy, newwidth, newheight;
                  if (srcRatio > targetRatio) {
                    newwidth = width;
                    newheight = newwidth/srcRatio;
                  }
                  else {
                    newheight = height;
                    newwidth = newheight*srcRatio;
                  }
                  posx = (width)/2 - (newwidth/2);
                  posy = (height)/2 - (newheight/2);
		  graphics.DrawImage(x+posx, y+posy, newwidth, newheight, img, 100);
		}

		if (item.image != null)
		{
		  graphics.DrawImage(x+4, y+4, 32, 32, item.image, 100);
		}
		break;
  }
}

function detailsViewPicture(item)
{
  if (detailsViewOpen && detailsViewItem == item.source) {
    plugin.closeDetailsView();
    return;
  }

  var details = new DetailsView();
  details.detailsViewData.putValue("imagePath", item.source );
  details.SetContent(undefined, undefined, "detailsview.xml", false, 0);
  plugin.showDetailsView(details, "", gddDetailsViewFlagNone, detailsViewFeedback);
  detailsViewItem = item.source;
  detailsViewOpen = true;
}

function detailsViewText(item)
{
  if (detailsViewOpen && detailsViewItem == item.source) {
    plugin.closeDetailsView();
    return;
  }

  try
  {
    var fp = filesystem.OpenTextFile(item.source, 1, false);
    var s = "";
    var counter = 0;
    while (!fp.AtEndOfStream) {
      s += fp.ReadLine();
      s += "\n";
      counter++;
      if (counter >= 50) break;
    }
    fp.close();

    var detailsView = new DetailsView();
    detailsView.html_content = false;
    detailsView.setContent("", undefined, s, false, 0);

    plugin.showDetailsView(detailsView, item.heading, gddDetailsViewFlagNone, detailsViewFeedback); 
  }
  catch (E)
  {
    gadget.debug.error("detailsViewText: "+E.description);
  }
}

function detailsViewFeedback(item)
{
  detailsViewOpen = false;
}

function closeDetails()
{
  plugin.closeDetailsView();
}

function openFile(item)
{
  //plugin.closeDetailsView();
  var wSh = new ActiveXObject( "WScript.Shell" );
  gadget.debug.trace("Running: "+item.source);
  try
  {
    wSh.Run( "\""+item.source+"\"" );
  }
  catch (E) {
    wSh.Run( "explorer \""+item.source+"\"" );
  }

  if ( options.getValue("revertRoot") ) {
    displayFolder( rootFolder );
  }
}

function doNothing(item)
{
  return false;
}

/*
Helper Functions
*/
function getHumanSize(bytes)
{
  var ext = new Array();
  ext[0] = "Bytes";
  ext[1] = "KB";
  ext[2] = "MB";
  ext[3] = "GB";
  ext[4] = "TB";
  var size = 0;
  while (bytes > 1024) {
    bytes /= 1024;
    size++;
  }
  return Math.round(bytes*100)/100+" "+ext[size];
}

function getExtension(name)
{
  return name.substring( name.lastIndexOf(".") );
}
