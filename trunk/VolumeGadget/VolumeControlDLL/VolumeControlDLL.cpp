// VolumeControlDLL.cpp : Implementierung von DLL-Exporten.

#include "stdafx.h"
#include "resource.h"
#include "VolumeControlDLL.h"

class CVolumeControlDLLModule : public CAtlDllModuleT< CVolumeControlDLLModule >
{
public :
	DECLARE_LIBID(LIBID_VolumeControlDLLLib)
	DECLARE_REGISTRY_APPID_RESOURCEID(IDR_VOLUMECONTROLDLL, "{41F7464B-33B2-4A8D-8C53-80AD776033E5}")
};

CVolumeControlDLLModule _AtlModule;


// DLL-Einstiegspunkt
extern "C" BOOL WINAPI DllMain(HINSTANCE hInstance, DWORD dwReason, LPVOID lpReserved)
{
	hInstance;
    return _AtlModule.DllMain(dwReason, lpReserved); 
}


// Wird verwendet, um festzustellen, ob die DLL von OLE entladen werden kann
STDAPI DllCanUnloadNow(void)
{
    return _AtlModule.DllCanUnloadNow();
}


// Gibt eine Klassenfactory zur�ck, um f�r den angeforderten Typ ein Objekt zu erstellen
STDAPI DllGetClassObject(REFCLSID rclsid, REFIID riid, LPVOID* ppv)
{
    return _AtlModule.DllGetClassObject(rclsid, riid, ppv);
}


// DllRegisterServer - F�gt Eintr�ge in die Systemregistrierung hinzu
STDAPI DllRegisterServer(void)
{
    // Registriert Objekt, Typelib und alle Schnittstellen in Typelib
    HRESULT hr = _AtlModule.DllRegisterServer();
	return hr;
}


// DllUnregisterServer - Entfernt Eintr�ge aus der Systemregistrierung
STDAPI DllUnregisterServer(void)
{
	HRESULT hr = _AtlModule.DllUnregisterServer();
	return hr;
}
