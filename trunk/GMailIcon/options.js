/*
Options Dialog
*/
function ShowOptionsDlg(wnd) {
  var ctl;

	wnd.AddControl(gddWndCtrlClassLabel, 0, "", strAccount, 10, 10, 220, 20);
  wnd.AddControl(gddWndCtrlClassEdit, 0, "input_account", options.getValue("account"), 10, 25, 220, 25);

  wnd.AddControl(gddWndCtrlClassLabel, 0, "", strUsername, 10, 50, 220, 20);
  wnd.AddControl(gddWndCtrlClassEdit, 0, "input_username", options.getValue("username"), 10, 65, 220, 25);

  wnd.AddControl(gddWndCtrlClassLabel, 0, "", strPassword, 10, 90, 220, 20);
  wnd.AddControl(gddWndCtrlClassEdit, gddWndCtrlTypeEditPassword, "input_password", options.getValue("password"), 10, 105, 220, 25);

	wnd.AddControl(gddWndCtrlClassLabel, 0, "", strMoreOptions, 10, 150, 220, 20);

  var options_account = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "showAccount", strShowAccount, 20, 170, 260, 20);
  options_account.value = options.getValue("displayAccount");

	var options_apps = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "googleApps", strAppsFix, 20, 190, 260, 20);
  options_apps.value = options.getValue("isGoogleApps");

	var options_alwaysacc = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "alwaysAccount", strAlwaysAccount, 20, 210, 260, 20);
  options_alwaysacc.value = options.getValue("alwaysAccount");

	wnd.AddControl(gddWndCtrlClassLabel, 0, "", strInterval, 20, 235, 80, 20);
  wnd.AddControl(gddWndCtrlClassEdit, gddWndCtrlClassEdit, "refreshInterval", options.getValue("interval")/(60*1000), 100, 230, 40, 25);
	wnd.AddControl(gddWndCtrlClassLabel, 0, "", strMinutes, 145, 235, 80, 20);

	var designs = [];
	designs.push(strRedDesign);
	designs.push(strGrayDesign);
	designs.push(strGreenDesign)
	designs.push(strBlueDesign);
	ctl = wnd.AddControl(gddWndCtrlClassList, gddWndCtrlTypeListDrop, "design", designs, 20, 260, 260, 25);
	switch (options.getValue("design")) {
		case "red": 
				ctl.value = strRedDesign;
				break;
		case "gray": 
				ctl.value = strGrayDesign;
				break;
		case "green": 
				ctl.value = strGreenDesign;
				break;
		case "blue": 
				ctl.value = strBlueDesign;
				break;
	}

  wnd.onClose = OptionsDlgClosed;
  
}

function OptionsDlgClosed(wnd, code) {
  if (code != gddIdOK) {
    return;
  }
  
  var ctl;

	ctl = wnd.GetControl("input_account");
  options.putValue("account", ctl.value);

  ctl = wnd.GetControl("input_username");
  options.putValue("username", ctl.value);

  ctl = wnd.GetControl("input_password");
  options.putValue("password", ctl.value);

	ctl = wnd.GetControl("showAccount");
	options.putValue("displayAccount", ctl.value);

	ctl = wnd.GetControl("googleApps");
	options.putValue("isGoogleApps", ctl.value);

	ctl = wnd.GetControl("alwaysAccount");
	options.putValue("alwaysAccount", ctl.value);

	ctl = wnd.GetControl("refreshInterval");
	options.putValue("interval", parseInt(ctl.value)*60*1000);

	ctl = wnd.GetControl("design");
	switch (ctl.value) {
		case strRedDesign: 
				options.putValue("design", "red");
				break;
		case strGrayDesign: 
				options.putValue("design", "gray");
				break;
		case strGreenDesign: 
				options.putValue("design", "green");
				break;
		case strBlueDesign: 
				options.putValue("design", "blue");
				break;
	}
	debug.trace("Setting images based on selected design");
	var design = options.getValue("design");
	dot.src = "images\\"+design+"_dot.png";
	titleBg.src = "images\\"+design+"_titlebg.png";
	background.src = "images\\"+design+"_gmail_envelope.png";

	checkMail();
  return true;
}