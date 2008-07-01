var numEyes = 8;
var numNose = 3;
var numMouth = 8;

var curEyes = 1;
var curNose = 1;
var curMouth = 1;

var sounds = [];
var curSound = null;

// Adds our plugin specific items to the menu
function AddCustomMenuItems(menu) {
  menu.AddItem(strSounds, options.getValue("sounds")?gddMenuItemFlagChecked:0, OnMenuClicked);
  menu.AddItem(strGadget, 0, OnMenuClicked);
}

function OnMenuClicked(itemText) {
  if (itemText == strSounds) {
    options.putValue("sounds", !options.getValue("sounds"));
    if (!options.getValue("sounds")) {
      framework.audio.stop( curSound );
    }
  }
  if (itemText == strGadget) {
    framework.openUrl( "http://www.desktop-gadgets.net/pumpkin/" );     
  }
}

function view_onOpen() {

  plugin.onAddCustomMenuItems = AddCustomMenuItems;

  sounds.push("Annoying Witch Laugh.mp3");
  sounds.push("Cat Screetch 03.mp3");
  sounds.push("Door Creak 01.mp3");
  sounds.push("Ghostly 02.mp3");
  sounds.push("Heart Beat 01.mp3");
  sounds.push("Heart Beat 02.mp3");
  sounds.push("Scream Female 03.mp3");
  sounds.push("Wicked Laugh Witch 02.mp3");
  sounds.push("Wolf Howl 06.mp3");

  options.putDefaultValue("eyes", 1);
  options.putDefaultValue("nose", 1);
  options.putDefaultValue("mouth", 1);
  options.putDefaultValue("sounds", true);

  setEyes( options.getValue("eyes") );
  setNose( options.getValue("nose") );
  setMouth( options.getValue("mouth") );
}

function getIDPic(prefix, id) {
  var idStr = "images\\"+prefix+"_";
  if (id < 10) {
    idStr += "0";
  }
  idStr += id;
  idStr += ".png";
  gadget.debug.trace("New Image: "+idStr);
  return idStr;
}

function setEyes(id) {
  eyes.src = getIDPic("eyes", id);
  curEyes = id;
  options.putValue("eyes", id);
}

function setNose(id) {
  nose.src = getIDPic("nose", id);
  curNose = id;
  options.putValue("nose", id);
}

function setMouth(id) {
  mouth.src = getIDPic("mouth", id);
  curMouth = id;
  options.putValue("mouth", id);
}


function eyes_onclick() {
  if (curEyes < numEyes) {
    setEyes(curEyes+1);
  }
  else {
    setEyes(1);
  }
  playRandomSound();
}

function nose_onclick() {
  if (curNose < numNose) {
    setNose(curNose+1);
  }
  else {
    setNose(1);
  }
  playRandomSound();
}

function mouth_onclick() {
  if (curMouth < numMouth) {
    setMouth(curMouth+1);
  }
  else {
    setMouth(1);
  }
  playRandomSound();
}

Array.prototype.random = function() {
  var i = this.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = this[i];
     var tempj = this[j];
     this[i] = tempj;
     this[j] = tempi;
   }
}

function playRandomSound() {
  var doSound = options.getValue("sounds");
  if (!doSound) return;

  var play = (Math.random()<0.3);
  if (play) {
    sounds.random();
    var sound = sounds[0];
    framework.audio.stop(curSound);
    curSound = framework.audio.play("sounds\\"+sound);
  }
}