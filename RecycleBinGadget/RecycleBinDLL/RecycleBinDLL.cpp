// RecycleBinDLL.cpp : Implementierung von DLL-Exporten.

#include "stdafx.h"
#include "resource.h"
#include "RecycleBinDLL.h"

class CRecycleBinDLLModule : public CAtlDllModuleT< CRecycleBinDLLModule >
{
public :
	DECLARE_LIBID(LIBID_RecycleBinDLLLib)
	DECLARE_REGISTRY_APPID_RESOURCEID(IDR_RECYCLEBINDLL, "{CE5265E5-CAF8-41E8-974F-1EABA7DC94C7}")
};

CRecycleBinDLLModule _AtlModule;


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


// Gibt eine Klassenfactory zurück, um für den angeforderten Typ ein Objekt zu erstellen
STDAPI DllGetClassObject(REFCLSID rclsid, REFIID riid, LPVOID* ppv)
{
    return _AtlModule.DllGetClassObject(rclsid, riid, ppv);
}


// DllRegisterServer - Fügt Einträge in die Systemregistrierung hinzu
STDAPI DllRegisterServer(void)
{
    // Registriert Objekt, Typelib und alle Schnittstellen in Typelib
    HRESULT hr = _AtlModule.DllRegisterServer();
	return hr;
}


// DllUnregisterServer - Entfernt Einträge aus der Systemregistrierung
STDAPI DllUnregisterServer(void)
{
	HRESULT hr = _AtlModule.DllUnregisterServer();
	return hr;
}
