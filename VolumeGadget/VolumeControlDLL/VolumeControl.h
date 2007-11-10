// VolumeControl.h : Deklaration von CVolumeControl

#pragma once
#include "resource.h"       // Hauptsymbole
#include <string.h>

#include "VolumeControlDLL.h"


// CVolumeControl

class ATL_NO_VTABLE CVolumeControl : 
	public CComObjectRootEx<CComSingleThreadModel>,
	public CComCoClass<CVolumeControl, &CLSID_VolumeControl>,
	public IDispatchImpl<IVolumeControl, &IID_IVolumeControl, &LIBID_VolumeControlDLLLib, /*wMajor =*/ 0xFFFF, /*wMinor =*/ 0xFFFF>
{
public:
	CVolumeControl()
	{

	}

DECLARE_REGISTRY_RESOURCEID(IDR_VOLUMECONTROL)


BEGIN_COM_MAP(CVolumeControl)
	COM_INTERFACE_ENTRY(IVolumeControl)
	COM_INTERFACE_ENTRY(IDispatch)
END_COM_MAP()


	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		return S_OK;
	}
	
	void FinalRelease() 
	{
	}

public:

	STDMETHOD(getVolume)(DWORD* volume);
	STDMETHOD(setVolume)(SHORT* volume);
	STDMETHOD(toggleMute)();
	STDMETHOD(isMute)(SHORT* ismute);
	STDMETHOD(isWinVista)(BYTE* vista);

private:
	UINT m_nNumMixers;
	HMIXER m_hMixer;
	MIXERCAPS m_mxcaps;

	DWORD m_dwMuteControlID;
	DWORD m_dwVolumeControlID;

	CString m_strDstLineName;
	CString m_strMuteControlName;
	CString m_strVolumeControlName;

	BOOL amdUninitialize();
	BOOL amdInitialize();
	BOOL amdGetMasterMuteControl();
	BOOL amdGetMasterMuteValue(LONG &lVal) const;
	BOOL amdSetMasterMuteValue(LONG lVal) const;
	BOOL amdGetMasterVolumeControl();
	BOOL amdGetMasterVolumeValue(DWORD &dwVal) const;
	BOOL amdSetMasterVolumeValue(DWORD dwVal) const;
};

OBJECT_ENTRY_AUTO(__uuidof(VolumeControl), CVolumeControl)
