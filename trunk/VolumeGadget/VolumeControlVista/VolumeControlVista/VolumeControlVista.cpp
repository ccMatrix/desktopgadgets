// VolumeControlVista.cpp : Definiert den Einstiegspunkt für die Konsolenanwendung.
//

#include "stdafx.h"
#include <stdio.h>
#include <windows.h>
#include <mmdeviceapi.h>
#include <endpointvolume.h>

int _tmain(int argc, _TCHAR* argv[])
{
	try {
		HRESULT hr;
		int result = 0;
		double newVolume;

		if (argc != 3 && argc != 2 && argc != 1)
		{
			return -1;
		}

		CoInitialize(NULL);
		IMMDeviceEnumerator *deviceEnumerator = NULL;
		hr = CoCreateInstance(__uuidof(MMDeviceEnumerator), NULL, CLSCTX_INPROC_SERVER, __uuidof(IMMDeviceEnumerator), (LPVOID *)&deviceEnumerator);
		IMMDevice *defaultDevice = NULL;

		hr = deviceEnumerator->GetDefaultAudioEndpoint(eRender, eConsole, &defaultDevice);
		deviceEnumerator->Release();
		deviceEnumerator = NULL;

		IAudioEndpointVolume *endpointVolume = NULL;
		hr = defaultDevice->Activate(__uuidof(IAudioEndpointVolume), CLSCTX_INPROC_SERVER, NULL, (LPVOID *)&endpointVolume);
		defaultDevice->Release();
		defaultDevice = NULL; 

		if (argc == 2)
		{
			newVolume = _tstof(argv[1]);
			newVolume = newVolume/100;
			hr = endpointVolume->SetMasterVolumeLevelScalar((float)newVolume, NULL);
		}
		else if (argc == 1)
		{
			float currentVolume = 0;

			hr = endpointVolume->GetMasterVolumeLevelScalar(&currentVolume);
			result = (int)(currentVolume*100);
		}
		else if (argc == 3)
		{
			// VolumeControlVista mute -1 = get
			// VolumeControlVista mute 0 = set mute off
			// VolumeControlVista mute 1 = set mute on
			int muted = _tstoi(argv[2]);
			BOOL isMute = FALSE;
			if (muted == -1)
			{
				hr = endpointVolume->GetMute( &isMute );
				result = (isMute)?1:0;
			}
			else
			{
				isMute = (muted == 1);
				hr = endpointVolume->SetMute( isMute, NULL );
			}
		}

		endpointVolume->Release();

		CoUninitialize();
		return result;
	}
	catch (char* msg) {
		return 0;
	}
}

