var active_torrentID = null;
var interface_ip;
var interface_port;
var interface_username;
var interface_password;


function detailsview_onopen() {
  gadget.debug.trace( detailsViewData.getValue("test") );
  loadOptionsData();
  
  active_torrentID = detailsViewData.getValue("torrent");
  gadget.debug.trace("Detailsview for "+active_torrentID);

  data = getTorrentData(getTorrentInterface());
  if (data == null) return;
  // Find active torrent
  var torrent = null;
  for (var i=0; i<data["torrents"].length; i++) {
    torrent = data["torrents"][i];
    if (torrent[0].toString() == active_torrentID) {
      break;
    }
  }
  torrentName.innerText = torrent[2];
  view.caption = torrent[2];
  info_size.innerText = formatSize( torrent[3] );
  info_downloaded.innerText = formatSize( torrent[5] );
  info_uploaded.innerText = formatSize( torrent[6] );

  info_seeds.innerText = torrent[14]+" ("+torrent[15]+")";
  info_peers.innerText = torrent[12]+" ("+torrent[13]+")";
  avail = Math.round(torrent[16]/65.535)/1000;
  info_avail.innerText = avail;

  info_percent.innerText = (torrent[4]/10)+"%";
  progressBar.width = (torrent[4]/10)+"%";

  info_upstream.innerText = formatSpeed( torrent[8] );
  info_downstream.innerText = formatSpeed( torrent[9] );
  info_eta.innerText = formatTime( torrent[10] );
}