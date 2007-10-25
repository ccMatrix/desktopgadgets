// VolumeControl.cpp : Implementierung von CVolumeControl

#include "stdafx.h"
#include "VolumeControl.h"
#include ".\volumecontrol.h"
#include <mmsystem.h>
#include <stdlib.h>
#include <stdio.h>
//#include <windows.h>
//#include <mmdeviceapi.h>
//#include <endpointvolume.h>


// CVolumeControl

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

STDMETHODIMP CVolumeControl::getVolume(DWORD* volume)
{
	if (IsWindowsVista())
	{
		// MessageBox(0, "This gadget is not available for Windows Vista", "VolumeControl", 0);
	}
	else
	{
		this->amdInitialize();
		this->amdGetMasterVolumeControl();
		DWORD vol = 0;
		this->amdGetMasterVolumeValue(vol);
		vol = vol & 0xFFFF;
	
		//If the level is above 0, then calculate it's percentage (0-100%)
		if (vol)
			vol = (DWORD)((double)(vol / (double)0xFFFF) * 100.0);
		*volume = (SHORT)(vol);

		this->amdUninitialize();
	}

	return S_OK;
}

STDMETHODIMP CVolumeControl::setVolume(SHORT* volume)
{
	if (IsWindowsVista())
	{
	}
	else
	{
		this->amdInitialize();
		this->amdGetMasterVolumeControl();
		DWORD setLevel = 0x00000000;

		//Don't set the volume to anything greater than the max level
		if (*volume > 100)
			*volume = 100;
	
		//Calculate a value based on the percentage input of one channel
		if (*volume)
			setLevel = (DWORD)(((double)*volume / 100.0) * (double)0xFFFF);
	
		//this->amdSetMasterVolumeValue( setLevel );
		this->amdSetMasterVolumeValue( setLevel );

		this->amdUninitialize();

		return S_OK;
	}
}

STDMETHODIMP CVolumeControl::toggleMute()
{
	this->amdInitialize();
	this->amdGetMasterMuteControl();
	LONG lVal = 0;
	BOOL isMute = false;
	this->amdGetMasterMuteValue(lVal);
	isMute = (lVal != 0);
	isMute = !isMute;
	this->amdSetMasterMuteValue(isMute);

	this->amdUninitialize();

	return S_OK;
}

STDMETHODIMP CVolumeControl::isMute(SHORT* ismute)
{
	this->amdInitialize();
	this->amdGetMasterMuteControl();
	LONG lVal = 0;
	this->amdGetMasterMuteValue(lVal);
	*ismute = (SHORT)lVal;

	this->amdUninitialize();

	return S_OK;
}

STDMETHODIMP CVolumeControl::isWinVista(BYTE* vista)
{
	*vista = IsWindowsVista()?1:0;
	return S_OK;
}

BOOL CVolumeControl::amdInitialize()
{
	assert(this->m_hMixer == NULL);

	// get the number of mixer devices present in the system
	m_nNumMixers = ::mixerGetNumDevs();

	this->m_hMixer = NULL;
	::ZeroMemory(&m_mxcaps, sizeof(MIXERCAPS));

	m_strDstLineName.Empty();
	m_strMuteControlName.Empty();
	m_dwMuteControlID = 0;

	// open the first mixer
	// A "mapper" for audio mixer devices does not currently exist.
	if (m_nNumMixers != 0)
	{
		if (::mixerOpen(&this->m_hMixer,
						0,
						NULL,
						NULL,
						MIXER_OBJECTF_MIXER | CALLBACK_WINDOW)
			!= MMSYSERR_NOERROR)
		{
			return FALSE;
		}

		if (::mixerGetDevCaps(reinterpret_cast<UINT>(this->m_hMixer),
							  &m_mxcaps, sizeof(MIXERCAPS))
			!= MMSYSERR_NOERROR)
		{
			return FALSE;
		}
	}

	return TRUE;
}

BOOL CVolumeControl::amdUninitialize()
{
	BOOL bSucc = TRUE;

	if (this->m_hMixer != NULL)
	{
		bSucc = (::mixerClose(this->m_hMixer) == MMSYSERR_NOERROR);
		m_hMixer = NULL;
	}

	return bSucc;
}

BOOL CVolumeControl::amdGetMasterMuteControl()
{
	if (this->m_hMixer == NULL)
	{
		return FALSE;
	}

	// get dwLineID
	MIXERLINE mxl;
	mxl.cbStruct = sizeof(MIXERLINE);
	mxl.dwComponentType = MIXERLINE_COMPONENTTYPE_DST_SPEAKERS;
	if (::mixerGetLineInfo(reinterpret_cast<HMIXEROBJ>(this->m_hMixer),
						   &mxl,
						   MIXER_OBJECTF_HMIXER |
						   MIXER_GETLINEINFOF_COMPONENTTYPE)
		!= MMSYSERR_NOERROR)
	{
		return FALSE;
	}

	// get dwControlID
	MIXERCONTROL mxc;
	MIXERLINECONTROLS mxlc;
	mxlc.cbStruct = sizeof(MIXERLINECONTROLS);
	mxlc.dwLineID = mxl.dwLineID;
	mxlc.dwControlType = MIXERCONTROL_CONTROLTYPE_MUTE;
	mxlc.cControls = 1;
	mxlc.cbmxctrl = sizeof(MIXERCONTROL);
	mxlc.pamxctrl = &mxc;
	if (::mixerGetLineControls(reinterpret_cast<HMIXEROBJ>(this->m_hMixer),
							   &mxlc,
							   MIXER_OBJECTF_HMIXER |
							   MIXER_GETLINECONTROLSF_ONEBYTYPE)
		!= MMSYSERR_NOERROR)
	{
		return FALSE;
	}

	// store dwControlID
	m_strDstLineName = mxl.szName;
	m_strMuteControlName = mxc.szName;
	m_dwMuteControlID = mxc.dwControlID;

	return TRUE;
}

BOOL CVolumeControl::amdGetMasterMuteValue(LONG &lVal) const
{
	if (this->m_hMixer == NULL)
	{
		return FALSE;
	}

	MIXERCONTROLDETAILS_BOOLEAN mxcdMute;
	MIXERCONTROLDETAILS mxcd;
	mxcd.cbStruct = sizeof(MIXERCONTROLDETAILS);
	mxcd.dwControlID = m_dwMuteControlID;
	mxcd.cChannels = 1;
	mxcd.cMultipleItems = 0;
	mxcd.cbDetails = sizeof(MIXERCONTROLDETAILS_BOOLEAN);
	mxcd.paDetails = &mxcdMute;
	if (::mixerGetControlDetails(reinterpret_cast<HMIXEROBJ>(this->m_hMixer),
								 &mxcd,
								 MIXER_OBJECTF_HMIXER |
								 MIXER_GETCONTROLDETAILSF_VALUE)
		!= MMSYSERR_NOERROR)
	{
		return FALSE;
	}
	
	lVal = mxcdMute.fValue;

	return TRUE;
}

BOOL CVolumeControl::amdSetMasterMuteValue(LONG lVal) const
{
	if (this->m_hMixer == NULL)
	{
		return FALSE;
	}

	MIXERCONTROLDETAILS_BOOLEAN mxcdMute = { lVal };
	MIXERCONTROLDETAILS mxcd;
	mxcd.cbStruct = sizeof(MIXERCONTROLDETAILS);
	mxcd.dwControlID = m_dwMuteControlID;
	mxcd.cChannels = 1;
	mxcd.cMultipleItems = 0;
	mxcd.cbDetails = sizeof(MIXERCONTROLDETAILS_BOOLEAN);
	mxcd.paDetails = &mxcdMute;
	if (::mixerSetControlDetails(reinterpret_cast<HMIXEROBJ>(this->m_hMixer),
								 &mxcd,
								 MIXER_OBJECTF_HMIXER |
								 MIXER_SETCONTROLDETAILSF_VALUE)
		!= MMSYSERR_NOERROR)
	{
		return FALSE;
	}
	
	return TRUE;
}

BOOL CVolumeControl::amdGetMasterVolumeControl()
{
	if (this->m_hMixer == NULL)
	{
		return FALSE;
	}

	// get dwLineID
	MIXERLINE mxl;
	mxl.cbStruct = sizeof(MIXERLINE);
	mxl.dwComponentType = MIXERLINE_COMPONENTTYPE_DST_SPEAKERS;
	if (::mixerGetLineInfo(reinterpret_cast<HMIXEROBJ>(this->m_hMixer),
						   &mxl,
						   MIXER_OBJECTF_HMIXER |
						   MIXER_GETLINEINFOF_COMPONENTTYPE)
		!= MMSYSERR_NOERROR)
	{
		return FALSE;
	}

	// get dwControlID
	MIXERCONTROL mxc;
	MIXERLINECONTROLS mxlc;
	mxlc.cbStruct = sizeof(MIXERLINECONTROLS);
	mxlc.dwLineID = mxl.dwLineID;
	mxlc.dwControlType = MIXERCONTROL_CONTROLTYPE_VOLUME;
	mxlc.cControls = 1;
	mxlc.cbmxctrl = sizeof(MIXERCONTROL);
	mxlc.pamxctrl = &mxc;
	if (::mixerGetLineControls(reinterpret_cast<HMIXEROBJ>(this->m_hMixer),
							   &mxlc,
							   MIXER_OBJECTF_HMIXER |
							   MIXER_GETLINECONTROLSF_ONEBYTYPE)
		!= MMSYSERR_NOERROR)
	{
		return FALSE;
	}

	// store dwControlID
	m_strDstLineName = mxl.szName;
	m_strVolumeControlName = mxc.szName;
	//m_dwMinimum = mxc.Bounds.dwMinimum;
	//m_dwMaximum = mxc.Bounds.dwMaximum;
	m_dwVolumeControlID = mxc.dwControlID;

	return TRUE;
}

BOOL CVolumeControl::amdGetMasterVolumeValue(DWORD &dwVal) const
{
	if (this->m_hMixer == NULL)
	{
		return FALSE;
	}

	MIXERCONTROLDETAILS_UNSIGNED mxcdVolume;
	MIXERCONTROLDETAILS mxcd;
	mxcd.cbStruct = sizeof(MIXERCONTROLDETAILS);
	mxcd.dwControlID = m_dwVolumeControlID;
	mxcd.cChannels = 1;
	mxcd.cMultipleItems = 0;
	mxcd.cbDetails = sizeof(MIXERCONTROLDETAILS_UNSIGNED);
	mxcd.paDetails = &mxcdVolume;
	if (::mixerGetControlDetails(reinterpret_cast<HMIXEROBJ>(this->m_hMixer),
								 &mxcd,
								 MIXER_OBJECTF_HMIXER |
								 MIXER_GETCONTROLDETAILSF_VALUE)
		!= MMSYSERR_NOERROR)
	{
		return FALSE;
	}
	
	dwVal = mxcdVolume.dwValue;

	return TRUE;
}

BOOL CVolumeControl::amdSetMasterVolumeValue(DWORD dwVal) const
{
	if (this->m_hMixer == NULL)
	{
		return FALSE;
	}

	MIXERCONTROLDETAILS_UNSIGNED mxcdVolume = { dwVal };
	MIXERCONTROLDETAILS mxcd;
	mxcd.cbStruct = sizeof(MIXERCONTROLDETAILS);
	mxcd.dwControlID = m_dwVolumeControlID;
	mxcd.cChannels = 1;
	mxcd.cMultipleItems = 0;
	mxcd.cbDetails = sizeof(MIXERCONTROLDETAILS_UNSIGNED);
	mxcd.paDetails = &mxcdVolume;
	if (::mixerSetControlDetails(reinterpret_cast<HMIXEROBJ>(this->m_hMixer),
								 &mxcd,
								 MIXER_OBJECTF_HMIXER |
								 MIXER_SETCONTROLDETAILSF_VALUE)
		!= MMSYSERR_NOERROR)
	{
		return FALSE;
	}
	
	return TRUE;
}
