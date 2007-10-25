/*
Options Dialog
*/

function ShowOptionsDlg(wnd) {
  wnd.AddControl(gddWndCtrlClassLabel, 0, "", strOptionsRoot, 10, 10, 260, 20);
  options_rootFolders = wnd.AddControl(gddWndCtrlClassList, gddWndCtrlTypeListDrop, "rootFolders", rootFolders, 10, 25, 210, 25);

  options_addFolder = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonPush, "addFolder", "+", 225, 25, 25, 20);
  options_addFolder.onClicked = OnAddFolder;
  options_removeFolder = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonPush, "removeFolder", "-", 255, 25, 25, 20);
  options_removeFolder.enabled = (rootFolders.length > 1);
  options_removeFolder.onClicked = OnRemoveFolder;

  options_revert = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "revert", strOptionRevert, 10, 50, 260, 20);
  options_revert.value = options.getValue("revertRoot");

  options_single = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "single", strOptionSingle, 10, 75, 260, 20);
  options_single.value = options.getValue("launchSingle");

  options_preview = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "preview", strOptionPreview, 10, 100, 260, 20);
  options_preview.value = options.getValue("previewFiles");

  wnd.AddControl(gddWndCtrlClassLabel, 0, "", strOptionExtension, 30, 120, 260, 20);
  options_extensions = wnd.AddControl(gddWndCtrlClassEdit, 0, "extensions", options.getValue("extensions"), 30, 140, 250, 20);

  options_iconleft = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "iconleft", strOptionIconleft, 10, 165, 260, 20);
  options_iconleft.value = options.getValue("iconLeft");

  options_context = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "context", strOptionContext, 10, 190, 260, 20);
  options_context.value = options.getValue("filesystemContext");
  options_context.enabled = false;

  wnd.onClose = OptionsDlgClosed;
  
}

function OptionsDlgClosed(wnd, code) {
  if (code != gddIdOK) {
    return;
  }
  
  // Save options
  options.putValue("revertRoot", options_revert.value);
  options.putValue("launchSingle", options_single.value);
  options.putValue("previewFiles", options_preview.value);
  options.putValue("iconLeft", options_iconleft.value);
  options.putValue("filesystemContext", options_context.value);
  options.putValue("extensions", options_extensions.value);

  rootFolder = options_rootFolders.value;
  options.putValue("rootFolder", rootFolder);
  options.putValue("rootFolders", rootFolders);
  options.putValue("rootDisplays", rootDisplays);

  if (rootFolders.length > 1) {
    plugin.plugin_flags = gddPluginFlagToolbarBack | gddPluginFlagToolbarForward;
  }
  else {
    plugin.plugin_flags = gddPluginFlagNone;
  }

  displayFolder(rootFolder);

  return true;
}

function OnAddFolder(wnd, control) {
  /*
  var filename = BrowseForFile("Any File|*.*");
  if (filename == null) return;
  var folder = filesystem.GetParentFolderName(filename);
  rootFolders.push(folder);
  rootDisplays.push(DISPLAY_LIST);
  var BLANK_SPACE = " ";
  */
	var oShell = new ActiveXObject("Shell.Application");

	var oFolder = new Object;					
  oFolder = oShell.BrowseForFolder(0, strOptionsNewRoot, 1|16|32|512);

  if (oFolder == null) {
    gadget.debug.trace("Cancelled");
    return;
  }
  var oFolderItem = new Object;		
	oFolderItem = oFolder.Items().Item();

  var folder = oFolderItem.Path;
  gadget.debug.trace("Folder: "+folder),

  rootFolders.push(folder);
  rootDisplays.push(DISPLAY_LIST);

  options_rootFolders.text = rootFolders;
  options_removeFolder.enabled = (rootFolders.length > 1);
}

function OnRemoveFolder(wnd, control) {
  var folder = options_rootFolders.value;
  var msg = msgRemove.replace(/%s/, folder);
  var newFolders = [];
  var newDisplays = [];
  if (confirm(msg)) {
    for (var i=0; i<rootFolders.length; i++) {
      if (rootFolders[i] != folder) {
        newFolders.push( rootFolders[i] );
        newDisplays.push( rootDisplays[i] );
      }
    }
    rootFolders = newFolders;
    rootDisplays = newDisplays;
    options_rootFolders.text = rootFolders;
    options_removeFolder.enabled = (rootFolders.length > 1);
  }
}