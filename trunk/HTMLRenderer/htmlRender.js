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
	this.htmlDOM = new HTMLElement("document");

	// Rendering variables
	this.baseHeight = 16;
	this.left = 0;
	this.top = 0;
}

HTMLRender.prototype.RenderString = function(html, url) {
	// set baseUrl for this document (needed for image requests)
	this.baseUrl = url.substring(0, url.lastIndexOf("/")+1);

	// Extract body tag if string contains complete document
	var start = html.toLowerCase().indexOf("<body");
	if (start >= 0) {
		start = html.toLowerCase().indexOf(">", start) + 1;
		var end = html.toLowerCase().lastIndexOf("</body>");
		if (end < 0) {
			end = html.length;
		}
		html = html.substring(start, end);
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

	this.reset();
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
				end = html.toLowerCase().indexOf(endTag, end);
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
	tag = tag.replace(/=([\s\n\r\t]*)([a-zA-Z0-9]{1})([^\s]*)/gi, "=\"$2$3\"");
	var match = null;
	while ( true ) {
		match = tag.match(/([a-zA-Z0-9-]+)=([\s\n\r\t]*)([\"]{1})([^\"]+)/i);
		if (!match) break;
		element.attributes[ match[1] ] = match[4];
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
		scrollBar.onchange = function() {
				//htmlDiv.y = -scrollBar.value;
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
		case "document":
		default:
		case "p":
		case "text":
				if (element.tagName == "document") {
					if (element.innerText.length == 0) break;
				}

				if (element.tagName == "p") {
					if (this.top > 0) {
						this.top += this.baseHeight;
					}
					this.left = 0;
				}

				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.height = this.baseHeight;
				tmpEle.font = "Arial";
				tmpEle.y = this.top;
				tmpEle.size = 8;
				tmpEle.innerText = element.getTextContent();
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

				tmpEle.height = Math.ceil(tmpEle.size*1.6);
				tmpEle.width = this.basicCalcWidth(tmpEle.innerText, tmpEle);

				if ( (this.left + tmpEle.width) > this.htmlDiv.width) {
					if (this.left > 0) {
						tmpEle.y = this.top+tmpEle.height;
						this.left = 0;
					}
					if ( tmpEle.width > this.htmlDiv.width) {
						tmpEle.wordwrap = true;
						this.top -= tmpEle.height;
						tmpEle.height = Math.ceil( tmpEle.width / this.htmlDiv.width ) * (tmpEle.size*1.8);
						tmpEle.width = this.htmlDiv.width;
						this.top += tmpEle.height;
					}
				}
				tmpEle.x = this.left;
				this.left += tmpEle.width;

				if (element.tagName == "p") {
					this.top += (this.baseHeight/2);
					this.left = 0;
				}
				break;

		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6":
				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.font = "Arial";
				tmpEle.y = this.top;
				tmpEle.innerText = element.getTextContent();
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

				tmpEle.height = Math.ceil(tmpEle.size*1.6);
				width = this.basicCalcWidth(tmpEle.innerText, tmpEle);
				if (width < this.htmlDiv.width) {
					width = this.htmlDiv.width;
				}
				tmpEle.width = width;

				if ( (this.left + tmpEle.width) > this.htmlDiv.width) {
					if (this.left > 0) {
						tmpEle.y = this.top+tmpEle.height;
						this.left = 0;
					}
					if ( tmpEle.width > this.htmlDiv.width) {
						tmpEle.wordwrap = true;
						this.top -= tmpEle.height;
						tmpEle.height = Math.ceil( tmpEle.width / this.htmlDiv.width ) * (tmpEle.size*1.6);
						tmpEle.width = this.htmlDiv.width;
						this.top += tmpEle.height;
					}
				}
				tmpEle.y = tmpEle.y + (tmpEle.size);
				tmpEle.x = this.left;
				this.top = tmpEle.y + tmpEle.height;
				this.left = 0;
				break;

		case "pre":
				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.height = this.baseHeight;
				tmpEle.font = "Courier New";
				tmpEle.y = this.top+4;
				tmpEle.size = 8;

				tmpEle.width = this.htmlDiv.width;

				tmpEle.wordwrap = true;
				tmpEle.innerText = element.decodeEntities( element.innerText );
				var lines = tmpEle.innerText.split("\n");
				debug.trace( "Pre tag has "+lines.length+" lines");
				tmpEle.height = Math.ceil(tmpEle.size*1.6*lines.length);

				tmpEle.x = this.left;
				this.left += tmpEle.width;
				this.top += tmpEle.height;
				break;

		case "blockquote":
				tmpEle = this.htmlDiv.appendElement( "<label />" );
				tmpEle.font = "Arial";
				tmpEle.wordwrap = true;
				tmpEle.height = this.baseHeight;
				tmpEle.innerText = element.getTextContent();

				tmpEle.width = this.basicCalcWidth(tmpEle.innerText, tmpEle);
				this.left = 50;
				tmpEle.x = this.left;
				tmpEle.y = this.top+tmpEle.height;

				this.top += this.baseHeight;
				if ( (this.left + tmpEle.width) > this.htmlDiv.width) {
					tmpEle.wordwrap = true;
					this.top -= tmpEle.height;
					tmpEle.height = Math.ceil( tmpEle.width / (this.htmlDiv.width - this.left) ) * (tmpEle.size*1.6);
					tmpEle.width = this.htmlDiv.width-this.left;
					this.top += tmpEle.height;
				}
				this.top += tmpEle.height;
				this.left = 0;
				break;

		case "a":
				tmpEle = this.htmlDiv.appendElement( "<a />" );
				tmpEle.font = "Arial";
				tmpEle.size = 8;
				tmpEle.innerText = element.getTextContent();
				tmpEle.height = this.baseHeight;
				tmpEle.width = this.basicCalcWidth(tmpEle.innerText, tmpEle);
				if ( (this.left + tmpEle.width) > this.htmlDiv.width) {
					this.left = 0;
					this.top += this.baseHeight;
				}
				tmpEle.y = this.top;
				tmpEle.x = this.left;
				this.left += tmpEle.width;
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
				this.top += this.baseHeight;
				tmpEle.y = this.top+(this.baseHeight/2)-2;
				tmpEle.x = 0;
				this.left = 0;
				this.top += this.baseHeight;
				break;

		case "table":
				debug.warning("Render entire table ...");
				debug.warning("@TODO Table logic!");
				return;
				break;

		case "br":
				this.left = 0;
				this.top += this.baseHeight;
				// debug.trace("New line found");
				break;
	}

	for (var i=0; i<element.subElements.length; i++) {
		this.renderElement( element.subElements[i], tmpEle );
	}
}

HTMLRender.prototype.setElementStyle = function( element, parent, cHTML ) {
	if (parent != null) {
		element.bold = parent.bold;
		element.underline = parent.underline;
		element.italic = parent.italic;
		element.strikeout = parent.strikeout;
	}

	switch (cHTML.tagName) {
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
					element.strikeout = true;
					break;
	}

	if (cHTML.attributes.title) {
		element.tooltip = cHTML.attributes.title;
	}

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
	
	return idealRect.width-4;
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
	str = str.replace(/&copy;/gi, "©");
	str = str.replace(/&lt;/gi, "<");
	str = str.replace(/&gt;/gi, ">");
	str = str.replace(/&quot;/gi, "\"");
	return str;
}

/*!
 * Extended String prototype with trim function
 *
 */
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}