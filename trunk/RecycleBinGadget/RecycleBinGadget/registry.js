//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 registry.js

 Copyright (C) 2006 WildTangent, Inc.
 All Rights Reserved

 Brent Orford
 4/7/2006
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var kHKEY_CLASSES_ROOT   = 0x80000000;
var kHKEY_CURRENT_USER   = 0x80000001;
var kHKEY_LOCAL_MACHINE  = 0x80000002;
var kHKEY_USERS    = 0x80000003;
var kHKEY_CURRENT_CONFIG = 0x80000005;

var kVALUE_STRING   = 0;
var kVALUE_EXPANDEDSTRING = 1;
var kVALUE_MULTISTRING  = 2;
var kVALUE_BINARY   = 3;
var kVALUE_DWORD   = 4;

function _Registry()
{
 this.m_wmiLocator  = new ActiveXObject("WbemScripting.SWbemLocator");
 this.m_wmiServer  = this.m_wmiLocator.ConnectServer(null, "root\\default");
 this.m_wmiRegistry  = this.m_wmiServer.Get("StdRegProv");
}

_Registry.prototype.GetSubKeys = Registry_GetSubkeys;
_Registry.prototype.ReadValue = Registry_ReadValue;
_Registry.prototype.WriteReg = Registry_WriteReg;
_Registry.prototype.DeleteReg = Registry_DeleteReg;

// Treat as private
_Registry.prototype._ExecMethod = Registry_ExecMethod;

///////////////////////////////////////////////////////////////////
function Registry_ExecMethod ( DefKey, SubKeyName, Value, Method )
{
 var oMethod    = this.m_wmiRegistry.Methods_.Item(Method);
 var oInParam   = oMethod.inParameters.SpawnInstance_();

 oInParam.hDefKey  = DefKey;
 oInParam.sSubKeyName = SubKeyName;
 
 if ( Value != null )
 {
  oInParam.sValueName  = Value;
 }

 return this.m_wmiRegistry.ExecMethod_( Method, oInParam );
}

///////////////////////////////////////////////////////////////////
function Registry_GetSubkeys ( DefKey, SubKeyName )
{
	var subKeys = this._ExecMethod ( DefKey, SubKeyName, null, "EnumKey" );
	if (typeof subKeys.sNames == "object") {
		return [];
	}
	return subKeys.sNames.toArray();
}

///////////////////////////////////////////////////////////////////
function Registry_ReadValue ( DefKey, SubKeyName, ValueName, ValueType )
{
 var MethodName = "";
 
 switch ( ValueType )
 {
  case kVALUE_STRING:
  {
   MethodName = "GetStringValue";
   break;
  };
  case kVALUE_EXPANDEDSTRING:
  {
   MethodName = "GetExpandedStringValue";
   break;
  };
  case kVALUE_MULTISTRING:
  {
   MethodName = "GetMultiStringValue";
   break;
  };
  case kVALUE_BINARY:
  {
   MethodName = "GetBinaryValue";
   break;
  };
  case kVALUE_DWORD:
  {
   MethodName = "GetDWORDValue";
   break;
  };
 };
 
 var RetVal = this._ExecMethod ( DefKey, SubKeyName, ValueName, MethodName );
 return RetVal.Properties_("sValue");
}

///////////////////////////////////////////////////////////////////
function Registry_WriteReg ()
{
}

///////////////////////////////////////////////////////////////////
function Registry_DeleteReg ()
{
}