// recyclebin.cpp : Implementierung von Crecyclebin

#include "stdafx.h"
#include "recyclebin.h"

// Crecyclebin

bool IsWindowsVista()
{
        OSVERSIONINFO osvi;
        bool bIsWindowsXPorLater;

        osvi.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);
        GetVersionEx (&osvi);
        bIsWindowsXPorLater =
                ( (osvi.dwMajorVersion > 6) ||
                ( (osvi.dwMajorVersion == 6) && (osvi.dwMinorVersion >= 0) ));

        return bIsWindowsXPorLater;

} 

STDMETHODIMP Crecyclebin::binStatus(USHORT* status)
{
	int counter = 0;
	try
	{
		IShellFolder   *pDesktop    = NULL;
		IShellFolder   *m_pRecycleBin = NULL;
		LPITEMIDLIST   pidlRecycleBin    = NULL;
		HRESULT        hr        = S_OK;
		LPENUMIDLIST   penumFiles;

		hr = SHGetDesktopFolder(&pDesktop);
		hr = SHGetSpecialFolderLocation (0, CSIDL_BITBUCKET, &pidlRecycleBin);
		hr = pDesktop->BindToObject(pidlRecycleBin, NULL, 
								IID_IShellFolder, (LPVOID *)&m_pRecycleBin);
	
		LPITEMIDLIST    pidl        = NULL;
		// Iterate through list
		m_pRecycleBin->EnumObjects(0, SHCONTF_FOLDERS|SHCONTF_NONFOLDERS| 
							SHCONTF_INCLUDEHIDDEN, &penumFiles);
		
		if (SUCCEEDED (hr))
		{
			while (penumFiles->Next(1, &pidl, NULL) != S_FALSE)
			{
				counter++;
			}
		}
		free(pDesktop);
		free(m_pRecycleBin);
		free(pidl);
	}
	catch (char * str)
	{
		this->logError("binStatus Error");
		this->logError(str);
	}

	*status = counter;
	return S_OK;
}

STDMETHODIMP Crecyclebin::openRecycleBin(void)
{
	try 
	{
		if (!IsWindowsVista())
		{
			ShellExecute(0, "open", "explorer.exe",
				"/root,::{645FF040-5081-101B-9F08-00AA002F954E}", 0, SW_SHOWNORMAL);
		}
	}
	catch (char * str)
	{
		this->logError("openRecycleBin Error");
		this->logError(str);
	}
	return S_OK;
}

STDMETHODIMP Crecyclebin::emptyBin(void)
{
	try
	{
		SHEmptyRecycleBin(0, NULL, 0);
	}
	catch (char * str)
	{
		this->logError("emptyBin Error");
		this->logError(str);
	}
	return S_OK;
}
STDMETHODIMP Crecyclebin::moveToBin(BSTR* filename)
{
	try
	{
		SHFILEOPSTRUCT shFileOps;
		shFileOps.wFunc = FO_DELETE;
		shFileOps.fFlags = FOF_ALLOWUNDO | FOF_SILENT | FOF_NOCONFIRMATION;
		char arr[1024];
		FillMemory(arr, 1024, '\0');
		sprintf_s(arr, "%S\0", *filename);
		shFileOps.pFrom = arr;
		shFileOps.pTo = "Recycle Bin";
		int ret = SHFileOperation(&shFileOps);

		if (ret != 0) {
			MessageBox(NULL, "Error", "Error", MB_OK);
		}
	}
	catch (char * str)
	{
		this->logError("MoveToBin Error");
		this->logError(str);
	}
	return S_OK;
}

void Crecyclebin::logError(char* str) 
{
	char* tmp = new char[255];
	memset(tmp, '\0', 255);
	GetTempPath( 255, tmp );
	char* tmpFile = new char[500];
	memset(tmpFile, '\0', 500);
	sprintf_s(tmpFile, 500, "%s\\RecycleBin.log", tmp);
	FILE* fp;
	fopen_s(&fp,  tmpFile, "a");
	if (fp != NULL)
	{
		fputs(str, fp);
		fclose(fp);
	}
	delete tmp;
	delete tmpFile;
}