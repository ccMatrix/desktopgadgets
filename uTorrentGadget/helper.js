/*
Helper functions
*/
var vbs = new ActiveXObject("MSScriptControl.ScriptControl");
vbs.language = "vbscript";

String.prototype.escapeVBS = function()
{
       var str = this;
       str = str.replace(/"/g, '""');
       str = str.replace(/\r/g, '" + Chr(13) + "');
       str = str.replace(/\n/g, '" + Chr(10) + "');
       return str;
}

String.prototype.validXML = function()
{
	var str = this;
	str = str.replace(/&/g, '');
	str = str.replace(/</g, '');
	str = str.replace(/>/g, '');
	return str;
}

function prompt(a, b, c)
{
  return vbs.eval("InputBox(\"" + a.escapeVBS() + "\", \"" + b.escapeVBS() + "\", \"" + c.escapeVBS() + "\")");
}

function formatSize(bytes) {
  if (bytes > 1024*1024*1024) {
    return Math.round(bytes/1024/1024/1024*100)/100+"GB";
  }
  if (bytes > 1024*1024) {
    return Math.round(bytes/1024/1024*10)/10+"MB";
  }
  if (bytes > 1024) {
    return Math.round(bytes/1024)+"KB";
  }
}

function formatSpeed(bytesSec) {
  if (bytesSec > 1024*1024) {
    return Math.round(bytesSec/1024/1024*10)/10+"MB/s";
  }
  if (bytesSec > 1024) {
    return Math.round(bytesSec/1024*10)/10+"KB/s";
  }
  else {
    return Math.round(bytesSec*10)/10+"B/s";
  }
}

function formatTime(seconds) {
  if (seconds < 0) return "";

  var minutes = 0;
  var hours = 0;
  var days = 0;
  var weeks = 0;
  if (seconds >= 60) {
    minutes = Math.floor(seconds/60);
    seconds = seconds-minutes*60;
  }
  if (minutes >= 60) {
    hours = Math.floor(minutes/60);
    minutes = minutes-hours*60;
  }
  if (hours >= 24) {
    days = Math.floor(hours/24);
    hours = hours-days*24;
  }
  if (days >= 7) {
    weeks = Math.floor(days/7);
    days -= weeks*7;
  }
  var res = "";
  var resCounter=0;

  if (weeks > 0 && resCounter < 2) {
    res += weeks+"w ";
    resCounter++;
  }
  if (days > 0 && resCounter < 2) {
    res += days+"d ";
    resCounter++;
  }
  if (hours > 0 && resCounter < 2) {
    res += hours+"h ";
    resCounter++;
  }
  if (minutes > 0 && resCounter < 2) {
    res += minutes+"m ";
    resCounter++;
  }
  if (seconds > 0 && resCounter < 2) {
    res += seconds+"s ";
    resCounter++;
  }
  return res;
}