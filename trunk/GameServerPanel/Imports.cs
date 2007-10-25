// Copyright 2005 Google Inc.
// Imagine Interactive - Benjamin Schirmer
// All Rights Reserved.

using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using System.Windows.Forms;
using Microsoft.Win32;
using System.Text;
using ShellExt; 
using Common;

namespace GameserverPanel {
  #region Imported structures

  [ComVisible(false)]
  public struct PROPPAGEINFO {
    public UInt32 cb;
    public IntPtr szTitle;
    public Size size;
    public IntPtr szDocString;
    public IntPtr szHelpFile;
    public UInt32 dwHelpContext;
  };

  [ComVisible(false)]
  public struct CAUUID {
    UInt32 cElems;
    IntPtr pElems;

    public void SetPages(Guid[] thePages) {
      cElems = (UInt32)thePages.Length;
      pElems = Marshal.AllocCoTaskMem((int)(cElems * 16));

      int pos = 0;
      for (UInt32 i = 0; i < cElems; ++i) {
        Byte[] b = thePages[i].ToByteArray();
        for (int j = 0; j < 16; ++j, ++pos) {
          Marshal.WriteByte(pElems, pos, b[j]);
        }
      }
    }
  };

	//Static methods to add Menu Items for QueryContextMenu implementations
	public class MenuHelper
	{
		[DllImport("kernel32.dll")]
		public static extern int GetLastError(); 

		[DllImport("user32")]
		internal static extern int InsertMenuItem(uint hmenu, uint uposition,
			uint uflags, ref MENUITEMINFO mii);

		[DllImport("user32")]
		internal static extern int SetMenuItemInfo(uint hMenu, uint uItem, uint fByPosition, 
			ref MENUITEMINFO mii);

		[DllImport("user32")]
		internal static extern int GetMenuItemInfo(uint hMenu, uint uItem, uint fByPosition,
			ref MENUITEMINFO mii);

		[DllImport("user32")]
		internal static extern long CheckMenuItem(uint hMenu, uint uIDCheckItem, uint uCheck);



		//add a separator to the menu
		public static void AddSeparator(uint hMenu, uint position)
		{
			// Add a separator
			MENUITEMINFO sep = new MENUITEMINFO();
			sep.cbSize = 48;
			sep.fMask = (uint )MIIM.TYPE;
			sep.fType = (uint) MF.SEPARATOR;
			MenuHelper.InsertMenuItem(hMenu, position, 1, ref sep);
		}

		//add a menu item
        public static void AddMenuItem(uint hMenu, string text, int id, uint position, bool active)
        {
            AddMenuItem(hMenu, text, id, position, active, false);
        }

		public static void AddMenuItem(uint hMenu, string text, int id, uint
			position, bool active, bool bold)
		{
			MENUITEMINFO mii = new MENUITEMINFO();
			mii.cbSize = 48;
			mii.wID = id;

			mii.fMask = (uint)MIIM.ID | (uint)MIIM.TYPE | (uint)MIIM.STATE;
			mii.fType = (uint)MF.STRING;

			mii.dwTypeData  = text;
			mii.fState = (uint)MF.ENABLED;
			if (!active)
				mii.fState = mii.fState | (uint)MF.DISABLED | (uint)MF.GRAYED;
            if (bold)
                mii.fState = mii.fState | (uint)MF.DEFAULT;
			MenuHelper.InsertMenuItem(hMenu, position, 1, ref mii);
		}

		//check/unchecked state
		public static void MenuItemCheck(uint hMenu, uint position, bool ischecked)
		{
			CheckMenuItem(hMenu, position, (uint) MF.BYPOSITION | (uint) MF.CHECKED);
		}
	} 

  #endregion

  #region Imported interfaces

	// IContextMenu
	[ComImport(), InterfaceType(ComInterfaceType.InterfaceIsIUnknown),
	GuidAttribute("000214e4-0000-0000-c000-000000000046")]
	public  interface IContextMenu
	{
		// IContextMenu methods
		[PreserveSig()]
		int QueryContextMenu(uint hmenu, uint iMenu, int idCmdFirst, int
			idCmdLast, uint uFlags);
		[PreserveSig()]
		void    InvokeCommand (IntPtr pici);
		[PreserveSig()]
		void    GetCommandString(int idcmd, uint uflags, int reserved,
			StringBuilder commandstring, int cch);

	}

  // IUnknown
  [ComImport]
  [Guid("00000000-0000-0000-C000-000000000046")]
  [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IUnknown {
    void QueryInterface([MarshalAs(UnmanagedType.IUnknown)] out Object obj);
    [PreserveSig]
    UInt32 AddRef();
    [PreserveSig]
    UInt32 Release();
  };

  // ISpecifyPropertyPages
  [ComImport]
  [Guid("B196B28B-BAB4-101A-B69C-00AA00341D07")]
  [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface ISpecifyPropertyPages {
    void GetPages(ref CAUUID pages);
  };

  // IPropertyPageSite
  [ComImport]
  [Guid("B196B28C-BAB4-101A-B69C-00AA00341D07")]
  [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IPropertyPageSite {
    void OnStatusChange (UInt32 dwFlags);
    void GetLocaleID (out UInt32 LocaleID);
    void GetPageContainer ([MarshalAs(UnmanagedType.IUnknown)] out Object objs);
    [PreserveSig]
    UInt32 TranslateAccelerator(ref Message msg);
  };

  // IPropertyPage
  [ComImport]
  [Guid("B196B28D-BAB4-101A-B69C-00AA00341D07")]
  [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IPropertyPage {
    void SetPageSite(IPropertyPageSite site);
    void Activate(IntPtr wndParent, ref Rectangle rect, bool modal);
    void Deactivate();
    void GetPageInfo(ref PROPPAGEINFO info);
    void SetObjects(UInt32 count, [MarshalAs(UnmanagedType.LPArray,
      ArraySubType = UnmanagedType.IUnknown, SizeParamIndex=0)] Object[] objs);
    void Show(UInt32 cmdShow);
    void Move(ref Rectangle rect);
    [PreserveSig]
    UInt32 IsPageDirty();
    void Apply();
    void Help([MarshalAs(UnmanagedType.LPWStr)] ref String helpDir);
    [PreserveSig]
    UInt32 TranslateAccelerator(ref Message msg);
  };

  // IPersistStreamInit
  [ComImport]
  [Guid("7FD52380-4E07-101B-AE2D-08002B2EC713")]
  [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IPersistStreamInit {
    void GetClassID(out Guid classId);
    [PreserveSig]
    UInt32 IsDirty();
    void Load(UCOMIStream stm);
    void Save(UCOMIStream stm, bool clearDirty);
    ulong GetSizeMax();
    void InitNew();
  };

  // IObjectWithSite
  [ComImport]
  [Guid("FC4801A3-2BA9-11CF-A229-00AA003D7352")]
  [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IObjectWithSite {
    void SetSite([MarshalAs(UnmanagedType.IUnknown)] Object site);
    void GetPageContainer([MarshalAs(UnmanagedType.IUnknown)] out Object site);    
  };

  // IPropertyNotifySink
  [ComImport]
  [Guid("9BFBBC02-EFF1-101A-84ED-00AA00341D07")]
  [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  public interface IPropertyNotifySink {
    [PreserveSig]
    int OnChanged(int dispId);
    [PreserveSig]
    int OnRequestEdit(int dispId);
  }

  [Guid("6d5140c1-7436-11ce-8034-00aa006009fa"),
  InterfaceType( ComInterfaceType.InterfaceIsIUnknown )]
  public interface IServiceProvider
  {
    [PreserveSig]
    int QueryService(
    [In, MarshalAs(UnmanagedType.LPStruct)] Guid guidService,
    [In, MarshalAs(UnmanagedType.LPStruct)] Guid riid,
    [Out, MarshalAs(UnmanagedType.IUnknown) ] out object
    ppvObject
    );
  } 

  #endregion
}
