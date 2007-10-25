// recyclebin.h : Deklaration von Crecyclebin

#pragma once
#include "resource.h"       // Hauptsymbole

#include "RecycleBinDLL.h"

// Crecyclebin

class ATL_NO_VTABLE Crecyclebin : 
	public CComObjectRootEx<CComSingleThreadModel>,
	public CComCoClass<Crecyclebin, &CLSID_recyclebin>,
	public IDispatchImpl<Irecyclebin, &IID_Irecyclebin, &LIBID_RecycleBinDLLLib, /*wMajor =*/ 0xFFFF, /*wMinor =*/ 0xFFFF>
{
public:
	Crecyclebin()
	{
	}

DECLARE_REGISTRY_RESOURCEID(IDR_RECYCLEBIN)


BEGIN_COM_MAP(Crecyclebin)
	COM_INTERFACE_ENTRY(Irecyclebin)
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

	STDMETHOD(binStatus)(USHORT* status);
	STDMETHOD(openRecycleBin)(void);
	STDMETHOD(emptyBin)(void);
	STDMETHOD(moveToBin)(BSTR* filename);

	void logError(char* str);
};

OBJECT_ENTRY_AUTO(__uuidof(recyclebin), Crecyclebin)
