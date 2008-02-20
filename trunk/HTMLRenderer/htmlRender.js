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

@version 0.0.4 (2008-02-17)
@author Benjamin Schirmer
*/

function HTMLRender() {
	this.parent = view;
	this.baseUrl = "";

	this.reset();
}

HTMLRender.prototype.setParent = function(p) {
	this.parent = p;
}

HTMLRender.prototype.reset = function() {
	this.htmlDOM = new HTMLElement("body");

	// Rendering variables
	this.baseHeight = 16;
	this.left = 0;
	this.top = 0;
	this.tmpData = new Array();
}

HTMLRender.prototype.RenderString = function(html, url) {
	this.reset();

	// set baseUrl for this document (needed for image requests)
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
		start = html.indexOf("<!--");
		if (start >= 0) {
			end = html.indexOf("-->", start);
			if (end >= 0) {
				html = html.replace( html.substring(start, end+3), "");
			}
		}
		else {
			break;
		}
	}

	this.parseHTML( html, this.htmlDOM );
	this.debugDOM();
	this.renderDOM();
}

/*!
 * Download webpage and render data
 */
HTMLRender.prototype.RenderUrl = function(url) {
	var loadUrl = url;
	var req = new XMLHttpRequest();
	// These are some webpages which show Hello World examples, enable each line to test the renderer:
	loadUrl += (loadUrl.indexOf("?") > 0)?"&":"?";
	loadUrl += Math.random();
	req.open("GET", loadUrl, false);
	req.send();

	this.RenderString(req.responseText, url);
}

/*!
 * Parse HTML Code and fill parent element
 */
HTMLRender.prototype.parseHTML = function(html, parentElement) {
	debug.trace( "parseHTML: "+html );
	while (html.length > 0) {
		var start = html.indexOf("<");
		var end = 0;
		var match = null;
		if (start == -1) {
			// No HTML Tags detected -> Text only
			html = html.trim();
			if (html.length > 0) {
				if (parentElement.subElements.length > 0) {
					var textEle = new HTMLElement("text");
					textEle.innerText = html;
					debug.trace("Creating new TextNode : "+html);
					parentElement.subElements.push( textEle );
				}
				else {
					debug.trace("Setting innerText ("+parentElement.subElements.length+"): "+html);
					parentElement.innerText = html;
				}
			}
			html = "";
		}
		else if (start > 0) {
			// HTML Tag detected. Move Text before Tag into TextNode
			var text = html.substring(0, start);
			text = text.trim();
			if (text.length > 0) {
				var textEle = new HTMLElement("text");
				textEle.innerText = text;
				debug.trace("Creating new TextNode : "+text);
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
			if (!this.isSingleTag(match[1])) {
				debug.trace("Has closing Tag: "+match[1]);
				var endTag = "</"+match[1].toLowerCase()+">";

				var endPos = -1;
				var startPos = -1;
				var posLoop = true;
				while (posLoop) {
					startPos = html.toLowerCase().indexOf( "<"+match[1].toLowerCase(), startPos );
					//if (confirm("StartPos1: "+startPos+"\nEndPos: "+endPos+"\n\n"+html.substring( start + tagStart.length, html.length ))) return;
					if ( (startPos == -1) || (endPos != -1 && startPos > endPos) ) {
						posLoop = false;
					}
					else {
						endPos = html.toLowerCase().indexOf( endTag, endPos );
						//if (confirm("StartPos2: "+startPos+"\nEndPos: "+endPos+"\n\n"+html.substring( start + tagStart.length, html.length ))) return;
						posLoop = true;
						endPos++;
						startPos++;
					}
				}
				end = endPos-1;
				//alert( html.substring( start + tagStart.length, end ) );

				//end = html.toLowerCase().indexOf( endTag, end);
				var tagData = html.substring( start + tagStart.length, end );
				var element = new HTMLElement(match[1]);
				this.parseAttributes( tagStart, element );
				this.parseHTML( tagData, element );
				parentElement.subElements.push( element );

				html = html.substring( end+endTag.length, html.length );
			}
			else {
				debug.trace("Single Tag: "+match[1]);
				var element = new HTMLElement(match[1]);
				this.parseAttributes( tagStart, element );
				parentElement.subElements.push( element );

				html = html.substring( end+1, html.length );
			}
		}
		//debug.trace("NewHTML: "+html);
	}
}

/*!
 * Parse attributes from opening tag
 */
HTMLRender.prototype.parseAttributes = function(tag, element) {
	debug.trace("Tag: "+tag);
	tag = tag.replace(/=[\s\n\r\t]*([a-zA-Z0-9]{1})([^\s]*)/gi, "=\"$1$2\"");
	debug.trace("Tag Fixed: "+tag);
	var match = null;
	while ( true ) {
		match = tag.match(/([a-zA-Z0-9-]+)[\s\n\r\t]*=[\s\n\r\t]*[\"]{1}([^\"]+)/i);
		if (!match) break;
		element.attributes[ match[1] ] = match[2];
		tag = tag.replace(match[0], "");
	}
}

/*!
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

	// Set background div height
	this.htmlDiv.height = this.top+this.baseHeight;

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

/*!
 * Render element
 */
HTMLRender.prototype.renderElement = function(element, parent) {
	debug.trace( "Rendering: "+element.tagName );
	var tmpEle = null;
	switch (element.tagName) {
		case "body":
				// Apply background attributes
				this.setElementStyle( this.htmlDiv, parent, element);

				if (element.innerText.length == 0) break;
				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.innerText = element.getTextContent();
				this.setBaseStyle( tmpEle );
				this.setElementStyle( tmpEle, parent, element );
				this.setElementSize( tmpEle );

				break;

		case "p":
				if (element.innerText.length > 0) {
					this.top += (this.baseHeight/2);
					this.left = 0;
				}

				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.innerText = element.getTextContent();
				this.setBaseStyle( tmpEle );
				this.setElementStyle( tmpEle, parent, element );
				this.setElementSize( tmpEle, true );

				if (element.innerText.length > 0) {
					this.top += (this.baseHeight/2);
					this.left = 0;
				}
				break;

		default:
		case "text":
				tmpEle = this.htmlDiv.appendElement( "<label />" );
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

				this.setElementSize( tmpEle );
				break;

		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6":
				tmpEle = this.htmlDiv.appendElement( "<label />" );
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

				this.setElementSize( tmpEle, true );
				tmpEle.width = this.htmlDiv.width;
				this.left = 0;
				break;

		case "listing":
		case "plaintext":
		case "xmp":
		case "pre":
				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.innerText = element.decodeEntities( element.innerText );
				tmpEle.font = "Courier New";
				this.setBaseStyle( tmpEle );

				tmpEle.width = this.htmlDiv.width;
				tmpEle.wordwrap = true;
				var lines = tmpEle.innerText.split("\n");
				debug.trace( "Pre tag has "+lines.length+" lines");
				tmpEle.height = Math.ceil(tmpEle.size*1.6*lines.length);

				tmpEle.y = this.top;
				tmpEle.x = this.left;
				this.left = 0;
				this.top += tmpEle.height;
				break;

		case "blockquote":
				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.innerText = element.getTextContent();
				this.setBaseStyle( tmpEle );
				this.setElementSize( tmpEle );
				break;

		case "a":
				tmpEle = this.htmlDiv.appendElement( "<a />" );
				tmpEle.innerText = element.getTextContent();
				this.setBaseStyle( tmpEle );
				this.setElementSize( tmpEle );
				break;

		case "sub": 
		case "sup":
				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.font = "Arial";
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

		case "hr":
				tmpEle = this.htmlDiv.appendElement( "<div width=\"100%\" height=\"2\" background=\"#D0D0D0\"> </div>" );
				if (this.left > 0) {
					this.top += this.baseHeight;
					this.left = 0;
				}
				tmpEle.y = this.top+(this.baseHeight/2)-2;
				tmpEle.x = this.left;
				this.top += this.baseHeight;
				break;

		case "img": 
				tmpEle = this.htmlDiv.appendElement( "<img />" );
				if (this.top > 0) {
					this.top += this.baseHeight;
				}
				tmpEle.y = this.top;
				tmpEle.x = 0;
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
				this.left = 0;
				this.top += tmpEle.height;
				break;

		case "table":
				debug.warning("Render entire table ...");
				debug.warning("@TODO Table logic!");
				return;
				break;

		case "ul":
		case "dl":
		case "ol":
				debug.warning("Render list ...");
				var thisData = new Object();
				var lastData = this.tmpData[ this.tmpData.length-1 ];
				if (lastData == null) lastData = new Object();
				thisData.mode = "list";
				if ( element.attributes.type ) {
					thisData.type = element.attributes.type;
				}
				else {
					if (element.tagName == "ol") {
						thisData.type = "1";
					}
					else if (element.tagName == "ul") {
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
				thisData.index = 1;
				if (this.left > 0) {
					this.left = 0;
					this.top += this.baseHeight;
				}
				this.tmpData.push( thisData );
				break;

		case "li":

				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.innerText = this.getListIndex();
				this.left = this.tmpData.length * 25;
				var leftTmp = this.left;
				this.setBaseStyle( tmpEle );
				this.setElementStyle( tmpEle, parent, element );
				this.setElementSize( tmpEle );
				tmpEle.font = "Courier New";
				tmpEle.width = 20;
				tmpEle.align = "right";

				this.left = leftTmp + tmpEle.width;
				if (element.innerText.length > 0) {
					tmpEle = this.htmlDiv.appendElement( "<label />" );
					tmpEle.innerText = element.getTextContent();
					this.setBaseStyle( tmpEle );
					this.setElementStyle( tmpEle, parent, element );
					this.setElementSize( tmpEle, true );
				}

				this.tmpData[ this.tmpData.length-1 ].index++;

				break;

		case "br":
				if (this.left > 0) {
					this.left = 0;
					this.top += this.baseHeight;
				}
				// debug.trace("New line found");
				break;
	}

	for (var i=0; i<element.subElements.length; i++) {
		this.renderElement( element.subElements[i], tmpEle );
	}

	switch( element.tagName ) {
		case "ul":
		case "ol":
		case "dl":
						this.tmpData.pop();
						break;
	}
}

HTMLRender.prototype.setBaseStyle = function( element ) {
	element.font = "Arial";
	element.size = 8;
}

HTMLRender.prototype.setElementSize = function( element, fullWidth ) {
	// debug.trace("Start position is x: "+this.left+" y: "+this.top);
	element.height = Math.ceil(element.size*1.6);
	element.width = this.basicCalcWidth(element.innerText, element);

	if ( (this.left + element.width) > this.htmlDiv.width) {
		if (this.left > 0) {
			this.top += this.baseHeight;
			this.left = 0;
		}
		element.x = this.left;
		element.y = this.top;
		if ( element.width > this.htmlDiv.width) {
			element.wordwrap = true;
			element.height = Math.ceil( element.width / this.htmlDiv.width ) * (element.size*1.6);
			element.width = this.htmlDiv.width;
		}
	}
	else {
		element.x = this.left;
		this.left += element.width;
		element.y = this.top;
	}
	if (fullWidth) {
		this.top += element.height;
		element.width = this.htmlDiv.width;
		this.left = 0;
	}
	// debug.trace("Next position is x: "+this.left+" y: "+this.top);
}

HTMLRender.prototype.setElementStyle = function( element, parent, cHTML ) {
	if (parent != null) {
		if (parent.bold) element.bold = parent.bold;
		if (parent.underline) element.underline = parent.underline;
		if (parent.italic) element.italic = parent.italic;
		if (parent.strikeout) element.strikeout = parent.strikeout;
		if (parent.color) element.color = parent.color;
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
		case "u":
		case "ins":
		case "abbr":
		case "acronym":
					element.underline = true;
					break;
		case "del":
		case "s":
		case "strike":
					element.strikeout = true;
					break;
	}

	if (cHTML.attributes.title) {
		element.tooltip = cHTML.attributes.title;
	}
	if (cHTML.attributes.color) {
		element.color = cHTML.attributes.color;
	}
	if (cHTML.attributes.background) {
		element.background = this.getImageFromUrl(cHTML.attributes.background);
	}
	if (cHTML.attributes.bgcolor) {
		element.background = cHTML.attributes.bgcolor;
	}
}

HTMLRender.prototype.getListIndex = function() {
	var thisData = this.tmpData[ this.tmpData.length-1 ];
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
	req.send();
	if (req.status == 200) {
		return req.responseStream;
	}
	return "";
}

/*!
 * Output debugging code to verify layout
 */
HTMLRender.prototype.debugDOM = function() {
	debug.trace( this.htmlDOM.toJSONString() );
}

/*!
 * Check if the tag needs a closing tag or not
 */
HTMLRender.prototype.isSingleTag = function(tag) {
	tag = tag.toLowerCase();
	switch (tag) {
		case "br":
		case "hr":
		case "img":
					return true;

		default: return false;
	}
}

/*!
 * Calculate width of text based on a string
 */
HTMLRender.prototype.basicCalcWidth = function(str, ele) {

	var edit = view.appendElement("<edit />");
	edit.visible = false;
	edit.y = 2000;
	edit.x = 0;
	edit.width = 1000;
	edit.height = ele.height;
	edit.value = str;
	edit.font = ele.font;
	edit.size = ele.size;
	edit.bold = ele.bold;
	edit.italic = ele.italic;
	edit.underline = ele.underline;
	var idealRect = edit.idealBoundingRect;
	edit.width = idealRect.width;
	edit.height = idealRect.height;
	// debug.trace("ideal width would be: "+idealRect.width);
	view.removeElement(edit);
	
	var newWidth = idealRect.width-4;
	return newWidth;
}

/*!
 * HTML attribute object
 */
function HTMLAttribute(k, v) {
	this.key = k;
	this.value = v;
}

/*!
 * Read key from HTML attribute
 */
HTMLAttribute.prototype.getKey = function() {
	return this.key;
}

/*!
 * Read value from HTML attribute
 */
HTMLAttribute.prototype.getValue = function() {
	return this.value;
}

/*!
 * HTML Element object
 */
function HTMLElement(tn) {
	this.tagName = tn;
	this.subElements = new Array();
	this.attributes = new Object();

	this.innerText = "";
}

/*!
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
	str = str.replace(/&Agrave;/gi, "À");
	str = str.replace(/&Aacute;/gi, "Á");
	str = str.replace(/&Acirc;/gi, "Â");
	str = str.replace(/&Atilde;/gi, "Ã");
	str = str.replace(/&Auml;/gi, "Ä");
	str = str.replace(/&Aring;/gi, "Å");
	str = str.replace(/&AElig;/gi, "Æ");
	str = str.replace(/&Ccedil;/gi, "Ç");
	str = str.replace(/&Egrave;/gi, "È");
	str = str.replace(/&Eacute;/gi, "É");
	str = str.replace(/&Ecirc;/gi, "Ê");
	str = str.replace(/&Euml;/gi, "Ë");
	str = str.replace(/&Igrave;/gi, "Ì");
	str = str.replace(/&Iacute;/gi, "Í");
	str = str.replace(/&Icirc;/gi, "Î");
	str = str.replace(/&Iuml;/gi, "Ï");
	str = str.replace(/&ETH;/gi, "Ð");
	str = str.replace(/&Ntilde;/gi, "Ñ");
	str = str.replace(/&Ograve;/gi, "Ò");
	str = str.replace(/&Oacute;/gi, "Ó");
	str = str.replace(/&Ocirc;/gi, "Ô");
	str = str.replace(/&Otilde;/gi, "Õ");
	str = str.replace(/&Ouml;/gi, "Ö");
	str = str.replace(/&Oslash;/gi, "Ø");
	str = str.replace(/&Ugrave;/gi, "Ù");
	str = str.replace(/&Uacute;/gi, "Ú");
	str = str.replace(/&Ucirc;/gi, "Û");
	str = str.replace(/&Uuml;/gi, "Ü");
	str = str.replace(/&Yacute;/gi, "Ý");
	str = str.replace(/&THORN;/gi, "Þ");
	str = str.replace(/&szlig;/gi, "ß");
	str = str.replace(/&agrave;/gi, "à");
	str = str.replace(/&aacute;/gi, "á");
	str = str.replace(/&acirc;/gi, "â");
	str = str.replace(/&atilde;/gi, "ã");
	str = str.replace(/&auml;/gi, "ä");
	str = str.replace(/&aring;/gi, "å");
	str = str.replace(/&aelig;/gi, "æ");
	str = str.replace(/&ccedil;/gi, "ç");
	str = str.replace(/&egrave;/gi, "è");
	str = str.replace(/&eacute;/gi, "é");
	str = str.replace(/&ecirc;/gi, "ê");
	str = str.replace(/&euml;/gi, "ë");
	str = str.replace(/&igrave;/gi, "ì");
	str = str.replace(/&iacute;/gi, "í");
	str = str.replace(/&icirc;/gi, "î");
	str = str.replace(/&iuml;/gi, "ï");
	str = str.replace(/&eth;/gi, "ð");
	str = str.replace(/&ntilde;/gi, "ñ");
	str = str.replace(/&ograve;/gi, "ò");
	str = str.replace(/&oacute;/gi, "ó");
	str = str.replace(/&ocirc;/gi, "ô");
	str = str.replace(/&otilde;/gi, "õ");
	str = str.replace(/&ouml;/gi, "ö");
	str = str.replace(/&oslash;/gi, "ø");
	str = str.replace(/&ugrave;/gi, "ù");
	str = str.replace(/&uacute;/gi, "ú");
	str = str.replace(/&ucirc;/gi, "û");
	str = str.replace(/&uuml;/gi, "ü");
	str = str.replace(/&yacute;/gi, "ý");
	str = str.replace(/&thorn;/gi, "þ");
	str = str.replace(/&yuml;/gi, "ÿ");

	// Number entities:
	while (true) {
		var data = str.match( /&#([0-9]*);/i );
		if (!data) break;
		str = str.replace( data[0], String.fromCharCode( data[1] ) );
	}
	
	return str;
}

/*!
 * Extended String prototype with trim function
 *
 */
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}