var filesystem = framework.system.filesystem;
var checkInterval = 1000*60*60; // One hour
var VistaExecutable = "";

var SPECIAL_FOLDER_TEMP = 2;
var OPEN_FORREADING = 1;

function Game() {
  this.name = "";
  this.icon = "";
  this.exe = "";
}
Game.prototype.setName = function(n) {
  this.name = n;
}
Game.prototype.getName = function() {
  return this.name;
}
Game.prototype.setIcon = function(i) {
  this.icon = i;
}
Game.prototype.getIcon = function() {
  return this.icon;
}
Game.prototype.setExe = function(e) {
  this.exe = e;
}
Game.prototype.getExe = function() {
  return this.exe;
}
Game.prototype.setBoxArt = function(ba) {
  this.boxArt = ba;
}
Game.prototype.getBoxArt = function() {
  if (this.boxArt == "") return "";
  var req = new XMLHttpRequest();
  req.open('GET', this.boxArt, false); 
  req.send(null);
  if(req.status == 200)
    return req.responseStream;
}

function getGamesList() {
  var list = converJSONtoObjects(getGamesData());
  list.sort(sortGames);
  return list;
}

function sortGames(game1, game2) {
  var names = [ game1.getName(), game2.getName() ];
  names.sort();
  if (names[0] == game1.getName()) {
    return -1;
  }
  else {
    return 1;
  }
}

function getGamesData() {
  var lastCheck = options.getValue("LastCatCheck");
  var now = new Date();
  gadget.debug.trace("LastCheck: "+lastCheck);
  gadget.debug.trace("Now: "+now.getTime());
  var data = null;
  if ( (lastCheck+(1*checkInterval)) < now.getTime()) {
    gadget.debug.trace("Requesting data from registry");
    data = getGamesRegistry();
    options.putValue("GamesJSON", data);
    options.putValue("LastCatCheck", now.getTime());
  }
  else {
    gadget.debug.trace("Requesting data from internal cache");
    data = options.getValue("GamesJSON");
  }
  return data.parseJSON();
}

function converJSONtoObjects(json) {
  gadget.debug.trace("Converting JSON data into object array");
  var outGames = [];
  for (var i=0; i<json.length; i++) {
    var game = new Game();
    game.setName( json[i]["Name"] );
    game.setIcon( json[i]["Icon"] );
    game.setExe( json[i]["Exe"] );
    game.setBoxArt( json[i]["BoxArt"] );
    outGames.push( game );
  }
  return outGames;
}

function getGamesRegistry() {
  getVistaExecutable()
  var exportCommand = VistaExecutable+" \"[FILENAME]\"";
  var tempDir = filesystem.GetSpecialFolder(SPECIAL_FOLDER_TEMP);
  var tempFile = tempDir+"\\VistaGamesExport.dat";
  exportCommand = exportCommand.replace("[FILENAME]", tempFile);
  gadget.debug.trace(tempFile);
  var wshShell = new ActiveXObject("WScript.Shell");
  gadget.debug.trace("Running: "+exportCommand);
  wshShell.run(exportCommand, 0, true);
  var fp = filesystem.OpenTextFile(tempFile, OPEN_FORREADING);
  var data = fp.ReadAll();
  fp.Close();
  gadget.debug.trace("Data successfully exported");
  return data;
}

function getVistaExecutable() {
  if (VistaExecutable == null)
  {
    VistaExecutable = gadget.storage.extract("VistaGamesExecutable.exe");
  }
  else if (!filesystem.FileExists(VistaExecutable))
  {
    VistaExecutable = gadget.storage.extract("VistaGamesExecutable.exe");
  }
  return VistaExecutable;
}