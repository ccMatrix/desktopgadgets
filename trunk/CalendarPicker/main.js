function view_onOpen() {

}

function edit1_onrclick() {
	var calendar = new CalendarPicker();
	calendar.weekStart = 1;
	calendar.onDatePicked = function() {
		var d = calendar.value;
		edit1.value = d.getMonth()+"/"+d.getDate()+"/"+d.getYear();
		};
	calendar.showAuto(edit1);  
}

function img1_onclick() {
	var calendar = new CalendarPicker();
	calendar.weekStart = 0;
	calendar.onDatePicked = function() {
		var d = calendar.value;
		edit2.value = d.getMonth()+"/"+d.getDate()+"/"+d.getYear();
		};
	calendar.showAuto(img1);  
}
