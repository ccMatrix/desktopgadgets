var volumeControl = null;
var muted = false;
var vistaMode = false;
var vistaFile = null;

plugin.onAddCustomMenuItems = AddCustomMenuItems;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strHelp, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strHelp) {
    framework.openUrl( "http://www.desktop-gadgets.net/volumecontrol/" ); 
  }
}

function view_onOpen()
{
  try {
    volumeControl = new volumeControlObj();
  } catch (e) {
    alert("Couldn't load the volumeControl DLL :(");
    event.returnValue = false;
    return;
  }
  var timeInterval = 2500;
  if (volumeControl.isWinVista() == 1)
  {
    gadget.debug.trace("Switching to Vista Mode");
    timeInterval = 3500;
    vistaMode = true;
  }
  else
  {
    vistaMode = false;
  }

  refreshGadget();
  setInterval( "refreshGadget()", timeInterval);
}

function view_onminimize()
{
  event.returnValue = false;
  return false;
}

function refreshGadget()
{
  var mutedPrev = muted;
  muted = getMute();
  var systemCurrent = getVolume();
  var gadgetCurrent = getVolFromPos();
  var diff = systemCurrent - gadgetCurrent;

  // gadget.debug.trace("SysVol: "+systemCurrent+" GadgetVol: "+gadgetCurrent+" with diff: "+diff);

  if (diff > 2 || diff < -2)
  {
    // gadget.debug.trace("Setting new volume");
    getVol();
  }
  setVolumeIcon();
}

// Set/Get Volume
//
function setVol()
{
  var volume = getVolFromPos();
  if (!muted)
  {
    if (vistaMode)
    {
      var wsh = new ActiveXObject( "WScript.Shell" );
      gadget.debug.trace( "Running file for SetVolume: "+getVistaExe());
      current = wsh.Run( "\""+getVistaExe()+"\" "+volume, 0, true );

    }
    else
    {
      volumeControl.setVolume(volume);
    }
  }
}

function getVolFromPos()
{
  return volumeSlider.value;
}

function getVol()
{
  volumeSlider.value = getVolume();
  setVolumeIcon();
}

function getVolume()
{
  var current = 0;
  if (vistaMode)
  {
    var wsh = new ActiveXObject( "WScript.Shell" );
    gadget.debug.trace( "Running file: "+getVistaExe());
    current = wsh.Run( getVistaExe(), 0, true );
  }
  else
  {
    current = volumeControl.getVolume();
  }
  return current;
}

function getMute() {
  if (vistaMode)
  {
    var wsh = new ActiveXObject( "WScript.Shell" );
    gadget.debug.trace( "Running file: "+getVistaExe());
    return wsh.Run( "\""+getVistaExe()+"\" mute -1 ", 0, true );
  }
  else
  {
    return (volumeControl.isMute() == 1);
  }
}

function setVolumeIcon()
{
  if (muted)
  {
    soundIcon.src="image\\sound_mute.png";
  }
  else
  {
    var vol = getVolFromPos();
    soundIcon.src = "image\\sound.png";
    if (vol < 60) soundIcon.src = "image\\sound_low.png";
    if (vol < 20) soundIcon.src = "image\\sound_none.png";
  }
}

function mute()
{
  muted = !muted;
  if (vistaMode)
  {
    var wsh = new ActiveXObject( "WScript.Shell" );
    gadget.debug.trace( "Running file: "+getVistaExe());
    wsh.Run( "\""+getVistaExe()+"\" mute "+(muted?1:0), 0, true );
  }
  else
  {
    volumeControl.toggleMute();
  }
  setVolumeIcon();
}

function jumpVol()
{
  setVol();
  setVolumeIcon();
}

function redraw() {
  if (view.height != bgleft.height) view.height = bgleft.height;
  if (view.width < 90) view.width = 90;

  bgleft.X = 0;
  bgright.X = view.width-bgright.width;
  bgcenter.X = bgleft.width-30;
  bgcenter.width = view.width-bgright.width-bgleft.width+60;
  volumeSlider.width = view.width-soundIcon.X-soundIcon.width-20;
  if (volumeSlider.width > 500) volumeSlider.width = 500;
}

function getVistaExe() {
  if (vistaFile == null)
  {
    vistaFile = gadget.storage.extract("VolumeControlVista.exe");
  }
  else if (!framework.system.filesystem.FileExists(vistaFile))
  {
    vistaFile = gadget.storage.extract("VolumeControlVista.exe");
  }
  return vistaFile;
}