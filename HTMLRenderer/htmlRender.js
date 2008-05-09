/*
Copyright (C) 2008 Benjamin Schirmer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

@version 0.0.7 (2008-02-22)
@author Benjamin Schirmer
*/

function HTMLRender() {
	this.parent = view;
	this.baseUrl = "";

	/* FollowLinks internally and try to render */
	this.FollowLink = false;

	/* Convert page to mobile using GWT */
	this.MobilePages = false;
	this.mobileBase = "http://www.google.com/gwt/n?u=";

	this.reset();
}

/**
 * Set parent for the rendering
 */
HTMLRender.prototype.setParent = function(p) {
	this.parent = p;
}

/**
 * Reset render variables
 */
HTMLRender.prototype.reset = function() {
	this.htmlDOM = new HTMLElement("body");

	// Rendering variables
	this.left = 0;
	this.top = 0;
	this.lastHeight = 0;
	this.baseFont = "Arial";
	this.baseSize = 10;
	this.baseHeight = 2*this.baseSize;

	this.tmpData = new Object();
	this.tmpData.image = new Object();
	this.tmpData.lists = new Array();
	this.tmpData.table = new Array();
	this.tmpData.link = new Object();
}

/**
 * Render a string into the parent object
 */
HTMLRender.prototype.RenderString = function(html, url) {
	this.reset();
	// set baseUrl for this document (needed for image requests
	this.baseUrl = url.substring(0, url.lastIndexOf("/")+1);

	// Extract body tag if string contains complete document
	var start = html.toLowerCase().indexOf("<body");
	if (start >= 0) {
		var start2 = html.toLowerCase().indexOf(">", start) + 1;
		this.parseAttributes( html.substring(start, start2), this.htmlDOM );
		var end = html.toLowerCase().lastIndexOf("</body>");
		if (end < 0) {
			end = html.length;
		}
		html = html.substring(start2, end);
	}

	while (true) {
		start = html.indexOf("<!-");
		if (start >= 0) {
			end = html.indexOf("->", start);
			if (end >= 0) {
				html = html.replace( html.substring(start, end+3), "");
			}
		}
		else {
			break;
		}
	}

	try {
		this.parseHTML( html, this.htmlDOM );
	}
	catch (E) {
		debug.error("Parser Crashed: \n"+E.description);
		alert( "There is not enough RAM for Javascript to parse this webpage.\nPlease load a smaller website" );
		return;
	}

	this.debugDOM();
	this.renderDOM();
}

/**
 * Download webpage and render data
 */
HTMLRender.prototype.RenderUrl = function(url, nocache) {
	var loadUrl = url;
	if (this.MobilePages) {
		debug.trace("Using mobile page for request");
		loadUrl = this.mobileBase+encodeURIComponent(url);
	}
	try {
		var req = new XMLHttpRequest();
		if (nocache) {
			loadUrl += (loadUrl.indexOf("?") > 0)?"&":"?";
			loadUrl += Math.random();
		}
		req.open("GET", loadUrl, false);
		req.send();
	}
	catch (E) {
		debug.error("Could not load url. No Internet connection?");
	}
	this.RenderString(req.responseText, loadUrl);
}

/**
 * Parse HTML Code and fill parent element
 */
HTMLRender.prototype.parseHTML = function(html, parentElement) {
	//debug.trace( "parseHTML: "+html );
	while (html.length > 0) {
		var start = html.indexOf("<");
		var end = 0;
		var match = null;
		if (start == -1) {
			// No HTML Tags detected -> Text only
			html = this.trimString(html);
			if (html.length > 0) {
				if (parentElement.subElements.length > 0) {
					var textEle = new HTMLElement("text");
					textEle.innerText = html;
					// debug.trace("Creating new TextNode : "+html);
					parentElement.subElements.push( textEle );
				}
				else {
					// debug.trace("Setting innerText ("+parentElement.subElements.length+"): "+html);
					parentElement.innerText = html;
				}
			}
			html = "";
		}
		else if (start > 0) {
			// HTML Tag detected. Move Text before Tag into TextNode
			var text = html.substring(0, start);
			text = this.trimString(text);
			if (text.length > 0) {
				var textEle = new HTMLElement("text");
				textEle.innerText = text;
				// debug.trace("Creating new TextNode : "+text);
				parentElement.subElements.push( textEle );
			}
			html = html.substring(start, html.length);
		}
		else if (start == 0) {
			// Read starting tag
			end = html.indexOf(">", start);
			var tagStart = html.substring(start, end+1);
			match = tagStart.match(/<[\s\n\t\r]*([a-z0-9A-Z]+)/i);
			if (!match) {
				debug.error("Could not find tag in "+tagStart);
				return;
			}
			if (!this.isSingleTag(match[1], tagStart)) {
				// debug.trace("Has closing Tag: "+match[1]);
				var endTag = "</"+match[1].toLowerCase()+">";

				var endPos = -1;
				var startPos = -1;
				var posLoop = true;
				while (posLoop) {
					startPos = html.toLowerCase().indexOf( "<"+match[1].toLowerCase(), startPos );
					if ( (startPos == -1) || (endPos != -1 && startPos > endPos) ) {
						posLoop = false;
					}
					else {
						endPos = html.toLowerCase().indexOf( endTag, endPos );
						posLoop = true;
						endPos++;
						startPos++;
					}
				}
				end = endPos-1;

				if (end >= 0) {
					//end = html.toLowerCase().indexOf( endTag, end);
					var tagData = html.substring( start + tagStart.length, end );
					var element = new HTMLElement(match[1]);
					this.parseAttributes( tagStart, element );
					this.parseHTML( tagData, element );
					parentElement.subElements.push( element );

					html = html.substring( end+endTag.length, html.length );
				}
				else {
					debug.trace("There is no end tag for ("+match[1]+")! Malformed HTML");
					var element = new HTMLElement(match[1]);
					html = html.substring( start + tagStart.length, html.length );
				}
			}
			else {
				//debug.trace("Single Tag: "+match[1]);
				var element = new HTMLElement(match[1]);
				this.parseAttributes( tagStart, element );
				parentElement.subElements.push( element );

				html = html.substring( end+1, html.length );
			}
		}
		//debug.trace("NewHTML: "+html);
	}
}

/**
 * Parse attributes from opening tag
 */
HTMLRender.prototype.parseAttributes = function(tag, element) {
	//tag = tag.replace(/[a-zA-Z]+[\s\n\r\t]*=[\s\n\r\t]*([a-zA-Z0-9]{1})([^\s]*)/gi, "=\"$1$2\"");
	var match = null;
	while ( true ) {
		match = tag.match(/([a-zA-Z0-9-]+)[\s\n\r\t]*=[\s\n\r\t]*[\"]{0,1}([^\"\s>]+)/i);
		if (!match) break;
		element.attributes[ match[1] ] = match[2];
		tag = tag.replace(match[0], "");
	}
}

/**
 * Render out parsed html document 
 */
HTMLRender.prototype.renderDOM = function() {
	// Clean parent
	this.parent.removeAllElements();

	this.htmlDiv = this.parent.appendElement( "<div />" );
	this.htmlDiv.width = this.parent.width-10;
	this.htmlDiv.height = this.parent.height;
	this.htmlDiv.x = 0;
	this.htmlDiv.y = 0;
	this.htmlDiv.name = "htmlDiv";

	this.renderElement( this.htmlDOM, this.parent );

	// Add Scrollbars if needed
	if (this.htmlDiv.height > this.parent.height) {

		var scrollDiv = this.parent.appendElement("<div />");
		scrollDiv.name = "scrollarea";
		scrollDiv.height = this.parent.height;
		scrollDiv.width = 10;
		scrollDiv.x = this.parent.width-10;
		scrollDiv.y = 0;
		scrollDiv.background = "#000000";
	
		var scrollImg = scrollDiv.appendElement("<img />");
		scrollImg.height = "100%";
		scrollImg.width = 9;
		scrollImg.src = "images\\scrollbar.png";
	
		var scrollBar = scrollDiv.appendElement("<scrollbar />");
		scrollBar.enabled = true;
		scrollBar.height = this.parent.height+10;
		scrollBar.name = "sb";
		scrollBar.width = 8;
		scrollBar.y = -10;
		scrollBar.lineStep = 10;
		scrollBar.max = this.htmlDiv.height-this.parent.height;
		scrollBar.orientation = "vertical";
		scrollBar.thumbDownImage = "images\\scroll.png";
		scrollBar.thumbImage = "images\\scroll.png";
		scrollBar.thumbOverImage = "images\\scroll.png";
		// scrollBar onchange needs local reference and cannot work with this.htmlDiv
		var htmlDiv = this.htmlDiv;
		scrollBar.onchange = function() {
				htmlDiv.y = -scrollBar.value;
			};
	}
}

/**
 * Render element
 */
HTMLRender.prototype.renderElement = function(element, parent) {
	//debug.trace( "Rendering: "+element.tagName );

	// Check for images in this tag
	var setImg = false;
	for (var i=0; i < element.subElements.length; i++) {
		if (element.subElements[i].tagName.toLowerCase() == "img") {
			this.tmpData.image.inside = true;
			setImg = true;

			if (element.subElements[i].attributes.align)
				this.tmpData.image.align = element.subElements[i].attributes.align;
			else
				this.tmpData.image.align = "bottom";

			if (element.subElements[i].attributes.height)
				this.tmpData.image.height = element.subElements[i].attributes.height;
			else 
				this.tmpData.image.height = this.getImageHeight( element.subElements[i].attributes.src );
		}
	}

	var tmpEle = null;
	element.tagName = element.tagName.toLowerCase();
	switch (element.tagName) {
		case "body":
				// Apply background attributes
				tmpEle = this.createElement("label");
				if (element.innerText.length > 0) {
					tmpEle.innerText = element.getTextContent();
					this.setBaseStyle( tmpEle );
					this.setElementSize( tmpEle, element );
				}
				this.setElementStyle( tmpEle, parent, element );
				break;

		case "p":
		case "blockquote":
		case "div":
				// Go to new line if we are not at the beginning of a line
				// except if we are in a list, then the left margin is valid
				if (this.left > 0 && (this.tmpData.lists == 0)) {
					this.top += this.lastHeight;
				}
				// If there is text in this tag, we move the tag down a notch
				if (element.innerText.length > 0) {
					this.top += (this.baseHeight/2);
					this.left = 0;
				}
				// Blockquote gets an indent
				// @TODO: Move blockquote to lists ?
				if (element.tagName == "blockquote") {
					this.left = 30;
				}

				// Create even empty elements. Don't break the format inheritance chain!
				tmpEle = this.createElement("label");
				if (element.innerText.length > 0) {
					tmpEle.innerText = element.getTextContent();
					this.setElementSize( tmpEle, element, true, true );
				}
				this.setBaseStyle( tmpEle );
				this.setElementStyle( tmpEle, parent, element );

				break;

		case "a":
				// bookmarks are not supported and do not need to be rendered as links
				if (element.attributes.href) {
					// skip links to bookmarks inside the document. not supported anyway.
					if (element.attributes.href.charAt(0) != "#") {
						this.tmpData.link.open = true;
						this.tmpData.link.href = element.attributes.href;
					}
				}
				// No break - render with normal tags. setElementStyle will make it colored and underline
		default:
		case "text":
				tmpEle = this.createElement("label");
				tmpEle.innerText = element.getTextContent();
				this.setBaseStyle( tmpEle );
				this.setElementStyle( tmpEle, parent, element );

				if (element.tagName == "code" 
						|| element.tagName == "kbd" 
						|| element.tagName == "tt" 
						|| element.tagName == "samp") {
					tmpEle.font = "Courier New";
				}
				else if (element.tagName == "q") {
					tmpEle.innerText = "\" "+tmpEle.innerText + " \"";
				}
				else if (element.tagName == "bdo") {
					if (element.attributes.dir == "rtl") {
						var str = tmpEle.innerText;
						var out = "";
						for (var i = 0; i <= str.length; i++) {
							out = str.charAt(i) + out;
						}
						tmpEle.innerText = out;
					}
				}

				this.setElementSize( tmpEle, element );
				break;

		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6":
				tmpEle = this.createElement("label");
				tmpEle.innerText = element.getTextContent();
				this.setBaseStyle( tmpEle );
				tmpEle.bold = true;
				if (element.tagName == "h1") {
					tmpEle.size = 24;
				}
				else if (element.tagName == "h2") {
					tmpEle.size = 18;
				}
				else if (element.tagName == "h3") {
					tmpEle.size = 14;
				}
				else if (element.tagName == "h4") {
					tmpEle.size = 12;
				}
				else if (element.tagName == "h5") {
					tmpEle.size = 10;
				}
				else if (element.tagName == "h6") {
					tmpEle.size = 8;
				}

				this.setElementSize( tmpEle, element, true );
				this.top += this.baseHeight;
				tmpEle.y += (this.baseHeight / 2);
				tmpEle.width = this.htmlDiv.width-this.left;
				this.applyAttributes( tmpEle, element );
				if (this.tmpData.lists == 0) {
					this.left = 0;
				}
				break;

		case "listing":
		case "plaintext":
		case "xmp":
		case "pre":
				if (this.left > 0) {
					this.left = 0;
					this.top += this.lastHeight;
				}
				tmpEle = this.createElement("label");
				tmpEle.innerText = element.decodeEntities( element.innerText );
				this.setBaseStyle( tmpEle );
				tmpEle.font = "Courier New";

				tmpEle.width = this.htmlDiv.width;
				tmpEle.wordwrap = true;
				var lines = tmpEle.innerText.split("\n");
				// debug.trace( "Pre tag has "+lines.length+" lines");
				tmpEle.height = Math.ceil(tmpEle.size*1.6*lines.length);

				tmpEle.y = this.top;
				tmpEle.x = this.left;
				this.left = 0;
				this.top += tmpEle.height;
				this.lastHeight = this.baseHeight;
				break;

		case "sub": 
		case "sup":
				tmpEle = this.createElement("label");
				tmpEle.font = this.baseFont;
				tmpEle.size = 4;
				tmpEle.innerText = element.innerText;
				tmpEle.width = this.basicCalcWidth(tmpEle.innerText, tmpEle);
				if (element.tagName == "sub") {
					tmpEle.y = this.top+(this.baseHeight/2);
				}
				else if (element.tagName == "sup") {
					tmpEle.y = this.top;
				}
				tmpEle.height = this.baseHeight;
				if ( (this.left + tmpEle.width) > this.htmlDiv.width) {
					this.left = 0;
					if (this.top > 0) {
						tmpEle.y = this.top+tmpEle.height;
					}
					if ( tmpEle.width > this.htmlDiv.width) {
						tmpEle.wordwrap = true;
						this.top -= tmpEle.height;
						tmpEle.height = Math.ceil( tmpEle.width / this.htmlDiv.width ) * (tmpEle.size*1.6);
						tmpEle.width = this.htmlDiv.width;
						this.top += tmpEle.height;
					}
				}
				tmpEle.x = this.left;
				this.left += tmpEle.width;
				break;

		case "img": 
				tmpEle = this.createElement("img");
				tmpEle.y = this.top;
				tmpEle.x = this.left;
				tmpEle.src = this.getImageFromUrl( element.attributes.src );
				if (element.attributes.height) {
					tmpEle.height = element.attributes.height;
				}
				if (element.attributes.width) {
					tmpEle.width = element.attributes.width;
				}
				if (!tmpEle.height) {
					if (tmpEle.srcHeight > this.htmlDiv.height) {
						tmpEle.height = this.htmlDiv.height;
						tmpEle.width = tmpEle.height * (tmpEle.srcHeight / tmpEle.srcWidth);
					}
					else {
						tmpEle.height = tmpEle.srcHeight;
					}
				}
				if ( (this.left + tmpEle.width) > this.htmlDiv.width) {
					this.top += this.lastHeight;
					tmpEle.y += this.top;
					tmpEle.x = 0;
				}
				this.left += tmpEle.width;
				this.applyLink( tmpEle );
				break;

		case "table":
				debug.warning("Render entire table ...");
				debug.warning("@TODO Table logic!");
				return;
				break;

		case "dir":
		case "menu":
		case "ul":
		case "dl":
		case "ol":
				var thisData = new Object();
				var lastData = this.tmpData.lists[ this.tmpData.lists.length-1 ];
				if (lastData == null) lastData = new Object();

				thisData.mode = "list";
				if ( element.attributes.type ) {
					thisData.type = element.attributes.type;
				}
				else {
					if (element.tagName == "ol") {
						thisData.type = "1";
					}
					else if (element.tagName == "ul" 
								|| element.tagName == "dir" 
								|| element.tagName == "menu") {
	

					if (lastData.type == "disc") {
							thisData.type = "circle";
						}
						else if (lastData.type == "circle") {
							thisData.type = "square";
						}
						else {
							thisData.type = "disc";
						}
					}
				}

				if (element.attributes.start) {
					thisData.index = element.attributes.start;
				}
				else {
					thisData.index = 1;
				}

				this.tmpData.lists.push( thisData );
				break;

		case "li":
				if (element.attributes.value) {
					this.tmpData.lists[ this.tmpData.lists.length-1 ].index = element.attributes.value;
				}
				// Every li starts at a new line:
				if (this.left > 0) {
					this.top += this.lastHeight;
				}

				tmpEle = this.createElement("label");
				tmpEle.innerText = this.getListIndex();
				this.left = this.tmpData.lists.length * 20 - 10;
				var leftTmp = this.left;
				this.setBaseStyle( tmpEle );
				this.setElementStyle( tmpEle, parent, element );
				this.setElementSize( tmpEle, element );
				tmpEle.font = "Courier New";
				tmpEle.width = 40;
				tmpEle.align = "right";

				this.left = leftTmp + tmpEle.width;
				if (element.innerText.length > 0) {
					tmpEle = this.createElement("label");
					tmpEle.innerText = element.getTextContent();
					this.setBaseStyle( tmpEle );
					this.setElementStyle( tmpEle, parent, element );
					this.setElementSize( tmpEle, element, false, true );
				}
				else {
					tmpEle = null;
				}

				this.tmpData.lists[ this.tmpData.lists.length-1 ].index++;
				break;

		case "dt":
				this.left = this.tmpData.lists.length * 25;

				tmpEle = this.createElement("label");
				tmpEle.innerText = element.getTextContent();
				this.setBaseStyle( tmpEle );
				this.setElementStyle( tmpEle, parent, element );
				this.setElementSize( tmpEle, element, true, true );
				break;

		case "dd":
				this.left = (this.tmpData.lists.length+1) * 25;

				tmpEle = this.createElement("label");
				tmpEle.innerText = element.getTextContent();
				this.setBaseStyle( tmpEle );
				this.setElementStyle( tmpEle, parent, element );
				this.setElementSize( tmpEle, element, true, true );
				break;

		case "hr":
				tmpEle = this.createElement("div");
				tmpEle.background = "#D0D0D0";

				if (element.attributes.size)
					tmpEle.height = element.attributes.size;
				else
					tmpEle.height = 2;

				if (element.attributes.width) {
					if (element.attributes.width.indexOf("%") != -1) {
						var percent = parseInt(element.attributes.width);
						tmpEle.width = this.htmlDiv.width * (percent / 100);
					}
					else {
						tmpEle.width = element.attributes.width;
					}
				}
				else {
					tmpEle.width = this.htmlDiv.width;
				}

				if (this.left > 0) {
					this.top += this.lastHeight;
					this.left = 0;
				}
				tmpEle.y = this.top+(this.baseHeight/2)-Math.ceil(tmpEle.height/2);

				if (element.attributes.align) {
					if (element.attributes.align == "left") tmpEle.x = this.left;
					if (element.attributes.align == "right") tmpEle.x = this.htmlDiv.width-this.left;
					if (element.attributes.align == "center") tmpEle.x = (this.htmlDiv.width/2)-(tmpEle.width/2);
				}
				else {
					tmpEle.x = this.left;
				}
				this.top += this.baseHeight;
				this.lastHeight = this.baseHeight;
				break;

		case "br":
				if (this.left > 0) {
					this.left = 0;
					this.top += this.lastHeight;
				}
				this.lastHeight = this.baseHeight;
				// Very important. A new line resets the image variables since the line height
				// is just valid for the line the image is in. New line -> New height
				this.tmpData.image.inside = false;
				break;
	}

	// Calculate maximum height of current line for correct linebreaks later
	this.lastHeight = Math.max( (tmpEle && tmpEle.height)?tmpEle.height:this.baseHeight, this.lastHeight );
	
	// Set background div height
	this.htmlDiv.height = this.top + this.lastHeight;

	for (var i=0; i<element.subElements.length; i++) {
		this.renderElement( element.subElements[i], tmpEle );
	}

	switch( element.tagName ) {
		case "dir":
		case "menu":
		case "ul":
		case "ol":
		case "dl":
				this.tmpData.lists.pop();
				if (this.left > 0 && (this.tmpData.lists.length == 0)) {
					if (element.subElements.length > 0) {
						this.top += this.lastHeight;
					}
				}
				this.left = (this.tmpData.lists.length * 20);
				break;

		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6":
				this.lastHeight = 0;
				break;

		case "p":
		case "blockquote":
		case "div":
				this.top += (this.baseHeight/2);
				if (this.left > 0) {
					this.top += this.lastHeight;
				}
				this.left = 0;
				this.lastHeight = 0;
				break;

		case "a":
				if (tmpEle.innerText.length == 0) {
					tmpEle.width = this.left-tmpEle.x;
					for (var i=0; i<Math.ceil(tmpEle.width/1.6); i++) {
						tmpEle.innerText += ".                  ";
					}
				}
				this.tmpData.link.open = false;
				break;
	}

	// Reset the image variables if this tag triggered the image height
	if (setImg) {
		this.tmpData.image.inside = false;
		this.lastHeight = this.baseHeight;
	}

}

/**
 * Create new element
 */
HTMLRender.prototype.createElement = function( type ) {
	var newType = "";
	if (type == "label") {
		newType = "<"+type+" font=\""+this.baseFont+"\" />";
	}
	else {
		newType = "<"+type+" />";
	}
	return this.htmlDiv.appendElement(newType);
}

/**
 * set the base style for the element
 */
HTMLRender.prototype.setBaseStyle = function( element ) {
	element.font = this.baseFont;
	element.size = this.baseSize;
}

/**
 * set size of the element.
 * This function handles wordwrap, width, height
 * fullWidth will always create a linebreak after the element
 * lockLeft will keep the left value when creating multi-line element
 */
HTMLRender.prototype.setElementSize = function( tmpEle, element, fullWidth, lockLeft ) {
	if (this.tmpData.lists > 0) lockLeft = true;

	tmpEle.height = Math.ceil(tmpEle.size*1.6);
	if (tmpEle.innerText.length == 0) {
		tmpEle.width = 0;
	}
	else {
		tmpEle.width = this.basicCalcWidth(tmpEle.innerText+" ", tmpEle);
	}

	if ( (this.left + tmpEle.width) > this.htmlDiv.width) {
		if (!lockLeft && (this.left > 0) ) {
			this.top += this.lastHeight;
			this.left = 0;
		}
		tmpEle.x = this.left;
		tmpEle.y = this.top;
		if ( tmpEle.width > (this.htmlDiv.width-this.left) ) {
			tmpEle.height = this.basicCalcHeight(tmpEle, (this.htmlDiv.width-this.left));
			tmpEle.width = (this.htmlDiv.width-this.left);
			tmpEle.wordwrap = true;
		}
		this.lastHeight = tmpEle.height;
	}
	else {
		if (this.tmpData.image.inside) {
			tmpEle.height = Math.max(tmpEle.height, this.tmpData.image.height);
			tmpEle.valign = this.tmpData.image.align;
		}
		tmpEle.x = this.left;
		this.left += tmpEle.width;
		tmpEle.y = this.top;
	}

	if (fullWidth) {
		this.top += tmpEle.height;
		tmpEle.width = this.htmlDiv.width;
		this.left = 0;
	}
}

/**
 * set the style for the element. They will inherit styles from the parent
 */
HTMLRender.prototype.setElementStyle = function( element, parent, cHTML ) {

	element.size = this.baseSize;

	if (parent != null) {
		if (parent.bold) element.bold = parent.bold;
		if (parent.underline) element.underline = parent.underline;
		if (parent.italic) element.italic = parent.italic;
		if (parent.strikeout) element.strikeout = parent.strikeout;
		if (parent.color) element.color = parent.color;
		if (parent.align) element.align = parent.align;

		if (parent.font) element.font = parent.font;
		if (parent.size) element.size = parent.size;
	}

	switch (cHTML.tagName.toLowerCase()) {
		case "b": 
		case "strong":
					element.bold = true;
					break;
		case "i":
		case "em":
		case "var":
					element.italic = true;
					break;
		case "abbr":
		case "acronym":
					element.enabled = true;
					element.cursor = "help";
		case "u":
		case "ins":
					element.underline = true;
					break;
		case "del":
		case "s":
		case "strike":
					element.strikeout = true;
					break;
		case "center":
					element.align = "center";
					break;
	}

	this.applyLink( element );

	this.applyAttributes( element, cHTML );
}

/**
 * Open a link in the users webbrowser or internally if FollowLink is enabled
 */
HTMLRender.prototype.openLink = function( url  ) {
	
	if (!url.match("([a-zA-Z]+)://")) {
		if (url.substring(0,1) == "/") {
			endDomain = this.baseUrl.indexOf("://");
			endDomain = this.baseUrl.indexOf("/", endDomain+3);
			url = this.baseUrl.substring(0, endDomain)+url;
		}
		else {
			url = this.baseUrl + url;
		}
	}
	debug.trace("Clicked on Link: "+url);
	if (this.FollowLink) {
		debug.trace("Clicked on Link: "+url);
		this.RenderUrl( url );
	}
	else {
		// @TODO use framework.openUrl when mailto: links are fixed
		var wsh = new ActiveXObject( "WScript.Shell" );
		wsh.Run( url );
	}
}

HTMLRender.prototype.applyLink = function( element ) {
	if (this.tmpData.link.open) {
		// Set underline and color only for labels
		// Images do not have these properties
		if (element.underline == false) element.underline = true;
		if (element.color) element.color = "#0000FF";
		element.enabled = true;
		htmlRender = this;
		var linkHref = htmlRender.tmpData.link.href;
		element.onclick = function () {
			htmlRender.openLink( linkHref );
		};
		element.cursor = "hand";
	}
}

/**
 * Apply attributes from the HTML element to the GD element
 */
HTMLRender.prototype.applyAttributes = function( element, cHTML ) {
	var fontSizes = [6, 8, 10, 12, 14, 18, 24];

	if (cHTML.attributes.alt) {
		element.tooltip = cHTML.attributes.alt;
	}
	if (cHTML.attributes.title) {
		element.tooltip = cHTML.attributes.title;
	}
	if (cHTML.attributes.color) {
		if (cHTML.attributes.color.charAt(0) == "#") {
			element.color = cHTML.attributes.color;
		}
		else {
			element.color = cHTML.decodeColor( cHTML.attributes.color );
		}
	}
	if (cHTML.attributes.text && element.color) {
		if (cHTML.attributes.text.charAt(0) == "#") {
			element.color = cHTML.attributes.text;
		}
		else {
			element.color = cHTML.decodeColor( cHTML.attributes.text );
		}
	}
	if (cHTML.attributes.background) {
		if (element.background)
			element.background = this.getImageFromUrl(cHTML.attributes.background);
		else
			this.htmlDiv.background = this.getImageFromUrl(cHTML.attributes.background);
	}
	if (cHTML.attributes.bgcolor) {
		if (element.background)
			element.background = cHTML.attributes.bgcolor;
		else
			this.htmlDiv.background = this.getImageFromUrl(cHTML.attributes.background);

	}
	if (cHTML.attributes.size) {
		if (cHTML.attributes.size.match(/^[0-9]+$/)) {
			element.size = fontSizes[ cHTML.attributes.size ];
			debug.trace("Size: "+cHTML.attributes.size+" -> "+element.size );
		}
		else {
			var curSize = 0;
			for (var i=0; i<fontSizes.length; i++)
				if (fontSizes[i] <= element.size)
					curSize = fontSizes[i];
			var num = parseInt( cHTML.attributes.size.match(/([0-9]+)/)[1] );
			debug.trace("Set number is: "+num);
			cursize += (cHTML.attributes.size.charAt(0) == "+")?num:(-1*num);
			if (curSize < 0) curSize = 0;
			if (curSize > (fontSizes.length-1)) curSize = fontSizes.length-1;
			element.size = fontSizes[ curSize ];
		}
	}
	if (cHTML.attributes.face) {
		element.font = cHTML.attributes.face;
	}
	if (cHTML.attributes.align) {
		debug.trace("Positionare alignmente");
		element.align = cHTML.attributes.align;
	}
}

/**
 * Get the value for the index of the list.
 * Handles the different list prefix types
 */
HTMLRender.prototype.getListIndex = function() {
	var thisData = this.tmpData.lists[ this.tmpData.lists.length-1 ];
	switch (thisData.type) {
		case "1": 
					return thisData.index + ".";

		case "a":
		case "A": 
					var start = "A";
					var result = String.fromCharCode( start.charCodeAt(0) + thisData.index - 1 );
					if (thisData.type == "a") {
						return result.toLowerCase() + ".";
					}
					else {
						return result + ".";
					}

		case "i":
		case "I":
					var result = "";
					var values = [ 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 ];
					var numerals = [ "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" ];
					var number = thisData.index;
					for (var i = 0; i < 13; i++)
					{
						while (number >= values[i])
						{
							number -= values[i];
							result += numerals[i];
						}
					}
					if (thisData.type == "i") {
						return result.toLowerCase() + ".";
					}
					else {
						return result + ".";
					}

		case "disc":
					return "●";

		case "circle":
					return "○";

		case "square":
					return "■";
	}
	
}

/**
 * load the image from the specified url
 */
HTMLRender.prototype.getImageFromUrl = function(url) {
	if (!url) return "";

	if (!url.match("([a-zA-Z]+)://")) {
		if (url.substring(0,1) == "/") {
			endDomain = this.baseUrl.indexOf("://");
			endDomain = this.baseUrl.indexOf("/", endDomain+3);
			url = this.baseUrl.substring(0, endDomain)+url;
		}
		else {
			url = this.baseUrl + url;
		}
	}
	debug.trace("Requesting Image: "+url);
	var req = new XMLHttpRequest();
	req.open('GET', url, false); 
	req.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows; Google Desktop) HTMLRender/0.0.6");
	req.send();
	debug.trace("Server response: "+req.status);
	if (req.status == 200) {
		return req.responseStream;
	}
	return "";
}

/**
 * Read source height from images url
 */
HTMLRender.prototype.getImageHeight = function( url ) {
	var img = view.appendElement("<img />");
	img.visible = false;
	img.src = this.getImageFromUrl( url );
	var height = img.srcHeight;
	view.removeElement(img);
	return height;
}

/**
 * Output debugging code to verify layout
 */
HTMLRender.prototype.debugDOM = function() {
	debug.trace( this.htmlDOM.toJSONString() );
}

/**
 * Check if the tag needs a closing tag or not
 */
HTMLRender.prototype.isSingleTag = function(tagName, tagComplete) {
	tagName = tagName.toLowerCase();
	if (tagComplete.charAt( tagComplete.length-2 ) == "/" ) {
		debug.trace("Tag: "+tagComplete+" ends with />");
		return true;
	}

	switch (tagName) {
		case "br":
		case "hr":
		case "img":
		case "input":
					return true;

		default: return false;
	}
}

/**
 * Calculate width of an element so that all text fits into it
 */
HTMLRender.prototype.basicCalcWidth = function(str, ele) {

	var edit = view.appendElement("<edit />");
	edit.visible = false;
	edit.width = 1000;
	edit.height = this.baseHeight;
	edit.value = str;
	edit.font = ele.font;
	edit.size = ele.size;
	edit.bold = ele.bold;
	edit.italic = ele.italic;
	edit.underline = ele.underline;
	var idealRect = edit.idealBoundingRect;
	// debug.trace("ideal width would be: "+idealRect.width);
	view.removeElement(edit);
	var newWidth = idealRect.width-4;
	return newWidth;
}

/**
 * Calculate height of element based on a string
 */
HTMLRender.prototype.basicCalcHeight = function(ele, maxWidth) {
	var aproxHeight = Math.ceil( ele.width / maxWidth + .5 ) * (ele.size*1.8);

	return aproxHeight;
}

/**
 * Trim a string (remove whitespaces at beginning and end)
 */
HTMLRender.prototype.trimString = function(str) {
	return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

/**
 * HTML attribute object
 */
function HTMLAttribute(k, v) {
	this.key = k;
	this.value = v;
}

/**
 * Read key from HTML attribute
 */
HTMLAttribute.prototype.getKey = function() {
	return this.key;
}

/**
 * Read value from HTML attribute
 */
HTMLAttribute.prototype.getValue = function() {
	return this.value;
}

/**
 * HTML Element object
 */
function HTMLElement(tn) {
	this.tagName = tn;
	this.subElements = new Array();
	this.attributes = new Object();

	this.innerText = "";
}

/**
 * retrieve formatted text content of the element
 */
HTMLElement.prototype.getTextContent = function() {
	var text = this.innerText;
	text = text.replace(/\n/g, " ");
	text = text.replace(/([\s]+)/gi, " ");
	text = text.replace(/([\r\n\t\s]+)/gi, " ");
	text = this.decodeEntities(text);
	return text;
}

/**
 * Decode HTML entities
 */
HTMLElement.prototype.decodeEntities = function(str) {
	// ASCII Entities
	str = str.replace(/&lt;/gi, "<");
	str = str.replace(/&gt;/gi, ">");
	str = str.replace(/&amp;/gi, "&");
	str = str.replace(/&quot;/gi, "\"");
	str = str.replace(/&apos;/gi, "'");

	// ISO 8859-1 Symbol Entities
	str = str.replace(/&nbsp;/gi, " ");
	str = str.replace(/&iexcl;/gi, "¡");
	str = str.replace(/&cent;/gi, "¢");
	str = str.replace(/&pound;/gi, "£");
	str = str.replace(/&curren;/gi, "¤");
	str = str.replace(/&yen;/gi, "¥");
	str = str.replace(/&brvbar;/gi, "¦");
	str = str.replace(/&sect;/gi, "§");
	str = str.replace(/&uml;/gi, "¨");
	str = str.replace(/&copy;/gi, "©");
	str = str.replace(/&ordf;/gi, "ª");
	str = str.replace(/&laquo;/gi, "«");
	str = str.replace(/&not;/gi, "¬");
	str = str.replace(/&shy;/gi, "­");
	str = str.replace(/&reg;/gi, "®");
	str = str.replace(/&macr;/gi, "¯");
	str = str.replace(/&deg;/gi, "°");
	str = str.replace(/&plusmn;/gi, "±");
	str = str.replace(/&sup2;/gi, "²");
	str = str.replace(/&sup3;/gi, "³");
	str = str.replace(/&acute;/gi, "´");
	str = str.replace(/&micro;/gi, "µ");
	str = str.replace(/&para;/gi, "¶");
	str = str.replace(/&middot;/gi, "·");
	str = str.replace(/&cedil;/gi, "¸");
	str = str.replace(/&sup1;/gi, "¹");
	str = str.replace(/&ordm;/gi, "º");
	str = str.replace(/&raquo;/gi, "»");
	str = str.replace(/&frac14;/gi, "¼");
	str = str.replace(/&frac12;/gi, "½");
	str = str.replace(/&frac34;/gi, "¾");
	str = str.replace(/&iquest;/gi, "¿");
	str = str.replace(/&times;/gi, "×");
	str = str.replace(/&divide;/gi, "÷");

	// ISO 8859-1 Character Entities
	str = str.replace(/&Agrave;/g, "À");
	str = str.replace(/&Aacute;/g, "Á");
	str = str.replace(/&Acirc;/g, "Â");
	str = str.replace(/&Atilde;/g, "Ã");
	str = str.replace(/&Auml;/g, "Ä");
	str = str.replace(/&Aring;/g, "Å");
	str = str.replace(/&AElig;/g, "Æ");
	str = str.replace(/&Ccedil;/g, "Ç");
	str = str.replace(/&Egrave;/g, "È");
	str = str.replace(/&Eacute;/g, "É");
	str = str.replace(/&Ecirc;/g, "Ê");
	str = str.replace(/&Euml;/g, "Ë");
	str = str.replace(/&Igrave;/g, "Ì");
	str = str.replace(/&Iacute;/g, "Í");
	str = str.replace(/&Icirc;/g, "Î");
	str = str.replace(/&Iuml;/g, "Ï");
	str = str.replace(/&ETH;/g, "Ð");
	str = str.replace(/&Ntilde;/g, "Ñ");
	str = str.replace(/&Ograve;/g, "Ò");
	str = str.replace(/&Oacute;/g, "Ó");
	str = str.replace(/&Ocirc;/g, "Ô");
	str = str.replace(/&Otilde;/g, "Õ");
	str = str.replace(/&Ouml;/g, "Ö");
	str = str.replace(/&Oslash;/g, "Ø");
	str = str.replace(/&Ugrave;/g, "Ù");
	str = str.replace(/&Uacute;/g, "Ú");
	str = str.replace(/&Ucirc;/g, "Û");
	str = str.replace(/&Uuml;/g, "Ü");
	str = str.replace(/&Yacute;/g, "Ý");
	str = str.replace(/&THORN;/g, "Þ");
	str = str.replace(/&szlig;/g, "ß");
	str = str.replace(/&agrave;/g, "à");
	str = str.replace(/&aacute;/g, "á");
	str = str.replace(/&acirc;/g, "â");
	str = str.replace(/&atilde;/g, "ã");
	str = str.replace(/&auml;/g, "ä");
	str = str.replace(/&aring;/g, "å");
	str = str.replace(/&aelig;/g, "æ");
	str = str.replace(/&ccedil;/g, "ç");
	str = str.replace(/&egrave;/g, "è");
	str = str.replace(/&eacute;/g, "é");
	str = str.replace(/&ecirc;/g, "ê");
	str = str.replace(/&euml;/g, "ë");
	str = str.replace(/&igrave;/g, "ì");
	str = str.replace(/&iacute;/g, "í");
	str = str.replace(/&icirc;/g, "î");
	str = str.replace(/&iuml;/g, "ï");
	str = str.replace(/&eth;/g, "ð");
	str = str.replace(/&ntilde;/g, "ñ");
	str = str.replace(/&ograve;/g, "ò");
	str = str.replace(/&oacute;/g, "ó");
	str = str.replace(/&ocirc;/g, "ô");
	str = str.replace(/&otilde;/g, "õ");
	str = str.replace(/&ouml;/g, "ö");
	str = str.replace(/&oslash;/g, "ø");
	str = str.replace(/&ugrave;/g, "ù");
	str = str.replace(/&uacute;/g, "ú");
	str = str.replace(/&ucirc;/g, "û");
	str = str.replace(/&uuml;/g, "ü");
	str = str.replace(/&yacute;/g, "ý");
	str = str.replace(/&thorn;/g, "þ");
	str = str.replace(/&yuml;/g, "ÿ");

	// Number entities:
	while (true) {
		var data = str.match( /&#([0-9]*);/i );
		if (!data) break;
		str = str.replace( data[0], String.fromCharCode( data[1] ) );
	}

	// Number unicode entities:
	while (true) {
		var data = str.match( /&#x([0-9]*);/i );
		if (!data) break;
		var uni = '"\\u' + data[1] +'"';
		str = str.replace( data[0], String.fromCharCode( eval(uni) ) );
	}

	return str;
}

/**
 * Decode named colors to HTML code
 */
HTMLElement.prototype.decodeColor = function( color ) {

	// Decode supported color names
	color = color.replace(/^AliceBlue$/i, "#F0F8FF");
	color = color.replace(/^AntiqueWhite$/i, "#FAEBD7");
	color = color.replace(/^Aqua$/i, "#00FFFF");
	color = color.replace(/^Aquamarine$/i, "#7FFFD4");
	color = color.replace(/^Azure$/i, "#F0FFFF");
	color = color.replace(/^Beige$/i, "#F5F5DC");
	color = color.replace(/^Bisque$/i, "#FFE4C4");
	color = color.replace(/^Black$/i, "#000000");
	color = color.replace(/^BlanchedAlmond$/i, "#FFEBCD");
	color = color.replace(/^Blue$/i, "#0000FF");
	color = color.replace(/^BlueViolet$/i, "#8A2BE2");
	color = color.replace(/^Brown$/i, "#A52A2A");
	color = color.replace(/^BurlyWood$/i, "#DEB887");
	color = color.replace(/^CadetBlue$/i, "#5F9EA0");
	color = color.replace(/^Chartreuse$/i, "#7FFF00");
	color = color.replace(/^Chocolate$/i, "#D2691E");
	color = color.replace(/^Coral$/i, "#FF7F50");
	color = color.replace(/^CornflowerBlue$/i, "#6495ED");
	color = color.replace(/^Cornsilk$/i, "#FFF8DC");
	color = color.replace(/^Crimson$/i, "#DC143C");
	color = color.replace(/^Cyan$/i, "#00FFFF");
	color = color.replace(/^DarkBlue$/i, "#00008B");
	color = color.replace(/^DarkCyan$/i, "#008B8B");
	color = color.replace(/^DarkGoldenRod$/i, "#B8860B");
	color = color.replace(/^DarkGray$/i, "#A9A9A9");
	color = color.replace(/^DarkGrey$/i, "#A9A9A9");
	color = color.replace(/^DarkGreen$/i, "#006400");
	color = color.replace(/^DarkKhaki$/i, "#BDB76B");
	color = color.replace(/^DarkMagenta$/i, "#8B008B");
	color = color.replace(/^DarkOliveGreen$/i, "#556B2F");
	color = color.replace(/^Darkorange$/i, "#FF8C00");
	color = color.replace(/^DarkOrchid$/i, "#9932CC");
	color = color.replace(/^DarkRed$/i, "#8B0000");
	color = color.replace(/^DarkSalmon$/i, "#E9967A");
	color = color.replace(/^DarkSeaGreen$/i, "#8FBC8F");
	color = color.replace(/^DarkSlateBlue$/i, "#483D8B");
	color = color.replace(/^DarkSlateGray$/i, "#2F4F4F");
	color = color.replace(/^DarkSlateGrey$/i, "#2F4F4F");
	color = color.replace(/^DarkTurquoise$/i, "#00CED1");
	color = color.replace(/^DarkViolet$/i, "#9400D3");
	color = color.replace(/^DeepPink$/i, "#FF1493");
	color = color.replace(/^DeepSkyBlue$/i, "#00BFFF");
	color = color.replace(/^DimGray$/i, "#696969");
	color = color.replace(/^DimGrey$/i, "#696969");
	color = color.replace(/^DodgerBlue$/i, "#1E90FF");
	color = color.replace(/^FireBrick$/i, "#B22222");
	color = color.replace(/^FloralWhite$/i, "#FFFAF0");
	color = color.replace(/^ForestGreen$/i, "#228B22");
	color = color.replace(/^Fuchsia$/i, "#FF00FF");
	color = color.replace(/^Gainsboro$/i, "#DCDCDC");
	color = color.replace(/^GhostWhite$/i, "#F8F8FF");
	color = color.replace(/^Gold$/i, "#FFD700");
	color = color.replace(/^GoldenRod$/i, "#DAA520");
	color = color.replace(/^Gray$/i, "#808080");
	color = color.replace(/^Grey$/i, "#808080");
	color = color.replace(/^Green$/i, "#008000");
	color = color.replace(/^GreenYellow$/i, "#ADFF2F");
	color = color.replace(/^HoneyDew$/i, "#F0FFF0");
	color = color.replace(/^HotPink$/i, "#FF69B4");
	color = color.replace(/^IndianRed $/i, "#CD5C5C");
	color = color.replace(/^Indigo $/i, "#4B0082");
	color = color.replace(/^Ivory$/i, "#FFFFF0");
	color = color.replace(/^Khaki$/i, "#F0E68C");
	color = color.replace(/^Lavender$/i, "#E6E6FA");
	color = color.replace(/^LavenderBlush$/i, "#FFF0F5");
	color = color.replace(/^LawnGreen$/i, "#7CFC00");
	color = color.replace(/^LemonChiffon$/i, "#FFFACD");
	color = color.replace(/^LightBlue$/i, "#ADD8E6");
	color = color.replace(/^LightCoral$/i, "#F08080");
	color = color.replace(/^LightCyan$/i, "#E0FFFF");
	color = color.replace(/^LightGoldenRodYellow$/i, "#FAFAD2");
	color = color.replace(/^LightGray$/i, "#D3D3D3");
	color = color.replace(/^LightGrey$/i, "#D3D3D3");
	color = color.replace(/^LightGreen$/i, "#90EE90");
	color = color.replace(/^LightPink$/i, "#FFB6C1");
	color = color.replace(/^LightSalmon$/i, "#FFA07A");
	color = color.replace(/^LightSeaGreen$/i, "#20B2AA");
	color = color.replace(/^LightSkyBlue$/i, "#87CEFA");
	color = color.replace(/^LightSlateGray$/i, "#778899");
	color = color.replace(/^LightSlateGrey$/i, "#778899");
	color = color.replace(/^LightSteelBlue$/i, "#B0C4DE");
	color = color.replace(/^LightYellow$/i, "#FFFFE0");
	color = color.replace(/^Lime$/i, "#00FF00");
	color = color.replace(/^LimeGreen$/i, "#32CD32");
	color = color.replace(/^Linen$/i, "#FAF0E6");
	color = color.replace(/^Magenta$/i, "#FF00FF");
	color = color.replace(/^Maroon$/i, "#800000");
	color = color.replace(/^MediumAquaMarine$/i, "#66CDAA");
	color = color.replace(/^MediumBlue$/i, "#0000CD");
	color = color.replace(/^MediumOrchid$/i, "#BA55D3");
	color = color.replace(/^MediumPurple$/i, "#9370D8");
	color = color.replace(/^MediumSeaGreen$/i, "#3CB371");
	color = color.replace(/^MediumSlateBlue$/i, "#7B68EE");
	color = color.replace(/^MediumSpringGreen$/i, "#00FA9A");
	color = color.replace(/^MediumTurquoise$/i, "#48D1CC");
	color = color.replace(/^MediumVioletRed$/i, "#C71585");
	color = color.replace(/^MidnightBlue$/i, "#191970");
	color = color.replace(/^MintCream$/i, "#F5FFFA");
	color = color.replace(/^MistyRose$/i, "#FFE4E1");
	color = color.replace(/^Moccasin$/i, "#FFE4B5");
	color = color.replace(/^NavajoWhite$/i, "#FFDEAD");
	color = color.replace(/^Navy$/i, "#000080");
	color = color.replace(/^OldLace$/i, "#FDF5E6");
	color = color.replace(/^Olive$/i, "#808000");
	color = color.replace(/^OliveDrab$/i, "#6B8E23");
	color = color.replace(/^Orange$/i, "#FFA500");
	color = color.replace(/^OrangeRed$/i, "#FF4500");
	color = color.replace(/^Orchid$/i, "#DA70D6");
	color = color.replace(/^PaleGoldenRod$/i, "#EEE8AA");
	color = color.replace(/^PaleGreen$/i, "#98FB98");
	color = color.replace(/^PaleTurquoise$/i, "#AFEEEE");
	color = color.replace(/^PaleVioletRed$/i, "#D87093");
	color = color.replace(/^PapayaWhip$/i, "#FFEFD5");
	color = color.replace(/^PeachPuff$/i, "#FFDAB9");
	color = color.replace(/^Peru$/i, "#CD853F");
	color = color.replace(/^Pink$/i, "#FFC0CB");
	color = color.replace(/^Plum$/i, "#DDA0DD");
	color = color.replace(/^PowderBlue$/i, "#B0E0E6");
	color = color.replace(/^Purple$/i, "#800080");
	color = color.replace(/^Red$/i, "#FF0000");
	color = color.replace(/^RosyBrown$/i, "#BC8F8F");
	color = color.replace(/^RoyalBlue$/i, "#4169E1");
	color = color.replace(/^SaddleBrown$/i, "#8B4513");
	color = color.replace(/^Salmon$/i, "#FA8072");
	color = color.replace(/^SandyBrown$/i, "#F4A460");
	color = color.replace(/^SeaGreen$/i, "#2E8B57");
	color = color.replace(/^SeaShell$/i, "#FFF5EE");
	color = color.replace(/^Sienna$/i, "#A0522D");
	color = color.replace(/^Silver$/i, "#C0C0C0");
	color = color.replace(/^SkyBlue$/i, "#87CEEB");
	color = color.replace(/^SlateBlue$/i, "#6A5ACD");
	color = color.replace(/^SlateGray$/i, "#708090");
	color = color.replace(/^SlateGrey$/i, "#708090");
	color = color.replace(/^Snow$/i, "#FFFAFA");
	color = color.replace(/^SpringGreen$/i, "#00FF7F");
	color = color.replace(/^SteelBlue$/i, "#4682B4");
	color = color.replace(/^Tan$/i, "#D2B48C");
	color = color.replace(/^Teal$/i, "#008080");
	color = color.replace(/^Thistle$/i, "#D8BFD8");
	color = color.replace(/^Tomato$/i, "#FF6347");
	color = color.replace(/^Turquoise$/i, "#40E0D0");
	color = color.replace(/^Violet$/i, "#EE82EE");
	color = color.replace(/^Wheat$/i, "#F5DEB3");
	color = color.replace(/^White$/i, "#FFFFFF");
	color = color.replace(/^WhiteSmoke$/i, "#F5F5F5");
	color = color.replace(/^Yellow$/i, "#FFFF00");
	color = color.replace(/^YellowGreen$/i, "#9ACD32");

	debug.trace("Converted color is: "+color);

	return color;
}
