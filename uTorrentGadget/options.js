options.putDefaultValue("interface_ip", "");
options.putDefaultValue("interface_port", "");
options.putDefaultValue("interface_username", "");
options.putDefaultValue("interface_password", "");

options.putDefaultValue("show_completed", false);
options.putDefaultValue("show_stopped", true);
options.putDefaultValue("show_started", true);
options.putDefaultValue("show_seeding", true);

/*
Options Dialog
*/
function ShowOptionsDlg(wnd) {
  var ctl;
  wnd.AddControl(gddWndCtrlClassLabel, 0, "", OPTION_IP, 40, 10, 170, 20);
  wnd.AddControl(gddWndCtrlClassEdit, 0, "input_ip", interface_ip, 40, 25, 170, 25);

  wnd.AddControl(gddWndCtrlClassLabel, 0, "", ":", 214, 30, 5, 20);

  wnd.AddControl(gddWndCtrlClassLabel, 0, "", OPTION_PORT, 220, 10, 50, 20);
  wnd.AddControl(gddWndCtrlClassEdit, 0, "input_port", interface_port, 220, 25, 50, 25);

  wnd.AddControl(gddWndCtrlClassLabel, 0, "", OPTION_USERNAME, 40, 50, 220, 20);
  wnd.AddControl(gddWndCtrlClassEdit, 0, "input_username", interface_username, 40, 65, 220, 25);

  wnd.AddControl(gddWndCtrlClassLabel, 0, "", OPTION_PASSWORD, 40, 90, 220, 20);
  wnd.AddControl(gddWndCtrlClassEdit, gddWndCtrlTypeEditPassword, "input_password", interface_password, 40, 105, 220, 25);

  /*
  ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonPush, "addFolder", "+", 225, 25, 25, 20);
  ctl.onClicked = OnAddFolder;
  ctl = wnd.AddControl(gddWndCtrlClassButton, gddWndCtrlTypeButtonPush, "removeFolder", "-", 255, 25, 25, 20);
  ctl.onClicked = OnRemoveFolder;
  */

  wnd.onClose = OptionsDlgClosed;
  
}

function OptionsDlgClosed(wnd, code) {
  if (code != gddIdOK) {
    return;
  }
  
  var ctl;
  ctl = wnd.GetControl("input_ip");
  gadget.debug.trace("New IP: "+ctl.value);
  options.putValue("interface_ip", ctl.value);
  

  ctl = wnd.GetControl("input_port");
  gadget.debug.trace("New port: "+ctl.value);
  options.putValue("interface_port", ctl.value);

  ctl = wnd.GetControl("input_username");
  gadget.debug.trace("New username: "+ctl.value);
  options.putValue("interface_username", ctl.value);

  ctl = wnd.GetControl("input_password");
  gadget.debug.trace("New password: "+ctl.value);
  options.putValue("interface_password", ctl.value);

  loadOptionsData();

  requestData();

  return true;
}

function loadOptionsData() {
  interface_ip=options.getValue("interface_ip");
  interface_port=options.getValue("interface_port");
  interface_username=options.getValue("interface_username");
  interface_password=options.getValue("interface_password");
  show_completed=options.getValue("show_completed");
  show_stopped=options.getValue("show_stopped");
  show_started=options.getValue("show_started");
  show_seeding=options.getValue("show_seeding");

  // Create URL based on options data
  interface_url="http://"+interface_username+":"+interface_password+"@"+interface_ip+":"+interface_port+"/gui/?list=1";
}