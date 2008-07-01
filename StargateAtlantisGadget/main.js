var feedVideos = "http://www.scifi.com/atlantis/includes/admin/pulse_preview.xml";
var feedTunein = "http://www.scifi.com/atlantis/includes/admin/atlantis_v2.xml";
var refreshInterval = null;
var parser = null;
var videos = [];
var lastAnim = null;
var vidExpanded = false;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strRefresh, 0, OnMenuClicked);
  menu.AddItem(strGadgetPage, 0, OnMenuClicked);
  menu.AddItem(strAtlantisPage, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strRefresh) {
    requestFeed();
  }
  if (itemText == strGadgetPage) {
    openUrl("http://www.desktop-gadgets.net/atlantis/");
  }
  if (itemText == strAtlantisPage) {
    openUrl("http://www.scifi.com/atlantis/");
  }
}

function view_onOpen() {
  plugin.onAddCustomMenuItems = AddCustomMenuItems;

  showVideo1();

  requestFeed();
}

function requestFeed() {
  clearTimeout(refreshInterval);
  gadget.debug.trace("Loading Feeds ...");
  var d = new Date();

  var req = new XMLHttpRequest();
  req.open('GET', feedTunein+"?uid="+d.getTime(), true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        loadingText.visible = false;
        parser = new SimpleXmlParser(req.responseText);
   
        // get the channel information
        var items = parser.getItems("site");
        displayTunein(items);
      }
      else {
        loadingText.visible = true;
        loadingText.innerText = strNoInternet;
        debug.gadget.error("Error loading page\n");
      }
    }
  };
  req.send(null);

  var req2 = new XMLHttpRequest();
  req2.open('GET', feedVideos+"?uid="+d.getTime(), true);
  req2.onreadystatechange = function (aEvt) {
    if (req2.readyState == 4) {
      if (req2.status == 200) {
        loadingText.visible = false;
        parser = new SimpleXmlParser(req2.responseText);
   
        // get the channel information
        var items = parser.getItems("video");
        displayVideos(items);
      }
      else {
        loadingText.visible = true;
        loadingText.innerText = strNoInternet;
        debug.gadget.error("Error loading page\n");
      }
    }
  };
  req2.send(null);
  refreshInterval = setTimeout("requestFeed()", 3600000);
}

function displayTunein(items) {
  var item = items[0];
  var tunein = item["tunein"];
  tunein = tunein.replace("<br />", "\n");
  labelTuneIn.innerText = tunein.trim();  
}

function displayVideos(items) {
  var vid = null;
  for (var i=0; i<items.length; i++) {
    vid = new Video();
    vid.setImg( items[i]["@largeImg"] );
    vid.setTitle( items[i]["@title"] );
    vid.setLink( "http://video.scifi.com/player/?id=" + items[i]["@link"] );
    videos.push( vid );
  }
  vid = videos[0];
  img1.src = ajaxPicture( vid.getImg() );
  title1.innerText = vid.title;

  vid = videos[1];
  img2.src = ajaxPicture( vid.getImg() );
  title2.innerText = vid.title;

  vid = videos[2];
  img3.src = ajaxPicture( vid.getImg() );
  title3.innerText = vid.title;

  vid = videos[3];
  img4.src = ajaxPicture( vid.getImg() );
  title4.innerText = vid.title;

  vid = videos[4];
  img5.src = ajaxPicture( vid.getImg() );
  title5.innerText = vid.title;

}

function openUrl(url) {
  gadget.debug.trace("Opening URL: "+url);
  if (url == "") {
    return;
  }
  var wsh = new ActiveXObject( "WScript.Shell" );
  wsh.Run( url ); 
}

function showVideo1() {
  if (lastAnim == 1) return;
  lastAnim = 1;
  beginAnimation("video1.y = event.value;", video1.y, 5, 300);
  beginAnimation("video2.y = event.value;", video2.y, 125, 300);
  beginAnimation("video3.y = event.value;", video3.y, 160, 300);
  beginAnimation("video4.y = event.value;", video4.y, 195, 300);
  beginAnimation("video5.y = event.value;", video5.y, 230, 300);

  expandVideo1();
  collapseVideo2();
  collapseVideo3();
  collapseVideo4();
  collapseVideo5();
}

function showVideo2() {
  if (lastAnim == 2) return;
  lastAnim = 2;
  beginAnimation("video1.y = event.value;", video1.y, 5, 300);
  beginAnimation("video2.y = event.value;", video2.y, 40, 300);
  beginAnimation("video3.y = event.value;", video3.y, 160, 300);
  beginAnimation("video4.y = event.value;", video4.y, 195, 300);
  beginAnimation("video5.y = event.value;", video5.y, 230, 300);

  collapseVideo1();
  expandVideo2();
  collapseVideo3();
  collapseVideo4();
  collapseVideo5();
}

function showVideo3() {
  if (lastAnim == 3) return;
  lastAnim = 3;
  beginAnimation("video1.y = event.value;", video1.y, 5, 300);
  beginAnimation("video2.y = event.value;", video2.y, 40, 300);
  beginAnimation("video3.y = event.value;", video3.y, 75, 300);
  beginAnimation("video4.y = event.value;", video4.y, 195, 300);
  beginAnimation("video5.y = event.value;", video5.y, 230, 300);

  collapseVideo1();
  collapseVideo2();
  expandVideo3();
  collapseVideo4();
  collapseVideo5();
}

function showVideo4() {
  if (lastAnim == 4) return;
  lastAnim = 4;
  beginAnimation("video1.y = event.value;", video1.y, 5, 300);
  beginAnimation("video2.y = event.value;", video2.y, 40, 300);
  beginAnimation("video3.y = event.value;", video3.y, 75, 300);
  beginAnimation("video4.y = event.value;", video4.y, 110, 300);
  beginAnimation("video5.y = event.value;", video5.y, 230, 300);

  collapseVideo1();
  collapseVideo2();
  collapseVideo3();
  expandVideo4();
  collapseVideo5();
}

function showVideo5() {
  if (lastAnim == 5) return;
  lastAnim = 5;
  beginAnimation("video1.y = event.value;", video1.y, 5, 300);
  beginAnimation("video2.y = event.value;", video2.y, 40, 300);
  beginAnimation("video3.y = event.value;", video3.y, 75, 300);
  beginAnimation("video4.y = event.value;", video4.y, 110, 300);
  beginAnimation("video5.y = event.value;", video5.y, 145, 300);

  collapseVideo1();
  collapseVideo2();
  collapseVideo3();
  collapseVideo4();
  expandVideo5();
}

function expandVideo1() {
  beginAnimation("video1.height = event.value;", video1.height, 115, 300);
  beginAnimation("img1.width = event.value;", img1.width, 160, 300);
  beginAnimation("img1.height = event.value;", img1.height, 90, 300);
  beginAnimation("title1.x = event.value;", title1.x, 5, 300);
  beginAnimation("title1.y = event.value;", title1.y, 95, 300);
  beginAnimation("title1.width = event.value;", title1.width, 180, 300);
}

function expandVideo2() {
  beginAnimation("video2.height = event.value;", video2.height, 115, 300);
  beginAnimation("img2.width = event.value;", img2.width, 160, 300);
  beginAnimation("img2.height = event.value;", img2.height, 90, 300);
  beginAnimation("title2.x = event.value;", title2.x, 5, 300);
  beginAnimation("title2.y = event.value;", title2.y, 95, 300);
  beginAnimation("title2.width = event.value;", title2.width, 180, 300);
}

function expandVideo3() {
  beginAnimation("video3.height = event.value;", video3.height, 115, 300);
  beginAnimation("img3.width = event.value;", img3.width, 160, 300);
  beginAnimation("img3.height = event.value;", img3.height, 90, 300);
  beginAnimation("title3.x = event.value;", title3.x, 5, 300);
  beginAnimation("title3.y = event.value;", title3.y, 95, 300);
  beginAnimation("title3.width = event.value;", title3.width, 180, 300);
}

function expandVideo4() {
  beginAnimation("video4.height = event.value;", video4.height, 115, 300);
  beginAnimation("img4.width = event.value;", img4.width, 160, 300);
  beginAnimation("img4.height = event.value;", img4.height, 90, 300);
  beginAnimation("title4.x = event.value;", title4.x, 5, 300);
  beginAnimation("title4.y = event.value;", title4.y, 95, 300);
  beginAnimation("title4.width = event.value;", title4.width, 180, 300);
}

function expandVideo5() {
  beginAnimation("video5.height = event.value;", video5.height, 115, 300);
  beginAnimation("img5.width = event.value;", img5.width, 160, 300);
  beginAnimation("img5.height = event.value;", img5.height, 90, 300);
  beginAnimation("title5.x = event.value;", title5.x, 5, 300);
  beginAnimation("title5.y = event.value;", title5.y, 95, 300);
  beginAnimation("title5.width = event.value;", title5.width, 180, 300);
}

function collapseVideo1() {
  beginAnimation("video1.height = event.value;", video1.height, 30, 300);
  beginAnimation("img1.width = event.value;", img1.width, 35, 300);
  beginAnimation("img1.height = event.value;", img1.height, 20, 300);
  beginAnimation("title1.x = event.value;", title1.x, 45, 300);
  beginAnimation("title1.y = event.value;", title1.y, 8, 300);
  beginAnimation("title1.width = event.value;", title1.width, 140, 300);
}

function collapseVideo2() {
  beginAnimation("video2.height = event.value;", video2.height, 30, 300);
  beginAnimation("img2.width = event.value;", img2.width, 35, 300);
  beginAnimation("img2.height = event.value;", img2.height, 20, 300);
  beginAnimation("title2.x = event.value;", title2.x, 45, 300);
  beginAnimation("title2.y = event.value;", title2.y, 8, 300);
  beginAnimation("title2.width = event.value;", title2.width, 140, 300);
}

function collapseVideo3() {
  beginAnimation("video3.height = event.value;", video3.height, 30, 300);
  beginAnimation("img3.width = event.value;", img3.width, 35, 300);
  beginAnimation("img3.height = event.value;", img3.height, 20, 300);
  beginAnimation("title3.x = event.value;", title3.x, 45, 300);
  beginAnimation("title3.y = event.value;", title3.y, 8, 300);
  beginAnimation("title3.width = event.value;", title3.width, 140, 300);
}

function collapseVideo4() {
  beginAnimation("video4.height = event.value;", video4.height, 30, 300);
  beginAnimation("img4.width = event.value;", img4.width, 35, 300);
  beginAnimation("img4.height = event.value;", img4.height, 20, 300);
  beginAnimation("title4.x = event.value;", title4.x, 45, 300);
  beginAnimation("title4.y = event.value;", title4.y, 8, 300);
  beginAnimation("title4.width = event.value;", title4.width, 140, 300);
}

function collapseVideo5() {
  beginAnimation("video5.height = event.value;", video5.height, 30, 300);
  beginAnimation("img5.width = event.value;", img5.width, 35, 300);
  beginAnimation("img5.height = event.value;", img5.height, 20, 300);
  beginAnimation("title5.x = event.value;", title5.x, 45, 300);
  beginAnimation("title5.y = event.value;", title5.y, 8, 300);
  beginAnimation("title5.width = event.value;", title5.width, 140, 300);
}


function viewVideo1() {
  var vid = videos[0];
  openUrl( vid.link );
}

function viewVideo2() {
  var vid = videos[1];
  openUrl( vid.link );
}

function viewVideo3() {
  var vid = videos[2];
  openUrl( vid.link );
}

function viewVideo4() {
  var vid = videos[3];
  openUrl( vid.link );
}

function viewVideo5() {
  var vid = videos[4];
  openUrl( vid.link );
}

function toggleVideoBlock() {
  if (vidExpanded) {
    beginAnimation("divVideoBlock.height = event.value;", divVideoBlock.height, 25, 500);
    beginAnimation("divVideoBlock.y = event.value;", divVideoBlock.y, 255, 500);
    vidExpanded = false;
  }
  else {
    beginAnimation("divVideoBlock.height = event.value;", divVideoBlock.height, 280, 500);
    beginAnimation("divVideoBlock.y = event.value;", divVideoBlock.y, 0, 500);
    vidExpanded = true;
  }
}

function showAtlantis() {
  openUrl("http://www.scifi.com/atlantis/");
}
