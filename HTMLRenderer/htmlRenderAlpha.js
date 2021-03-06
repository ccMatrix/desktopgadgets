﻿/*
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

@version 0.0.3 (2008-02-13)
@author Benjamin Schirmer
*/

var baseUrl = "";

function renderHTMLCode(str, parent, url) {

	// Clean parent
	parent.removeAllElements();

	// set baseUrl for this document (needed for image requests)
	baseUrl = url.substring(0, url.lastIndexOf("/")+1);

	var tmpEle = null;
	var tmpStr = null;
	var tmpTable = new Object();
	
	var top = 0;
	var left = 0;
	var width = 0;
	var height = 0;

	var baseHeight = 16;

	var divName = "htmlRender"+Math.round(Math.random()*50000, 0);
	var div = parent.appendElement("<div />");
	div.width = parent.width;
	div.height = parent.height;
	div.x = 0;
	div.y = 0;

	var htmlDiv = div.appendElement("<div />");
	htmlDiv.width = div.width-10;
	htmlDiv.height = div.height;
	htmlDiv.x = 0;
	htmlDiv.y = 0;
	htmlDiv.name = divName;

	while (true) {
		start = str.indexOf("<!--");
		if (start >= 0) {
			end = str.indexOf("-->", start);
			if (end >= 0) {
				str = str.replace( str.substring(start, end+3), "");
			}
		}
		else {
			break;
		}
	}

	// Decode entities
	str = str.replace(/&nbsp;/ig, " ");
	str = str.replace(/&copy;/gi, "©");

	// Fix attributes
	str = str.replace(/=([\s\n\r\0\t]*)([a-zA-Z0-9]{1})([^\s]*)/g, "=\"$2$3\"");
	//str = str.replace(/=([^\s>]*)/g, "=\"$1\" ");
	//str = str.replace(/=\"\"([^\"]*)\"\"/g, "=\"$1\" ");

	// Paragraphs are just line-breaks here
	//str = str.replace(/<\/p>/gi, "<br>");
	//str = str.replace(/<p>/gi, "<br>");

	// Cleaning unknown or unneeded tags
	var unknownTags = new Array("nobr", "font", "div");
	for (var i=0; i<unknownTags.length; i++) {
		var tag = unknownTags[i];
		var openTag = new RegExp("<"+tag+"([\s>]+)([^>]*)>", "ig");
		var closeTag = new RegExp("<\/"+tag+"([\s>]+)([^>]*)>", "ig");
		str = str.replace(openTag, "");
		str = str.replace(closeTag, "");
	}

	// creating first div tag if content starts with text
	if (str[0] != "<") {
		str = str.replace(/([^<]+)/i, "<div >$1</div>");
	}

	// Closing tags which usually do not have one
	str = str.replace(/<img([^>]*)>/gi, "<img$1></img>");
	str = str.replace(/<br([^>]*)>/gi, "<br ></br>");
	str = str.replace(/<hr([^>]*)>/gi, "<hr ></hr>");
	str = str.replace(/<\/tr>/gi, "");
	str = str.replace(/<tr([^>]*)>/gi, "<tr$1></tr>");
	str = str.replace(/<\/table>/gi, "<br ></br>");
	str = str.replace(/<table([^>]*)>/gi, "<table$1></table>");

	// Enclose all stand-alone text into divs
	str = str.replace(/<\/([^>]+)>([^<]+)</gi, "</$1><div>$2</div><");
	str = str.replace(/<([^>]+)>([^<]+)<([a-zA-Z]+)/gi, "</$1><div>$2</div><$3");

	// Remove all empty divs
	str = str.replace(/<div[^>]*>([\s]*)<\/div>/gi, "");

	// Remove all bookmark links (no such thing in gadgets)
	str = str.replace(/<a[\s\n\t\r]+name=[a-zA-Z0-9,.-_\"]+[\s\n\t\r]*>([^<]*)<\/a>/gi, "$1");
	str = str.replace(/<a[\s\n\t\r]+name=[a-zA-Z0-9,.-_\"]+[\s\n\t\r]*>/gi, "");

	alert( str );
	//debug.trace("Scanning: "+str);

	while (true) {
		var match = str.match(/<([^>\s]+)([^>]*)>([^<]*)<\/([^>]+)>/);
		if (!match) break;

		// verbose debugging
		debug.trace("Found tag: "+match[1]+"-/"+match[4]+": "+match[0]);
		// minimal debugging
		//debug.trace("Found tag: "+match[1]+"-/"+match[4]);

		tmpStr = match[0];
		tmpStr = tmpStr.replace("<"+match[1], "<label");
		tmpStr = tmpStr.replace("</"+match[4]+">", "</label>");
		tmpStr = tmpStr.replace(/title=/, "tooltip=");

		switch ( match[1] ) {
			default:
			case "div": 
			case "b":
			case "u":
			case "i":
			case "strong":
			case "em":
			case "abbr":
			case "p":
							tmpEle = htmlDiv.appendElement( tmpStr );
							tmpEle.height = baseHeight;
							tmpEle.font = "Arial";
							tmpEle.y = top;
							tmpEle.innerText = tmpEle.innerText.replace(/\n/g, " ");
							tmpEle.innerText = tmpEle.innerText.replace(/([\s]+)/gi, " ");

							if (match[1] == "b" || match[1] == "strong") {
								tmpEle.bold = true;
							}
							else if (match[1] == "u" || match[1] == "ins") {
								tmpEle.underline = true;
							}
							else if (match[1] == "i" || match[1] == "em" || match[1] == "var") {
								tmpEle.italic = true;
							}
							else if (match[1] == "abbr" || match[1] == "acronym") {
								tmpEle.underline = true;
							}
							else if (match[1] == "q") {
								tmpEle.innerText = "\" "+tmpEle.innerText + " \"";
							}
							else if (match[1] == "del") {
								tmpEle.strikeout = true;
							}
							else if (match[1] == "code" || match[1] == "kbd" || match[1] == "tt" || match[1] == "samp") {
								tmpEle.font = "Courier New";
							}

							tmpEle.height = Math.ceil(tmpEle.size*1.6);
							tmpEle.width = basicCalcWidth(tmpEle.innerText, tmpEle);

							if ( (left + tmpEle.width) > div.width) {
								left = 0;
								if (top > 0) {
									tmpEle.y = top+tmpEle.height;
								}
								if ( tmpEle.width > div.width) {
									tmpEle.wordwrap = true;
									top -= tmpEle.height;
									tmpEle.height = Math.ceil( tmpEle.width / div.width ) * (tmpEle.size*1.6);
									tmpEle.width = div.width;
									top += tmpEle.height;
								}
							}
							tmpEle.x = left;
							left += tmpEle.width;
							if (match[1] == "p") {
								top += baseHeight;
							}
							break;

			case "h1":
			case "h2":
			case "h3":
			case "h4":
			case "h5":
			case "h6":
							tmpEle = htmlDiv.appendElement( tmpStr );
							tmpEle.height = baseHeight;
							tmpEle.font = "Arial";
							tmpEle.y = top;
							tmpEle.innerText = tmpEle.innerText.replace(/\n/g, " ");
							tmpEle.innerText = tmpEle.innerText.replace(/([\s]+)/gi, " ");
							tmpEle.bold = true;

							if (match[1] == "h1") {
								tmpEle.size = 24;
							}
							else if (match[1] == "h2") {
								tmpEle.size = 18;
							}
							else if (match[1] == "h3") {
								tmpEle.size = 14;
							}
							else if (match[1] == "h4") {
								tmpEle.size = 12;
							}
							else if (match[1] == "h5") {
								tmpEle.size = 10;
							}
							else if (match[1] == "h6") {
								tmpEle.size = 8;
							}

							tmpEle.height = Math.ceil(tmpEle.size*1.6);
							width = basicCalcWidth(tmpEle.innerText, tmpEle);
							if (width < div.width) {
								width = div.width;
							}
							tmpEle.width = width;

							if ( (left + tmpEle.width) > div.width) {
								left = 0;
								if (top > 0) {
									tmpEle.y = top+tmpEle.height;
								}
								if ( tmpEle.width > div.width) {
									tmpEle.wordwrap = true;
									top -= tmpEle.height;
									tmpEle.height = Math.ceil( tmpEle.width / div.width ) * (tmpEle.size*1.6);
									tmpEle.width = div.width;
									top += tmpEle.height;
								}
							}
							tmpEle.y = tmpEle.y + (tmpEle.size);
							tmpEle.x = left;
							top = tmpEle.y + tmpEle.height;
							left = 0;
							break;

			case "pre":
							tmpEle = htmlDiv.appendElement( tmpStr );
							tmpEle.height = baseHeight;
							tmpEle.font = "Courier New";
							tmpEle.y = top+4;
							tmpEle.size = 8;

							tmpEle.width = div.width;

							tmpEle.wordwrap = true;
							var lines = tmpEle.innerText.split("\n");
							debug.trace( "Pre tag has "+lines.length+" lines");
							tmpEle.height = Math.ceil(tmpEle.size*1.6*lines.length);

							tmpEle.x = left;
							left += tmpEle.width;
							top += tmpEle.height;
							break;

			case "sub": 
			case "sup":
							tmpEle = htmlDiv.appendElement( tmpStr );
							tmpEle.font = "Arial";
							tmpEle.size = 4;
							tmpEle.width = basicCalcWidth(tmpEle.innerText, tmpEle);
							if (match[1] == "sub") {
								tmpEle.y = top-(baseHeight/2);
							}
							else if (match[1] == "sup") {
								tmpEle.y = top+(baseHeight/2);
							}
							tmpEle.height = baseHeight;
							if ( (left + tmpEle.width) > div.width) {
								left = 0;
								if (top > 0) {
									tmpEle.y = top+tmpEle.height;
								}
								if ( tmpEle.width > div.width) {
									tmpEle.wordwrap = true;
									top -= tmpEle.height;
									tmpEle.height = Math.ceil( tmpEle.width / div.width ) * (tmpEle.size*1.6);
									tmpEle.width = div.width;
									top += tmpEle.height;
								}
							}
							tmpEle.x = left;
							left += tmpEle.width;
							break;

			case "blockquote":
							tmpEle = htmlDiv.appendElement( tmpStr );
							tmpEle.font = "Arial";
							tmpEle.wordwrap = true;
							tmpEle.height = baseHeight;
							tmpEle.width = basicCalcWidth(tmpEle.innerText, tmpEle);
							left = 50;
							tmpEle.x = left;
							tmpEle.y = top+tmpEle.height;

							top += baseHeight;
							if ( (left + tmpEle.width) > div.width) {
								if ( tmpEle.width > (div.width - left) ) {
									tmpEle.wordwrap = true;
									top -= tmpEle.height;
									tmpEle.height = Math.ceil( tmpEle.width / (div.width - left) ) * (tmpEle.size*1.6);
									tmpEle.width = div.width;
									top += tmpEle.height;
								}
							}
							top += tmpEle.height;
							left = 0;
							break;

			case "a":
							tmpEle = htmlDiv.appendElement( match[0] );
							tmpEle.font = "Arial";
							tmpEle.height = baseHeight;
							tmpEle.width = basicCalcWidth(tmpEle.innerText, tmpEle);
							if ( (left + tmpEle.width) > div.width) {
								left = 0;
								top += baseHeight;
							}
							tmpEle.y = top;
							tmpEle.x = left;
							tmpEle.size = 8;
							left += tmpEle.width;
							break;

			case "img": 
							tmpStr = match[0];
							tmpEle = htmlDiv.appendElement( tmpStr );
							top += baseHeight;
							tmpEle.y = top;
							tmpEle.x = 0;
							getImageFromUrl( tmpEle.src, tmpEle );
							if (!tmpEle.height) {
								if (tmpEle.srcHeight > div.height) {
									tmpEle.height = div.height;
									tmpEle.width = tmpEle.height * (tmpEle.srcHeight / tmpEle.srcWidth);
								}
								else {
									tmpEle.height = tmpEle.srcHeight;
								}
							}
							left = 0;
							top += tmpEle.height;
							break;

			case "hr":
							tmpEle = htmlDiv.appendElement( "<div width=\"100%\" height=\"2\" background=\"#D0D0D0\"> </div>" );
							top += baseHeight;
							tmpEle.y = top;
							tmpEle.x = 0;
							left = 0;
							top += 5;
							break;

			case "br":
							left = 0;
							top += baseHeight;
							// debug.trace("New line found");
							break;


			case "tbody":
			case "tr":
							left = 0;
							top += baseHeight+8;
							// debug.trace("switch line for new row...");
							break;

			case "table":
							// set default table data
							tmpTable.border = 2;

							var tmp = match[0];
							tmp = tmp.match(/border=[\"]{0,1}([0-9]+)/i);
							if (tmp) {
								tmpTable.border = tmp[1];
							}
							debug.trace("Border for table is: "+tmpTable.border);

							//left = 0;
							//top += baseHeight+8;
							break;

			case "td":
			case "th":
							tmpEle = htmlDiv.appendElement( tmpStr );
							tmpEle.height = baseHeight;
							tmpEle.font = "Arial";
							tmpEle.y = top+baseHeight;
							tmpEle.innerText = tmpEle.innerText.replace(/\n/g, " ");
							tmpEle.innerText = tmpEle.innerText.replace(/([\s]+)/gi, " ");

							tmpEle.height = Math.ceil(tmpEle.size*1.6)+8;
							tmpEle.width = basicCalcWidth(tmpEle.innerText, tmpEle)+8;

							if ( (left + tmpEle.width) > div.width) {
								left = 0;
								if (top > 0) {
									tmpEle.y = top+tmpEle.height;
								}
								if ( tmpEle.width > div.width) {
									tmpEle.wordwrap = true;
									top -= tmpEle.height;
									tmpEle.height = Math.ceil( tmpEle.width / div.width ) * (tmpEle.size*1.6)+8;
									tmpEle.width = div.width+8;
									top += tmpEle.height;
								}
							}
							tmpEle.x = left;
							left += tmpEle.width;

							// Drawing border around cell (if needed)
							if (tmpTable.border > 0) {
								tmpEle2 = htmlDiv.appendElement( "<div />" );
								tmpEle2.x = tmpEle.x;
								tmpEle2.y = tmpEle.y;
								tmpEle2.height = tmpEle.height;
								tmpEle2.width = tmpTable.border;
								tmpEle2.opacity = 150;
								tmpEle2.background = "#D0D0D0";
								tmpEle2 = htmlDiv.appendElement( "<div />" );
								tmpEle2.x = tmpEle.x;
								tmpEle2.y = tmpEle.y;
								tmpEle2.height = tmpTable.border;
								tmpEle2.width = tmpEle.width;
								tmpEle2.opacity = 150;
								tmpEle2.background = "#D0D0D0";
								tmpEle2 = htmlDiv.appendElement( "<div />" );
								tmpEle2.x = tmpEle.x+tmpEle.width-tmpTable.border;
								tmpEle2.y = tmpEle.y;
								tmpEle2.height = tmpEle.height;
								tmpEle2.width = tmpTable.border;
								tmpEle2.opacity = 150;
								tmpEle2.background = "#D0D0D0";
								tmpEle2 = htmlDiv.appendElement( "<div />" );
								tmpEle2.x = tmpEle.x;
								tmpEle2.y = tmpEle.y+tmpEle.height-tmpTable.border;
								tmpEle2.height = tmpTable.border;
								tmpEle2.width = tmpEle.width;
								tmpEle2.opacity = 150;
								tmpEle2.background = "#D0D0D0";
							}

							tmpEle.x = tmpEle.x+4;
							tmpEle.y = tmpEle.y+4;
							break;

		}

		str = str.replace(match[0], "");

		match = str.match(/([^<]*)/i);
		if (match && (match[1].length > 0)) {
			str = str.replace(/([^<]*)/i, "<div >$1</div>");
		}
	}

	// Set background div height
	htmlDiv.height = top+baseHeight;

	// Add Scrollbars if needed
	if (htmlDiv.height > div.height) {

		var scrollDiv = div.appendElement("<div />");
		scrollDiv.name = "scrollarea";
		scrollDiv.height = div.height;
		scrollDiv.width = 10;
		scrollDiv.x = div.width-10;
		scrollDiv.y = 0;
		scrollDiv.background = "#000000";
	
		var scrollImg = scrollDiv.appendElement("<img />");
		scrollImg.height = "100%";
		scrollImg.width = 9;
		scrollImg.src = "images\\scrollbar.png";
	
		var scrollBar = scrollDiv.appendElement("<scrollbar />");
		scrollBar.enabled = true;
		scrollBar.height = div.height+10;
		scrollBar.name = "sb";
		scrollBar.width = 8;
		scrollBar.y = -10;
		scrollBar.lineStep = 10;
		scrollBar.max = htmlDiv.height-div.height;
		scrollBar.orientation = "vertical";
		scrollBar.thumbDownImage = "images\\scroll.png";
		scrollBar.thumbImage = "images\\scroll.png";
		scrollBar.thumbOverImage = "images\\scroll.png";
		scrollBar.onchange = function() {
				htmlDiv.y = -scrollBar.value;
			};

	}

	// debug.trace("Rest string: "+str);
	
}

function getImageFromUrl(url, target) {
	if (!url.match("([a-zA-Z]+)://")) {
		if (url.substring(0,1) == "/") {
			endDomain = baseUrl.indexOf("://");
			endDomain = baseUrl.indexOf("/", endDomain+3);
			url = baseUrl.substring(0, endDomain)+url;
		}
		else {
			url = baseUrl + url;
		}
	}
	debug.trace("Requesting Image: "+url);
	var req = new XMLHttpRequest();
	req.open('GET', url, true); 
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				target.src = req.responseStream;
			}
			else {
				debug.gadget.error("Error loading page\n");
			}
		}
	};
	req.send(null);
}

function basicCalcWidth(str, ele) {

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
