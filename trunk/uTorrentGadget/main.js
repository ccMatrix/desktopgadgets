view.caption = "µTorrent Gadget";

var isMinimized = false;
var curData = null;

var detailsViewOpen = false;
var detailsView=null;

var interface_ip;
var interface_port;
var interface_username;
var interface_password;

/*
 * Status constants
 */
var STATUS_STARTED = 1;
var STATUS_CHECKING = 2;
var STATUS_STARTAFTER = 4;
var STATUS_CHECKED = 8;
var STATUS_ERROR = 16;
var STATUS_PAUSED = 32;
var STATUS_QUEUED = 64;
var STATUS_LOADED = 128;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strLaunchInterface, 0, OnMenuClicked);
	menu.AddItem(strHelp, 0, OnMenuClicked);
  menu.AddItem("-", 0x800, OnMenuClicked);
  menu.AddItem(menu_complete, show_completed?gddMenuItemFlagChecked:0, OnMenuClicked);
  menu.AddItem(menu_stop, show_stopped?gddMenuItemFlagChecked:0, OnMenuClicked);
  menu.AddItem(menu_start, show_started?gddMenuItemFlagChecked:0, OnMenuClicked);
  menu.AddItem(menu_seeding, show_seeding?gddMenuItemFlagChecked:0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  switch (itemText)
  {
		case strHelp:
			framework.openUrl( "http://www.desktop-gadgets.net/utorrent/" );
			break;
    case strLaunchInterface:
			launchInterface();
			break;
    case menu_complete:
			show_completed = !show_completed;
			options.putValue("show_completed", show_completed);
			displayData(curData);
			break;
    case menu_stop:
			show_stopped = !show_stopped;
			options.putValue("show_stopped", show_stopped);
			displayData(curData);
			break;
    case menu_start:
			show_started = !show_started;
			options.putValue("show_started", show_started);
			displayData(curData);
			break;
    case menu_seeding:
			show_seeding = !show_seeding;
			options.putValue("show_seeding", show_seeding);
			displayData(curData);
			break;
  }
}

/*
µTorrent View Functions
*/
function view_onOpen() {
  plugin.onAddCustomMenuItems = AddCustomMenuItems;
  plugin.onShowOptionsDlg = ShowOptionsDlg;

  view_onSize();
  loadOptionsData();
  requestData();
}

function view_onSize() {
  //gadget.debug.trace("onSize: "+view.width+"x"+view.height);
  if (view.height < 40) view.height = 40;

  toolbar.y = view.height - toolbar.height - 2;
  //optionbar.x = view.width-optionbar.width;
  torrentLogo.x = view.width-25;

  torrentListDiv.y = 30;
  torrentListDiv.x = 5;
  torrentListDiv.width=view.width-10;
  torrentListDiv.height=view.height-torrentListDiv.y-toolbar.height;

  scrollarea.x=torrentListDiv.width-scrollarea.width;
  scrollarea.y=0;
  scrollarea.height=torrentListDiv.height;
  sb.height=scrollarea.height+20;

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

function launchInterface() {
  var wsh = new ActiveXObject( "WScript.Shell" );
  wsh.Run( "http://"+interface_username+":"+interface_password+"@"+interface_ip+":"+interface_port+"/gui/" ); 
}

function onMinimize() {
  debug.trace('Minimized');
  isMinimized = true;
  displayData(curData);
}

function onRestore() {
  debug.trace('Restored');
  isMinimized = false;
  displayData(curData);
}

function sb_onchange(){
  torrentList.y=-sb.value;
}

function view_onSizing() {
  gadget.debug.trace("Sizing() called");
  loadOptionsData();
}

function displayData(data) {
  if (data == null) {
    //plugin.ShowOptionsDialog();
    torrentList.removeAllElements();
    displayNotification(ERROR_CONNECT);
    lblUp.innerText = "";
    lblDown.innerText = "";
    setTimeout("requestData()", 5000);
    return;
  }

	curData = data;

  setTimeout("requestData()", 5000);

  btnRun.visible=false;
  btnStop.visible=false;
  btnInfo.visible=false;

  var totalDown = 0;
  var totalUp = 0;
  var activeValid=false;
  torrentList.removeAllElements();
  torrentList.itemHeight = 32;
  for (var i=0; i<data["torrents"].length; i++) {
    var torrent = data["torrents"][i];
    if ((torrent[1] | STATUS_LOADED) == torrent[1]) {
      totalUp += torrent[8];
      totalDown += torrent[9];
      // gadget.debug.trace("Percent: "+(torrent[4]/10));
      itemTitle = torrent[2].toString()+" ("+formatSize(torrent[3])+")";
      itemContent = "";
      if ( (torrent[1] | STATUS_PAUSED) == torrent[1]) {
        if (!show_stopped) continue;
        itemContent = "paused";
      }
      else if ( (torrent[1] | STATUS_STARTED) == torrent[1]) {
        if (torrent[18] == 0) {
          if (!show_seeding) continue;
          itemContent = "seeding";
        }
        else {
          if (!show_started) continue;
          itemContent = formatSpeed(torrent[9])+" "+formatTime(torrent[10]);
        }
      }
      else {
        if (torrent[18] == 0) {
          if (!show_completed) continue;
          itemContent = "finished";
        }
        else {
          if (!show_stopped) continue;
          itemContent = "stopped";
        }
      }

      itemTitle = itemTitle.validXML();
      itemContent = itemContent.validXML();

      var item = "<listitem name=\""+torrent[0].toString()+"\" height=\"32\" width=\"100%\">";
          item += "<div y=\"14\" height=\"2\" width=\""+(torrent[4]/10)+"%\" background=\"#70A070\"></div>";
          item += "<label tooltip=\""+itemTitle+"\" size=\"8\" y=\"0\" color=\"#FFFFFF\" height=\"16\">";
          item += itemTitle;
          item += "</label>";
          item += "<label size=\"8\" y=\"16\" color=\"#FFFFFF\" height=\"16\">";
          item += itemContent;
          item += "</label>";
          item += "</listitem>";
      torrentList.appendElement( item );
      if (torrent[0] == active_torrentID)
      {
        //gadget.debug.trace("ActiveTorrent is still valid at pos "+(torrentList.children.count-1));
        torrentList.selectedIndex=torrentList.children.count-1;
        activeValid=true;
      }
    }
  }
  if (!activeValid) active_torrentID=null;

  //gadget.debug.trace("Down: "+totalDown+" Up: "+totalUp);
  lblUp.innerText = formatSpeed(totalUp);
  lblDown.innerText = formatSpeed(totalDown);

  if (isMinimized) {
    view.caption = "Down: "+formatSpeed(totalDown)+" Up: "+formatSpeed(totalUp);
  }
  else {
    view.caption = "µTorrent Gadget";
  }

  if (active_torrentID != null) {
    selectTorrent();
  }

  torrentList.height=torrentList.children.count*torrentList.itemHeight;
  if (torrentList.height < torrentListDiv.height) {
		if (torrentList.y < 0) {
			torrentList.y = 0;
		}
    torrentList.height = torrentListDiv.height;
  }
  sb.max=torrentList.children.count*torrentList.itemHeight-torrentListDiv.height;
  if (sb.max<0) sb.max=0;
}

function selectTorrent() {
  if (torrentList.selectedIndex >= 0) {
    if (torrentList.selectedItem.name == "OPTIONS") {
      plugin.ShowOptionsDialog();
      torrentList.selectedIndex = -1;
      return;
    }
    else if (torrentList.selectedItem.name == "") {
      return;
    }
   
    active_torrentID=torrentList.selectedItem.name;
    // gadget.debug.trace("selected torrent is: "+active_torrentID);
    if (show_completed || show_stopped) {
      btnRun.visible=true;
    }
    if (show_started || show_seeding) {
      btnStop.visible=true;
    }
    btnInfo.visible=true;
  }
}

function unSelectTorrent() {
  torrentList.selectedIndex = -1;
  active_torrentID=null;
  btnStop.visible=false;
  btnRun.visible=false;
  btnInfo.visible=false;
  if (detailsViewOpen) {
    plugin.closeDetailsView();
  }
}

function startTorrentUI() {
  if (active_torrentID != null) {
    startTorrent( active_torrentID );
  }
}

function stopTorrentUI() {
  if (active_torrentID != null) {
    stopTorrent( active_torrentID );
  }
}

function addTorrentUI() {
  var url = view.prompt("Add new Torrent\nEnter URL:", "");
  if (url != null) {
    addTorrent( url );
  }
}

function infoTorrentUI() {
  if (active_torrentID != null) {
    if (detailsViewOpen) {
      plugin.closeDetailsView();
      detailsViewOpen=false;
    }
    else {
      details = new DetailsView();
      var torrentID = torrentList.selectedItem.name.toString();
      details.detailsViewData.putValue("torrent", torrentID );
      details.SetContent(undefined, undefined, "detailsview.xml", false, 0);
      plugin.showDetailsView(details, "", gddDetailsViewFlagNone, onDetailsClose);
      detailsViewOpen=true;
    }
  }
}

function onDetailsClose() {
  detailsViewOpen=false;
}

function displayNotification(message) {
  torrentList.removeAllElements();
  var item = "<listitem name=\"OPTIONS\" height=\"100%\" width=\"100%\"><label width=\""+torrentList.width+"\" wordWrap=\"true\" vAlign=\"top\" color=\"#FFFFFF\" size=\"8\" y=\"0\" height=\"100%\">";
  item += message;
  item += "</label></listitem>";
  torrentList.itemHeight = "100%";
  torrentList.appendElement(item);
}