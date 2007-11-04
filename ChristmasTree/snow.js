// This JavaScript code can be freely redistributed
// as long as this copyright notice is keept unchanged.
// This code is used on AS-IS basis and
// you use it on your own risk. Author of this code
// is not responsible for any damage that this
// code may make.
//
// JS Snow v0.2
// finished on 11-10-1999 23:04 in Zagreb, Croatia.
// modified on 06-12-2005 11:20 in Zagreb, Croatia.
//
// modified on 04-11-2007 16:46 in Albstadt,Germany.
// modified by Benjamin Schirmer
// adapted for Google Desktop Gadget engine
//
// Copyright 1999,2005 Altan d.o.o.
// http://www.altan.hr/snow/index.html
// E-mail: snow@altan.hr

function Snow(parent, n) {
	this.no = n;
	this.dx = new Array();
	this.xp = new Array();
	this.yp = new Array();
	this.am = new Array();
	this.stx = new Array();
	this.sty = new Array();
	this.doc_width = parent.width;
	this.doc_height = parent.height;
	this.snowContainer = parent;

	for (var i = 0; i < this.no; ++ i) {  
		this.dx[i] = 0;                        // set coordinate variables
		this.xp[i] = Math.random()*(this.doc_width-50);  // set position variables
		this.yp[i] = Math.random()*this.doc_height;
		this.am[i] = Math.random()*20;         // set amplitude variables
		this.stx[i] = 0.02 + Math.random()/10; // set step variables
		this.sty[i] = 0.7 + Math.random();     // set step variables
		
		this.snowContainer.appendElement("<img name=\"dot"+i+"\" x=\"15\" y=\"15\" src=\"images/snowflake.png\" />");
	}
}
  
Snow.prototype.snow = function() {
  for (var i = 0; i < this.no; ++ i) {  // iterate for every dot
    this.yp[i] += this.sty[i];
    if (this.yp[i] > this.doc_height-50) {
      this.xp[i] = Math.random()*(this.doc_width-this.am[i]-30);
      this.yp[i] = 0;
      this.stx[i] = 0.02 + Math.random()/10;
      this.sty[i] = 0.7 + Math.random();
    }
    this.dx[i] += this.stx[i];
    this.snowContainer.children.item("dot"+i).y = this.yp[i];
    this.snowContainer.children.item("dot"+i).x = this.xp[i] + this.am[i]*Math.sin(this.dx[i]);
  }
}