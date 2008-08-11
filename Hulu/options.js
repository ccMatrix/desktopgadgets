function ShowOptionsDlg(wnd) {
  var ctl;

	wnd.AddControl(gddWndCtrlClassLabel, 0, "", strSeries, 10, 10, 220, 20);

	var series = [];
	var currentSeries = options.getValue("currentSeries");
	var activeSeries = "";
	for (var i=0; i<huluSeries.length; i++) {
		series[i] = huluSeries[i].getName();
		if (huluSeries[i].getID() == currentSeries) {
			activeSeries = huluSeries[i].getName();
		}
	}
	ctl = wnd.AddControl(gddWndCtrlClassList, gddWndCtrlTypeListDrop, "series", series, 10, 25, 220, 25);
	ctl.value = activeSeries;

  wnd.onClose = OptionsDlgClosed;
  
}

function OptionsDlgClosed(wnd, code) {
  if (code != gddIdOK) {
    return;
  }
  
  var ctl;

	var googleApps = true;

	ctl = wnd.GetControl("series");
	var selectedSeries = ctl.value;
	for (var i=0; i<huluSeries.length; i++) {
		if (huluSeries[i].getName() == selectedSeries) {
			options.putValue("currentSeries", huluSeries[i].getID());
			debug.trace("New show is: "+selectedSeries+" /"+huluSeries[i].getID());
			break;
		}
	}

	displayCurrent();
  return true;
}