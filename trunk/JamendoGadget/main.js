var albumId = 0;
var albumUrl = "";
var albumTracks = 0;
var trackTitles;
var trackUrls;
var trackLength;

var SEARCHMODE_TAG = 0;
var SEARCHMODE_ALBUM = 1;
var SEARCHMODE_ARTIST = 2;

var searchMode = SEARCHMODE_TAG;
var currentPlayback = null;

plugin.onAddCustomMenuItems = AddCustomMenuItems;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strHelp, 0, OnMenuClicked);
  menu.AddItem(strJamendo, 0, OnMenuClicked);
  var modes = menu.AddPopup(strModes);
  modes.AddItem(strTag, (searchMode==SEARCHMODE_TAG)?gddMenuItemFlagChecked:0, setSearchMode);
  modes.AddItem(strAlbum, (searchMode==SEARCHMODE_ALBUM)?gddMenuItemFlagChecked:0, setSearchMode);
  modes.AddItem(strArtist, (searchMode==SEARCHMODE_ARTIST)?gddMenuItemFlagChecked:0, setSearchMode);
}

function OnMenuClicked(itemText) {
  if (itemText == strHelp) {
    framework.openUrl( "http://www.desktop-gadgets.net/jamendo/" ); 
  }
  if (itemText == strJamendo) {
    framework.openUrl( "http://www.jamendo.com/" ); 
  }
}

function setSearchMode(modeText) {
  switch (modeText) {
    case strTag: searchMode = SEARCHMODE_TAG; break;
    case strAlbum: searchMode = SEARCHMODE_ALBUM; break;
    case strArtist: searchMode = SEARCHMODE_ARTIST; break;
  }
  curMode.innerText = modeText;
}

function view_onOpen() {
  redraw();
  clearDisplay();
}

function edit_keypress() {
  gadget.debug.trace("Keycode: "+event.keyCode);
  switch (event.keyCode) {
    case 13: jamendo_search(); break;
    case 9: event.returnValue = false; break;
  }
}

function jamendo_search() {
  var searchText = searchQuery.value;
  searchText = searchText.replace(" ", "+");
  searchText = escape(searchText);
  var url = "";
  switch (searchMode) {
    case SEARCHMODE_TAG: url = "http://www.jamendo.com/get/album/name/tag/page/plain/"+searchText+"/?n=1&o=random"; break;
    case SEARCHMODE_ALBUM: url = "http://www.jamendo.com/get/album/name/tag/page/plain/"+searchText+"/?n=1&o=random"; break;
    case SEARCHMODE_ARTIST: url = "http://www.jamendo.com/get/album/name/artist/page/plain/"+searchText+"/?n=1&o=random"; break;
  }
  clearDisplay();
  name_album.innerText = strSearching;
  ajaxCall(url, "displayAlbum");
}

function clearDisplay() {
  name_artist.innerText = "";
  name_album.innerText = "";
  albumcover.src="images/jamendo_logo.png";
  albumId = 0;
  albumTracks = 0;
  albumUrl = "http://www.jamendo.com/";
  trackList.removeAllElements();
  trackTitles = new Array(0);
  trackUrls = new Array(0);
  trackLength = new Array(0);
}

function displayAlbum(data) {
  if (data.length == 0) {
    name_album.innerText = strNothing;
    return;
  }

  albumUrl = data;
  albumId = data.substr(0, data.length-1);
  albumId = albumId.substr(albumId.lastIndexOf("/")+1);

  albumcover.src = ajaxPicture("http://img.jamendo.com/albums/"+albumId+"/covers/1.400.jpg");

  var detailUrl = "http://www.jamendo.com/get/album/id/album/desc1/plain/"+albumId+"/";
  ajaxCall(detailUrl, "displayAlbumDetails");

  var tracksTitle = "http://www.jamendo.com/get/track/id/album/audio/pls/"+albumId+"/";
  ajaxCall(tracksTitle, "displayAlbumTracks");
}

function displayAlbumDetails(data) {
  data = data.split(" : ");
  name_artist.innerText = data[0];
  name_album.innerText = data[1];
}

function displayAlbumTracks(data) {
  if (data.length == 0) return;
  if (data.indexOf("\n") > 0) {
    data = data.split("\n");
  }
  else {
    tmp = data;
    data = new Array(1);
    data[0] = tmp;
  }
  albumTracks = data[1].split("=")[1];
  gadget.debug.trace("Tracks: "+albumTracks);
  trackTitles = new Array(albumTracks);
  trackUrls = new Array(albumTracks);
  trackLength = new Array(albumTracks);
  for (var i=0; i<albumTracks; i++) {
    trackUrls[i] = data[ (i*3)+2 ].split("=")[1];
    trackTitles[i] = data[ (i*3)+3 ].split("=")[1].split(" - ")[1];
    trackLength[i] = data[ (i*3)+4 ].split("=")[1];
  }
  drawTrackList();
}

function albumWebsite() {
  var wsh = new ActiveXObject( "WScript.Shell" );
  wsh.Run( albumUrl ); 
}

function playTrack() {
  if (trackList.selectedIndex < 0) trackList.selectedIndex = 0;

  gadget.debug.trace("Stream is: "+trackUrls[trackList.selectedIndex]);
  nowplaying.innerText = trackTitles[trackList.selectedIndex];
  stopTrack();
  currentPlayback = framework.audio.play(trackUrls[trackList.selectedIndex]);
}

function stopTrack() {
  if (currentPlayback != null) {
    framework.audio.stop(currentPlayback);
    currentPlayback = null;
  }
}

function nextTrack() {
  gadget.debug.trace("Next Track: "+trackList.selectedIndex+" Max is "+albumTracks);
  if (trackList.selectedIndex < albumTracks-1) {
    trackList.selectedIndex += 1;
  }
  else {
    trackList.selectedIndex = 0;
  }
  stopTrack();
  playTrack();
}

function previousTrack() {
  gadget.debug.trace("Previous Track: "+trackList.selectedIndex);
  if (trackList.selectedIndex > 0) {
    trackList.selectedIndex -= 1;
  }
  else {
    trackList.selectedIndex = albumTracks-1;
  }
  stopTrack();
  playTrack();
}

function formatSeconds(seconds) {
  var minutes = 0;
  if (seconds > 60) {
    minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;
  }
  if (seconds < 10) seconds = "0"+seconds;
  return minutes+":"+seconds;
}

function drawTrackList() {
  trackList.removeAllElements();
  for (var i=0; i<albumTracks; i++) {
    var item = "<listitem id=\""+i+"\" height=\"20\" cursor=\"hand\" width=\"100%\">";
    item += "<img src=\"images\\audio-volume-medium.white.png\" x=\"2\" height=\"16\" width=\"16\" />";
    item += "<label x=\"18\" width=\""+(trackListDiv.width-18-27-15)+"\" valign=\"middle\">"+trackTitles[i]+"</label>";
    item += "<label x=\""+(trackListDiv.width-25-15)+"\" width=\"25\" valign=\"middle\" align=\"right\">"+formatSeconds(trackLength[i])+"</label>";
    item += "</listitem>";
    trackList.appendElement(item);
  }
}

function redraw() {
  if (view.height < 100) view.height = 100;

  bg_div.width = view.width-(bg_div.x*2);
  bg_div.height = view.height-(bg_div.x*2);
  searchQuery.width = search_btn.x-curMode.x-curMode.width-(bg_div.x*2);
  searchQuery.x = curMode.x+curMode.width+bg_div.x;
  search_btn.x = view.width-search_btn.width-bg_div.x-2;
  search_btnLabel.x = search_btn.x;
  if (view.width < 160) {
    searchQuery.width = view.width-curMode.width-curMode.x-(bg_div.x*3);
    search_btn.visible = false;
    search_btnLabel.visible = false;
  }
  else {
    search_btn.visible = true;
    search_btnLabel.visible = true;
  }
  splitter.width = view.width-splitter.x-(bg_div.x*2);
  trackListDiv.x = (bg_div.x*2);
  trackListDiv.width = view.width-(bg_div.x*4);
  trackListDiv.height = view.height-trackListDiv.y-controls.height-(bg_div.x*2);
  controls.x = view.width-controls.width-(bg_div.x*2);
  controls.y = view.height-controls.height-(bg_div.x*2);
  nowplaying.x = bg_div.x*2;
  nowplaying.y = view.height-nowplaying.height-(bg_div.x*2);
  nowplaying.width = view.width-controls.width-(bg_div.x*4);
  nowplaying.visible = (view.width >= 160);
  name_artist.x = albumcover.x+albumcover.width+bg_div.x;
  name_artist.width = splitter.width;
  name_album.x = albumcover.x+albumcover.width+bg_div.x;
  name_album.width = splitter.width;
  // Designspecific objects:
  var correction = Math.ceil(view.width / 100)+3;
  design_corner_tl.x = 0;
  design_corner_tl.y = 0;
  design_corner_tr.x = view.width-design_corner_tr.width;
  design_corner_tr.y = 0;
  design_corner_bl.x = 0;
  design_corner_bl.y = view.height-design_corner_bl.height;
  design_corner_br.x = view.width-design_corner_br.width;
  design_corner_br.y = view.height-design_corner_br.height;
  design_left.x = 0;
  design_left.y = design_corner_tl.height-2;
  design_left.height = view.height-design_corner_tl.height-design_corner_bl.height+correction;
  design_right.x = view.width-design_right.width;
  design_right.y = design_corner_tr.height-2;
  design_right.height = view.height-design_corner_tr.height-design_corner_br.height+correction;
  design_top.x = design_corner_tl.height-2;
  design_top.y = 0;
  design_top.width = view.width-design_corner_tl.width-design_corner_tr.width+correction;
  design_bottom.x = design_corner_bl.width;
  design_bottom.y = view.height-design_bottom.height;
  design_bottom.width = view.width-design_corner_bl.width-design_corner_br.width+correction;
  design_center.x = design_corner_tl.width-2;
  design_center.y = design_corner_tr.width-2
  design_center.width = design_top.width;
  design_center.height = design_right.height;
  drawTrackList();
}

function redrawTest() {
  gadget.debug.trace("Width: "+event.width+", Height: "+event.height);
}

function undock() {
  gadget.debug.trace("Undocked");
  view.width=300;
  view.height=250;
  redraw();
}