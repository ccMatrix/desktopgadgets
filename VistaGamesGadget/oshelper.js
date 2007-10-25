function OS() { 
  var wmi = GetObject("winmgmts:{impersonationLevel=Impersonate}\\\\.\\root\\cimv2");
  var query = "Select * From Win32_OperatingSystem";
  e = new Enumerator(wmi.ExecQuery(query));
  var data = e.item();

  this.windowsSKU = data.OpertingSystemSKU;
  this.serial = data.SerialNumber;
  this.build = data.BuildNumber;
  this.buildType = data.BuildType;
  this.servicePackMajor = data.ServicePackMajorVersion;
  this.servicePackMinor = data.ServicePackMinorVersion;
  this.version = data.Version;
  this.caption = data.Caption;
  this.name = data.Name;
  if (this.name.indexOf("|") > 0) {
    this.name = this.name.substring(0, this.name.indexOf("|"))
  }
}

OS.prototype.compareVersion = function(version2) {
  var v1 = this.version.split(".");
  var v2 = version2.split(".");
  var result = 0;
  for (var i=0; i<v1.length; i++) {
    if (v1[i] > v2[i]) {
      result = 1;
    }
    else if (v1[i] < v2[i]) {
      result = -1;
    }
    if (result != 0) {
      break;
    }
  }
  if (v2.length > v1.length && v2[v2.length-1] != 0) {
    result = -1;
  }
  return (result == 0);
}

OS.prototype.isVista = function() {
  return this.compareVersion("6.0");
}

OS.prototype.isXP = function() {
  return this.compareVersion("5.1");
}

OS.prototype.is2000 = function() {
  return this.compareVersion("5.0");
}