/*
Copyright 2008 Benjamin Schirmer (codename.matrix@gmail.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var __CAL_INSTANCE = null;

function CalendarPicker(data) {
	__CAL_INSTANCE = this;

	this.currentDraw = new Date();
	this.currentBoxes = new Array();
	this.caller = null;
	this.value = new Date();

	// Options
	this.weekStart = 1; // 1 = monday, 0 = sunday

	// Strings (Day/Month)
	this.weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "So"];
	this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// Internal Variables and mods
	this.weekDays.unshift( this.weekDays[6] );
	this.cursorPos = 0;
	this.maxdays = 0;

	// Visual objects:
	this.divBox = null;
	this.closeBox = null;
	this.monthBox = null;
	this.yearBox = null;

	// Theme Variables
	this.themeWidth = 115;
	this.themeHeight = 115;
	this.themeOffset = 1;
	this.themeHoverBG = "#C0C0C0";
	this.themeBackground = "images/calendar_bg.jpg";

	this.onDatePicked = function() { };

	// If parameter is set
	if (data) {
		if (data.start) this.weekStart = data.start;
	}
}

/*
 * Create custom theme for calendar picker.
 * Parameters for constructor:
 * w = width of calendar box
 * h = height of calendar box
 * o = offset of background image to border
 * h = background color when a day/year is selected
 * b = background color or image
 */
function CalendarTheme(w, h, o, h, b) {
	this.width = w;
	this.height = h;
	this.offset = o;
	this.hoverbg = h;
	this.background = b;
}

/*
 * Set the theme for the calendar picker. data is of type CalendarTheme
 */
CalendarPicker.prototype.setTheme = function( data ) {
	if (data.width) this.themeWidth = data.width;
	if (data.height) this.themeHeight = data.height;
	if (data.offset) this.themeOffset = data.offset;
	if (data.hoverbg) this.themeHoverBG = data.hoverbg;
	if (data.background) this.themeBackground = data.background;
}

/*
 * Set the labels for the week days. Used for translation purposes
 * call setDayLabels(["Mo", "Tu", "We", "Th", "Fr", "Sa", "So"]);
 */
CalendarPicker.prototype.setDayLabels = function(labels) {
	this.weekDays = labels;
	this.weekDays.unshift( this.weekDays[6] );
}

/*
 * Set the labels for the months. Used for translation purposes
 * call setMonthLabels(["January", "February", ..., "November", "December"]);
 */
CalendarPicker.prototype.setMonthLabels = function(labels) {
	this.months = labels;
}

/*
 * ShowXXXX methods choose where to show the calendar
 * showBelow: below the object. left aligned with object
 * showRight: right of the object. top aligned with object
 * showAbove: above the object. left aligned with object
 * showLeft: left of the object. top aligned with object
 * showAuto: automatically determine position. priority below, right, left, above
 */
CalendarPicker.prototype.showBelow = function(obj) {
	this.caller = obj;
	this.showAt( this.getOffsetX(obj), this.getOffsetY(obj)+obj.height );
}

CalendarPicker.prototype.showRight = function(obj) {
	this.caller = obj;
	this.showAt( this.getOffsetX(obj)+obj.width, this.getOffsetY(obj) );
}

CalendarPicker.prototype.showAbove = function(obj) {
	this.caller = obj;
	this.showAt( this.getOffsetX(obj), this.getOffsetY(obj)-this.themeHeight );
}

CalendarPicker.prototype.showLeft = function(obj) {
	this.caller = obj;
	this.showAt( this.getOffsetX(obj)-this.themeWidth, this.getOffsetY(obj) );
}

CalendarPicker.prototype.showAuto = function(obj) {
	this.caller = obj;
	var _x = this.getOffsetX(obj);
	var _y = this.getOffsetY(obj);
	if ( (_x+this.themeWidth < view.width) && (_y+this.themeHeight < view.height) ) {
		this.showBelow(obj);
	}
	else if ( (_x+this.themeWidth < view.width) && (_y+this.themeHeight < view.height) ) {
		this.showRight(obj);
	}
	else if ( (_x-this.themeWidth > 0) && (_y+this.themeHeight < view.height) ) {
		this.showLeft(obj);
	}
	else if (_y-this.themeHeight > 0) {
		this.showAbove(obj);
	}
	else {
		debug.error("Panic - not enough space!!!");
	}
}

/*
 * determine global X offset of object. This will take care of objects inside nested divs.
 */
CalendarPicker.prototype.getOffsetX = function(ele) {
	var _x = ele.x;
	while (ele.parentElement) {
		ele = ele.parentElement;
		if (ele && ele.x) _x = _x + ele.x;
	}
	return _x;
}

/*
 * determine global Y offset of object. This will take care of objects inside nested divs.
 */
CalendarPicker.prototype.getOffsetY = function(ele) {
	var _y = ele.y;
	while (ele.parentElement) {
		ele = ele.parentElement;
		if (ele && ele.y) _y += ele.y;
	}
	return _y;
}

/*
 * Show calendar at this position.
 * _x and _y are the top-left corner of the calendar component
 */
CalendarPicker.prototype.showAt = function(_x, _y) {
	debug.trace( "Open at position "+_x+"x"+_y );

	var _this = this;

	// Underlaying close div. Clicking on this div will close the calendar
	this.closeBox = view.appendElement( "<div />" );
	this.closeBox.x = 0;
	this.closeBox.y = 0;
	this.closeBox.width = view.width;
	this.closeBox.height = view.height;
	this.closeBox.enabled = true;
	this.closeBox.onclick = function() { _this.close(); };
	this.closeBox.onrclick = function() { _this.close(); };
	this.closeBox.onkeydown = function() {
		debug.trace("Pressed key : "+event.keyCode);
		switch (event.keyCode) {
			case 27: // ESC
				setTimeout("__CAL_INSTANCE.close();", 25);
				break;
			case 36: // Pos1
				_this.currentDraw = new Date();
				_this.drawMonth();
				break;
			case 37: // Cursor left
				_this.currentDraw.setMonth( _this.currentDraw.getMonth() - 1 );
				_this.drawMonth();				
				break;
			case 39: // Cursor right
				_this.currentDraw.setMonth( _this.currentDraw.getMonth() + 1 );
				_this.drawMonth();
				break;
			case 38: // Cursor up
				if (_this.cursorPos > 0) {
					_this.resetBGColor("daybox"+_this.cursorPos);
				}
				_this.cursorPos -= 1;
				if (_this.cursorPos <= 0) {
					_this.cursorPos = _this.maxdays;
				}
				_this.switchBGColor("daybox"+_this.cursorPos);
				break;
			case 40: // Cursor down
				if (_this.cursorPos > 0) {
					_this.resetBGColor("daybox"+_this.cursorPos);
				}
				_this.cursorPos += 1;
				if (_this.cursorPos > _this.maxdays) {
					_this.cursorPos = 1;
				}
				_this.switchBGColor("daybox"+_this.cursorPos);
				break;
			case 13: // Enter
				if (_this.cursorPos > 0) {
					setTimeout("__CAL_INSTANCE.selectDay(__CAL_INSTANCE.cursorPos);", 25);
				}
				break;
			}
		};

	// Background image
	var divbg = this.closeBox.appendElement( "<img />" );
	divbg.x = _x;
	divbg.y = _y;
	divbg.width = this.themeWidth;
	divbg.height = this.themeHeight;
	divbg.src = this.themeBackground;

	// Div which holds the actual calendar control
	this.divBox = view.appendElement( "<div />" );
	this.divBox.x = _x+this.themeOffset;
	this.divBox.y = _y+this.themeOffset;
	this.divBox.width = this.themeWidth-(this.themeOffset*2);
	this.divBox.height = this.themeHeight-(this.themeOffset*2);
	this.divBox.enabled = true;

	// Label displaying current month and year
	this.monthLabel = this.divBox.appendElement( "<label />" );
	this.monthLabel.x = 10;
	this.monthLabel.y = 0;
	this.monthLabel.width = this.divBox.width-20;
	this.monthLabel.height = 16;
	this.monthLabel.bold = true;
	this.monthLabel.align = "center";
	this.monthLabel.valign = "bottom";
	this.monthLabel.size = 8;
	this.monthLabel.enabled = true;
	this.monthLabel.onrClick = function() {
		_this.chooseYearShow();
		};
	
	// Navigation Buttons/Links to move forward/backward between months
	var navPrev = this.divBox.appendElement( "<label />" );
	navPrev.x = 0;
	navPrev.y = 0;
	navPrev.width = 10;
	navPrev.height = 16;
	navPrev.enabled = true;
	navPrev.innerText = "«";
	navPrev.align = "left";
	navPrev.valign = "bottom";
	navPrev.cursor = "hand";
	navPrev.onclick = function() {
		_this.currentDraw.setMonth( _this.currentDraw.getMonth() - 1 );
		_this.drawMonth();
		};
	navPrev.ondblclick = function() {
		_this.currentDraw.setMonth( _this.currentDraw.getMonth() + 2 );
		_this.drawMonth();
		};

	var navNext = this.divBox.appendElement( "<label />" );
	navNext.x = this.divBox.width-10;
	navNext.y = 0;
	navNext.width = 10;
	navNext.height = 16;
	navNext.enabled = true;
	navNext.innerText = "»";
	navNext.align = "right";
	navNext.valign = "bottom";
	navNext.cursor = "hand";
	navNext.onclick = function() {
		_this.currentDraw.setMonth( _this.currentDraw.getMonth() + 1 );
		_this.drawMonth();
		};
	navNext.ondblclick = function() {
		_this.currentDraw.setMonth( _this.currentDraw.getMonth() + 2 );
		_this.drawMonth();
		};

	// Box containing the days and years to select.
	this.monthBox = this.divBox.appendElement( "<div />" );
	this.monthBox.x = 0;
	this.monthBox.y = 16;
	this.monthBox.width = this.divBox.width;
	this.monthBox.height = this.divBox.height-16;
	this.monthBox.background = "";

	this.drawMonth();
	this.closeBox.focus();
}

/*
 * Close the component. Will destroy the created elements
 */
CalendarPicker.prototype.close = function() {
	debug.trace("Closing calendar view");
	try {
		this.caller.focus();
		view.removeElement( this.divBox );
		view.removeElement( this.closeBox );
		this.divBox = null;
		this.closeBox = null;
	}
	catch (E) {
		debug.error(E.message);
	}
}

/*
 * Draw the current month into the monthBox area
 */
CalendarPicker.prototype.drawMonth = function() {
	debug.trace( "Drawing Month: "+this.currentDraw.getMonth() );

	// Every month change resets cursor position
	this.cursorPos = 0;
	var _this = this;

	this.monthLabel.innerText = this.months[this.currentDraw.getMonth()]+" "+this.currentDraw.getFullYear();

	this.monthBox.removeAllElements();
	var firstDay = new Date();
	firstDay.setDate(1);
	firstDay.setMonth( this.currentDraw.getMonth() );
	firstDay.setYear( this.currentDraw.getYear() );

	var lastDay = new Date();
	lastDay.setDate(1);
	lastDay.setMonth( this.currentDraw.getMonth()+1 );
	lastDay.setYear( firstDay.getYear() );
	lastDay.setDate( 0 );
	this.maxdays = lastDay.getDate();

	debug.trace( "First day is "+firstDay.toString());
	debug.trace( "Weekday is "+firstDay.getDay());
	debug.trace( "Last day is "+lastDay.toString());

	for (var i=0; i<7; i++) {
		var daybox = this.monthBox.appendElement( "<label />" );
		daybox.x = i * 16;
		daybox.y = 0;
		daybox.width = 16;
		daybox.height = 16;
		daybox.innerText = this.weekDays[i+this.weekStart];
		daybox.align = "center";
		daybox.size = 7;
	}

	var week = 0;
	var daybox = null;
	var today = new Date();
	for (var i=firstDay.getDate(); i<=lastDay.getDate(); i++) {
		var weekDay = firstDay.getDay();
		if (this.weekStart == 1) {
			if (weekDay == 0) weekDay = 7;
			weekDay -= 1;
		}
		if (weekDay%7==0 && i>1) {
			week++;
			if (week > 4) week = 0;
		}

		// A box for every day in the month. Positioned according to the week day
		daybox = this.monthBox.appendElement( "<div name=\"daybox"+firstDay.getDate()+"\"/>" );
		daybox.x = weekDay * 16;
		daybox.y = (week+1) * 16;
		daybox.width = 16;
		daybox.height = 14;
		daybox.cursor = "hand";
		daybox.enabled = true;
		//daybox.name = "daybox"+firstDay.getDate();
		daybox.onmousemove = "__CAL_INSTANCE.switchBGColor(\""+daybox.name+"\");";
		daybox.onmouseout = "__CAL_INSTANCE.resetBGColor(\""+daybox.name+"\");";
		daybox.onclick = "__CAL_INSTANCE.selectDay(\""+i+"\");";

		var daylabel = daybox.appendElement( "<label />" );
		daylabel.x = 0;
		daylabel.y = 0;
		daylabel.width = 16;
		daylabel.height = 16;
		daylabel.align = "center";
		daylabel.innerText = firstDay.getDate();
		daylabel.bold = (firstDay.getDate() == today.getDate() 
			&& firstDay.getMonth() == today.getMonth() 
			&& firstDay.getFullYear() == today.getFullYear());
		firstDay.setDate( firstDay.getDate()+1 );
	}

	this.closeBox.focus();
}

/*
 * Display the last/next years to choose jump to another year
 */
CalendarPicker.prototype.chooseYearShow = function() {
	debug.trace("Select your year now ...");
	var _this = this;

	this.monthLabel.innerText = "Select year";

	this.monthBox.removeAllElements();
	var firstYear = this.currentDraw.getFullYear()-9;
	var lastYear = this.currentDraw.getFullYear()+9;

	var row = 0;
	var counter = 0;
	var yearbox = null;
	var today = new Date();
	for (var i=firstYear; i<=lastYear; i++) {

		if (counter%3==0 && counter>0) {
			row++;
			counter = 0;
		}
		
		yearbox = this.monthBox.appendElement( "<div/>" );
		yearbox.x = counter * 37;
		yearbox.y = row * 16;
		yearbox.width = 37;
		yearbox.height = 14;
		yearbox.cursor = "hand";
		yearbox.enabled = true;
		yearbox.name = "yearbox"+i;
		yearbox.onmouseover = "__CAL_INSTANCE.switchBGColor(\""+yearbox.name+"\");";
		yearbox.onmouseout = "__CAL_INSTANCE.resetBGColor(\""+yearbox.name+"\");";
		yearbox.onclick = "__CAL_INSTANCE.selectYear(\""+i+"\");";
		var yearlabel = yearbox.appendElement( "<label />" );
		yearlabel.x = 0;
		yearlabel.y = 0;
		yearlabel.width = 35;
		yearlabel.height = 14;
		yearlabel.align = "center";
		yearlabel.innerText = i;
		yearlabel.bold = (i==today.getFullYear());

		counter++;
	}

}

/*
 * Change background color of named element to the theme hoverbg color
 */
CalendarPicker.prototype.switchBGColor = function(ele) {
	try {
		if (this.cursorPos > 0) {
			this.monthBox.children.item("daybox"+this.cursorPos).background = "";
		}
		this.monthBox.children.item(ele).background = this.themeHoverBG;
	}
	catch (E) {
		debug.error("Not yet implemented for Year movement");
	}
}

/*
 * Reset background color of named element
 */
CalendarPicker.prototype.resetBGColor = function(ele) {
	this.monthBox.children.item(ele).background = "";
}

/*
 * Executed when a day is picked by pressing Enter or clicking
 * Will execute zhr onDatePicked() method
 */
CalendarPicker.prototype.selectDay = function(day) {
	this.value = new Date();
	this.value.setDate(day);
	this.value.setMonth( this.currentDraw.getMonth()+1 );
	this.value.setYear( this.currentDraw.getYear() );
	this.onDatePicked();
	this.close();
}

/*
 * Executed when a new year is selected
 */
CalendarPicker.prototype.selectYear = function(year) {
	this.currentDraw.setFullYear( year );
	this.drawMonth();
}