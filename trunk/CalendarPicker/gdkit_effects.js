/**
    This file is part of GDkit.

    GDkit is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    GDkit is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with GDKit.  If not, see <http://www.gnu.org/licenses/>.
	
    Author: Lahiru Lakmal Priyadarshana <llahiru@gmail.com>
**/

//----Main Animation Wrapper Object----
function Animation(element) {
	this.element = element;
	this.elementH = element.height;
	this.elementW = element.width;
	this.duration = 3000;
}

//----Set Element to be Animated----
Animation.prototype.setElement = function (element) {
	this.element = element;
	this.elementH = element.height;
	this.elementW = element.width;
}

//----Set Animation Duration----
Animation.prototype.setDuration = function (dur) {
	this.duration = dur;
}

//----Fadeout Animation----
Animation.prototype.fadeOut = function () {
	var element = this.element;
	beginAnimation( function() { setElementOpacity(element); }, // callback
                 255, // start value, 255 = full opacity
                 0, // end value, 0 = no opacity or "hidden"
                 this.duration ); // duration in milliseconds

	setElementOpacity = function (element) {
		element.opacity = event.value;
	}
}

//----FadeIn Animation----
Animation.prototype.fadeIn = function () {
	var element = this.element;
	beginAnimation( function() { setElementOpacity(element); }, // callback
								 0, // start value, 0 = no opacity
								 255, // end value, 255 = full opacity
								 this.duration ); // duration in milliseconds

	setElementOpacity = function (element) {
		element.opacity = event.value;
	}
}

//----moveX Animation----
Animation.prototype.moveX = function (startX, endX) {
	var element = this.element;
	startX = (startX == "") ? element.x : startX;
	endX = (endX == "") ? element.x : endX;
	beginAnimation( function() { setElementPositionX(element); }, // callback
                 startX, // start value
                 endX, // end value
                 this.duration ); // duration in milliseconds

	setElementPositionX = function (element) {
		element.x = event.value;
	}
}

//----moveY Animation----
Animation.prototype.moveY = function (startY, endY) {
	var element = this.element;
	startY = (startY == "") ? element.y : startY;
	endY = (endY == "") ? element.y : endY;
	beginAnimation( function() { setElementPositionY(element); }, // callback
                 startY, // start value
                 endY, // end value
                 this.duration ); // duration in milliseconds

	setElementPositionY = function (element) {
		element.y = event.value;
	}
}

//----Rotation----
Animation.prototype.rotate = function (angle) {
	var element = this.element;
	beginAnimation( function() { setElementRotation(element); }, // callback
                 0, // start value, 0 = default
                 angle, // end value
                 this.duration ); // duration in milliseconds

	setElementRotation = function (element) {
		element.rotation = event.value;
	}
}

//----ScaleIn----
Animation.prototype.scaleIn = function () {
	var element = this.element;
	beginAnimation( function() { setElementWidth(element); }, // callback
                 0, // start value, 0 = default
                 this.elementW, // end value
                 this.duration ); // duration in milliseconds

	beginAnimation( function() { setElementHeight(element); }, // callback
                 0, // start value, 0 = default
                 this.elementH, // end value
                 this.duration ); // duration in milliseconds

	setElementWidth = function (element) {
		element.width = event.value;
	}

	setElementHeight = function (element) {
		element.height = event.value;
	}
}

//----ScaleOut----
Animation.prototype.scaleOut = function () {
	var element = this.element;
	beginAnimation( function() { setElementWidth(element); }, // callback
                 this.elementW, // start value
                 0, // end value, 0 = default
                 this.duration ); // duration in milliseconds

	beginAnimation( function() { setElementHeight(element); }, // callback
                 this.elementH, // start value
                 0, // end value, 0 = default
                 this.duration ); // duration in milliseconds

	setElementWidth = function (element) {
		element.width = event.value;
	}

	setElementHeight = function (element) {
		element.height = event.value;
	}
}
