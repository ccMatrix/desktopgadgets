// *********************************************************************************
// Title:		ShellExtLib.cs
// Description:	ShellExtension interfaces
// *********************************************************************************


using System;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;

namespace ShellExt
{
	// Make these constants 
	public enum MIIM : uint
	{
		STATE =			0x00000001,
		ID =	        0x00000002,
		SUBMENU	=		0x00000004,
		CHECKMARKS =	0x00000008,
		TYPE =			0x00000010,
		DATA =			0x00000020,
		STRING =		0x00000040,
		BITMAP =		0x00000080,
		FTYPE =			0x00000100
	}

	
	public enum	MF : uint
	{
		INSERT =        0x00000000,
		CHANGE =        0x00000080,
		APPEND =        0x00000100,
		DELETE =        0x00000200,
		REMOVE =        0x00001000,
		BYCOMMAND =     0x00000000,
		BYPOSITION =    0x00000400,
		SEPARATOR =     0x00000800,
		ENABLED =       0x00000000,
		GRAYED =        0x00000001,
		DISABLED =      0x00000002,
		UNCHECKED =     0x00000000,
		CHECKED =       0x00000008,
		USECHECKBITMAPS=0x00000200,
		STRING =        0x00000000,
		BITMAP =        0x00000004,
		OWNERDRAW =     0x00000100,
		POPUP =         0x00000010,
		MENUBARBREAK =  0x00000020,
		MENUBREAK =     0x00000040,
		UNHILITE =      0x00000000,
		HILITE =        0x00000080,
		DEFAULT =       0x00001000,
		SYSMENU =       0x00002000,
		HELP =          0x00004000,
		RIGHTJUSTIFY =  0x00004000,
		MOUSESELECT =   0x00008000
	}

	public enum MFS : uint
	{
		GRAYED =        0x00000003,
		DISABLED =      MFS.GRAYED,
		CHECKED =       MF.CHECKED,
		HILITE =        MF.HILITE,
		ENABLED =       MF.ENABLED,
		UNCHECKED =     MF.UNCHECKED,
		UNHILITE =      MF.UNHILITE,
		DEFAULT =       MF.DEFAULT,
		MASK =          0x0000108B,
		HOTTRACKDRAWN = 0x10000000,
		CACHEDBMP =     0x20000000,
		BOTTOMGAPDROP = 0x40000000,
		TOPGAPDROP =    0x80000000,
		GAPDROP =       0xC0000000
	}

	public enum CMF: uint
	{
		CMF_NORMAL		= 0x00000000,
		CMF_DEFAULTONLY	= 0x00000001,
		CMF_VERBSONLY	= 0x00000002,
		CMF_EXPLORE		= 0x00000004,
		CMF_NOVERBS		= 0x00000008,
		CMF_CANRENAME	= 0x00000010,
		CMF_NODEFAULT	= 0x00000020,
		CMF_INCLUDESTATIC= 0x00000040,
		CMF_RESERVED	= 0xffff0000      // View specific
	}

	// GetCommandString uFlags
	public enum GCS: uint
	{
		VERBA =			0x00000000,     // canonical verb
		HELPTEXTA =		0x00000001,     // help text (for status bar)
		VALIDATEA =		0x00000002,     // validate command exists
		VERBW =			0x00000004,     // canonical verb (unicode)
		HELPTEXTW =		0x00000005,     // help text (unicode version)
		VALIDATEW =		0x00000006,     // validate command exists (unicode)
		UNICODE =		0x00000004,     // for bit testing - Unicode string
		VERB =			GCS.VERBA,
		HELPTEXT =		GCS.HELPTEXTA,
		VALIDATE =		GCS.VALIDATEA
	}

	public struct MenuItem
	{
		public string Text;
		public string Command;
		public string HelpText;
	}
	
	[StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
	public struct INVOKECOMMANDINFO
	{
		//NOTE: When SEE_MASK_HMONITOR is set, hIcon is treated as hMonitor
		public uint cbSize;						// sizeof(CMINVOKECOMMANDINFO)
		public uint fMask;						// any combination of CMIC_MASK_*
		public uint wnd;						// might be NULL (indicating no owner window)
		public int verb;
		[MarshalAs(UnmanagedType.LPStr)]
		public string parameters;				// might be NULL (indicating no parameter)
		[MarshalAs(UnmanagedType.LPStr)]
		public string directory;				// might be NULL (indicating no specific directory)
		public int Show;						// one of SW_ values for ShowWindow() API
		public uint HotKey;
		public uint hIcon;
	}

}