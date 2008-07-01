var lastDigits = {"d0":-1,"d1":-1,"d2":-1,"d3":-1};
var months = strMonths.split(",");
var days = strDays.split(",");
var timezones = new Array(13,12,11,10,9.5,9,8,7,6.5,6,5.5,5,4,3.5,3,2,1,0,-1,-2,-3,-3.5,-4,-5,-6,-7,-8,-9,-10,-11);
var timezoneStrings = new Array();
var timezoneNames = new Array(
		"New Zealand Daylight Savings Time",
		"International Date Line East",
		"East Australian Daylight Savings Time",
		"East Australian Time",
		"Central Australian Time",
		"Japan Time",
		"China Coast Time",
		"West Australian Time",
		"North Sumatra",
		"Russian Federation Zone 5",
		"Indian",
		"Russian Federation Zone 4",
		"Russian Federation Zone 3",
		"Iran",
		"Baghdad Time/Moscow Time",
		"Eastern Europe Time",
		"Central European Time",
		"Universal Time Coordinated",
		"West Africa Time",
		"Azores Time",
		"Atlantic Time",
		"Newfoundland",
		"Atlantic Time",
		"Eastern Time",
		"Central Time",
		"Mountain Time",
		"Pacific Time",
		"Alaskan Time",
		"Aleutians-Hawaii Time",
		"Nome Time"
);

function AddCustomMenuItems(menu) {
	menu.AddItem(strFormat12, (options.getValue("format")==12)?gddMenuItemFlagChecked:0, OnMenuClicked);
	menu.AddItem(strFormat24, (options.getValue("format")==24)?gddMenuItemFlagChecked:0, OnMenuClicked);
	var timezone = menu.AddPopup(strTimezone);
	timezone.AddItem(strDisplay, options.getValue("displayZone")?gddMenuItemFlagChecked:0, OnMenuClicked);
	timezone.AddItem("-", 0x800, 0);
	for (var i=0; i<timezoneStrings.length; i++) {
		var sel = 0;
		if (options.getValue("timezone") == timezones[i]) {
			sel = gddMenuItemFlagChecked;
		}
		timezone.AddItem(timezoneStrings[i], sel, OnSetTimezone);
	}
	menu.AddItem(strDaylight, options.getValue("daylight")?gddMenuItemFlagChecked:0, OnMenuClicked);
	menu.AddItem(strHelp, 0, OnMenuClicked);
}

function OnSetTimezone(timezone) {
	debug.trace("Selected: "+timezone);
	for (var i=0; i<timezoneStrings.length; i++) {
		if (timezoneStrings[i] == timezone) {
			options.putValue("timezone", timezones[i]);
			options.putValue("timezoneName", timezone[i]);
		}
	}
}

function OnMenuClicked(itemText) {
	if (itemText == strHelp) {
		framework.openUrl( "http://www.desktop-gadgets.net/digitalclock/" ); 
	}
	else if (itemText == strFormat12) {
		options.putValue("format", 12);
	}
	else if (itemText == strFormat24) {
		options.putValue("format", 24);
	}
	else if (itemText == strDaylight) {
		options.putValue("daylight", !options.getValue("daylight") );
	}
	else if (itemText == strDisplay) {
		options.putValue("displayZone", !options.getvalue("displayZone") );
	}
}

function view_onOpen() {
	// Create timezone Strings
	for (var i=0; i<timezones.length; i++) {
		var tz = timezones[i];
		var tzString = "(UTC";
		if (tz%1 == 0) {
			if (tz > 0) tzString += "+";
			if (tz != 0) tzString += tz;
		}
		else {
			var start = tz-tz%1;
			var end = tz%1*60;
			if (end<0) end *= -1;
			if (start < 0) {
				tzString += start+":"+end;
			}
			else if (start > 0) {
				tzString += "+"+start+":"+end;
			}
		}
		tzString += ") ";
		tzString += timezoneNames[i];
		timezoneStrings.push(tzString);
	}

	// Insert Default Timezone to options:
	var d = calcTime(0);
	var tz = (d.getTimezoneOffset()/60)*-1;
	if (isDaylightSaving(nd)) tz -= 1;
	debug.trace("Default Timezone: "+tz);
	options.putDefaultValue("timezone", tz );
	for (var i=0; i<timezones.length; i++) {
		if (timezones[i] == tz) {
			options.putDefaultValue("timezoneName", timezoneNames[i]);
		}
	}
	options.putDefaultValue("displayZone", false);
	options.putDefaultValue("daylight", isDaylightSaving(nd));

	if (typeof(plugin) != "undefined") {
		plugin.onAddCustomMenuItems = AddCustomMenuItems;
	}
	options.putDefaultValue("format", 24);
	setInterval("animClock();", 1000);


	debug.trace( calcTime("San Francisco", -7) );
}

function animClock() {
	var d = calcTime( options.getValue("timezone") );
	var hour = d.getHours().toString();
	if (options.getValue("format") == 12) {
		if (d.getHours() > 12) {
			hour = d.getHours()-12;
			hour = hour.toString();
		}
	}
	if (hour.length == 1) hour = "0"+hour;
  var min = d.getMinutes().toString();
	if (min.length == 1) min = "0"+min;
	dateLabel.innerText = days[d.getDay()]+" "+d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear();
	var s = hour+min;
	setDigit("d0", s.charAt(0));
	setDigit("d1", s.charAt(1));
	setDigit("d2", s.charAt(2));
	setDigit("d3", s.charAt(3));
	dot.visible = !dot.visible;
	if (options.getValue("displayZone")) {
		labelTimezone.innerText = options.getValue("timezoneName");
	}
	else {
		labelTimezone.innerText = "";
	}
}

function setDigit(ele, digit) {
	if (lastDigits[ele] != digit) {
		debug.trace("Animating "+ele+" from "+lastDigits[ele]+" to "+digit);
		$(ele+"p1new").src = "images/e"+digit+"-p1.png";
		$(ele+"p2new").src = "images/e"+digit+"-p2.png";
		$(ele+"p1old").src = "images/e"+lastDigits[ele]+"-p1.png";
		$(ele+"p2old").src = "images/e"+lastDigits[ele]+"-p2.png";
		$(ele+"p2new").height = 0;
		$(ele+"p2old").height = 20;
		$(ele+"p2old").y = 23;
		beginAnimation("$(\""+ele+"p1old\").height = event.value; $(\""+ele+"p1old\").y = 20-event.value;", 20, 0, 100);
		setTimeout("beginAnimation(\"$(\\\""+ele+"p2new\\\").height = event.value;\", 0, 20, 100);", 100);
		lastDigits[ele] = digit;
	}
}

function $(name) {
	return clockDigits.children.item(name);
}

// function to calculate local time
// in a different city
// given the city's UTC offset
function calcTime(offset) {
	// create Date object for current location
	d = new Date();
   
	// convert to msec
	// add local time zone offset
	// get UTC time in msec
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
   
	// create new Date object for different city
	// using supplied offset
	nd = new Date(utc + (3600000*offset));
	if (options.getValue("daylight")) {
		nd.setHours( nd.getHours()+1 );
	}
	return nd;
}

function isDaylightSaving(d) {
  var rightNow = d;
  var date1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);
  var date2 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0);
  var temp = date1.toGMTString();
  var date3 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
  var temp = date2.toGMTString();
  var date4 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
  var hoursDiffStdTime = (date1 - date3) / (1000 * 60 * 60);
  var hoursDiffDaylightTime = (date2 - date4) / (1000 * 60 * 60);
  if (hoursDiffDaylightTime == hoursDiffStdTime) {
		return false;
  }
	else {
		return true;
	}
}