var lastDigits = {"d0":-1,"d1":-1,"d2":-1,"d3":-1};
var months = strMonths.split(",");

function view_onOpen() {
	setInterval("animClock();", 1000);
}

function animClock() {
	var d = new Date();
	var hour = d.getHours().toString();
	if (hour.length == 1) hour = "0"+hour;
  var min = d.getMinutes().toString();
	if (min.length == 1) min = "0"+min;
	dateLabel.innerText = d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear();
	var s = hour+min;
	setDigit("d0", s.charAt(0));
	setDigit("d1", s.charAt(1));
	setDigit("d2", s.charAt(2));
	setDigit("d3", s.charAt(3));
	dot.visible = !dot.visible;
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