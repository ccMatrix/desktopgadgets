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

  ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "showAccount", strShowAccount, 20, 170, 260, 20);
  ctl.value = options.getValue("displayAccount");

	ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "googleApps", strAppsFix, 20, 190, 260, 20);
  ctl.value = options.getValue("isGoogleApps");

	ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "alwaysAccount", strAlwaysAccount, 20, 210, 260, 20);
  ctl.value = options.getValue("alwaysAccount");

	wnd.AddControl(gddWndCtrlClassLabel, 0, "", strInterval, 20, 235, 80, 20);
  wnd.AddControl(gddWndCtrlClassEdit, gddWndCtrlClassEdit, "refreshInterval", options.getValue("interval")/(60*1000), 100, 230, 40, 25);
	wnd.AddControl(gddWndCtrlClassLabel, 0, "", strMinutes, 145, 235, 80, 20);

	var designs = [];
	var designAppendix = " ("+strDesignEmpty+")";
	designs.push(strRedDesign+designAppendix);
	designs.push(strGrayDesign+designAppendix);
	designs.push(strGreenDesign+designAppendix)
	designs.push(strBlueDesign+designAppendix);
	ctl = wnd.AddControl(gddWndCtrlClassList, gddWndCtrlTypeListDrop, "designEmpty", designs, 20, 260, 260, 25);
	switch (options.getValue("design")) {
		case "red": 
				ctl.value = strRedDesign+designAppendix;
				break;
		case "gray": 
				ctl.value = strGrayDesign+designAppendix;
				break;
		case "green": 
				ctl.value = strGreenDesign+designAppendix;
				break;
		case "blue": 
				ctl.value = strBlueDesign+designAppendix;
				break;
	}

	designs = [];
	designAppendix = " ("+strDesignFull+")";
	designs.push(strRedDesign+designAppendix);
	designs.push(strGrayDesign+designAppendix);
	designs.push(strGreenDesign+designAppendix)
	designs.push(strBlueDesign+designAppendix);
	ctl = wnd.AddControl(gddWndCtrlClassList, gddWndCtrlTypeListDrop, "designFull", designs, 20, 285, 260, 25);
	switch (options.getValue("designFull")) {
		case "red": 
				ctl.value = strRedDesign+designAppendix;
				break;
		case "gray": 
				ctl.value = strGrayDesign+designAppendix;
				break;
		case "green": 
				ctl.value = strGreenDesign+designAppendix;
				break;
		case "blue": 
				ctl.value = strBlueDesign+designAppendix;
				break;
	}


	wnd.AddControl(gddWndCtrlClassLabel, 0, "", strNotifyAlert, 36, 310, 240, 20);
	ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonPush, "notifyAlert", "?", 19, 310, 16, 16);
	ctl.onClicked = OnAlertsInformation;

	ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonCheck, "notifySound", strNotifySound, 20, 330, 260, 20);
  ctl.value = options.getValue("notifySoundEnable");
  wnd.AddControl(gddWndCtrlClassEdit, 0, "notifySoundFile", options.getValue("notifySoundFile"), 40, 350, 190, 25);
	ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonPush, "chooseSound", "...", 235, 350, 25, 20);
  ctl.onClicked = OnChooseSound;
	ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonPush, "previewSound", ">", 260, 350, 25, 20);
  ctl.onClicked = OnPlaySound;

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

	ctl = wnd.GetControl("notifySound");
	options.putValue("notifySoundEnable", ctl.value);

	ctl = wnd.GetControl("notifySoundFile");
	options.putValue("notifySoundFile", ctl.value);

	ctl = wnd.GetControl("refreshInterval");
	options.putValue("interval", parseInt(ctl.value)*60*1000);

	ctl = wnd.GetControl("designEmpty");
	var designAppendix = " ("+strDesignEmpty+")";
	switch (ctl.value) {
		case strRedDesign+designAppendix: 
				options.putValue("design", "red");
				break;
		case strGrayDesign+designAppendix:
				options.putValue("design", "gray");
				break;
		case strGreenDesign+designAppendix:
				options.putValue("design", "green");
				break;
		case strBlueDesign+designAppendix:
				options.putValue("design", "blue");
				break;
	}

	ctl = wnd.GetControl("designFull");
	var designAppendix = " ("+strDesignFull+")";
	switch (ctl.value) {
		case strRedDesign+designAppendix: 
				options.putValue("designFull", "red");
				break;
		case strGrayDesign+designAppendix:
				options.putValue("designFull", "gray");
				break;
		case strGreenDesign+designAppendix:
				options.putValue("designFull", "green");
				break;
		case strBlueDesign+designAppendix:
				options.putValue("designFull", "blue");
				break;
	}

	checkMail();
  return true;
}

function OnChooseSound(wnd, control) {
	var ctl = wnd.GetControl("notifySoundFile");
	var audioFile = framework.BrowseForFile(strMusicFiles+"|*.mp3;*.wav");
	if (audioFile.length > 0) {
		ctl.value = audioFile
	}
}

function OnPlaySound(wnd, control) {
	var ctl = wnd.GetControl("notifySoundFile");
	if (framework.system.filesystem.FileExists(ctl.value)) {
		try {
			playNotification(ctl.value);
		}
		catch (E) {
			debug.error( E.description );
		}
	}
}

function OnAlertsInformation(wnd, control) {
	var ctl = wnd.GetControl("notifyAlert");
	ctl.value = false;
	alert( strAlertEnableInformation );
}