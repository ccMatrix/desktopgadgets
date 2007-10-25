using System;
using System.Drawing;
using System.Collections;
using System.Reflection;
using System.Threading;
using System.ComponentModel;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using System.Windows.Forms;
using System.Xml;
using System.Globalization;
using System.Diagnostics;
using GoogleDesktopAPILib;
using GoogleDesktopDisplayLib;
using Microsoft.Win32;
using System.Text;
using ShellExt;
using Common;

namespace GameserverPanel 
{
	#region Classes and Struct Imports

	/// <summary>
	/// This class is used as a wrapper to access the ImageConverter class and convert
	/// a bitmap to an IPicture
	/// </summary>
	public class ImageConverter: System.Windows.Forms.AxHost 
	{
		public ImageConverter():base("59EE46BA-677D-4d20-BF10-8D8067CB8B33") 
		{
		}
		public static stdole.IPicture ImageToIpicture(System.Drawing.Image image) 
		{
			return (stdole.IPicture) ImageConverter.GetIPictureFromPicture(image);
		}
		public static System.Drawing.Image IpictureToImage(stdole.IPicture ipicture) 
		{
			return (System.Drawing.Image) ImageConverter.GetPictureFromIPicture(ipicture);
		}
	}

	public class Log
	{
		FileStream fs;
		String logfile = @"\GameserverDebug.log";

		public void createLog() 
		{
            this.logfile = System.IO.Path.GetTempPath() + "\\GameserverDebug.log";
			this.fs = new FileStream(this.logfile, FileMode.Truncate);
			this.fs.Close();
		}

		public static void newLog()
		{
			Log l = new Log();
			l.createLog();
		}

        public void logWrite(String s)
        {
            this.logfile = System.IO.Path.GetTempPath() + "\\GameserverDebug.log";
            this.fs = new FileStream(this.logfile, FileMode.OpenOrCreate);
            this.fs.Seek(0, SeekOrigin.End);
            this.fs.WriteByte(10);

			s = DateTime.Now.ToString()+" "+s;

            byte[] b = new byte[s.Length];
            for (int i=0; i<s.Length; i++)
            {
                b[i] = (byte)s[i];
            }
            this.fs.Write(b , 0, b.Length);
            this.fs.Close();
        }

        public static void Error(String s)
        {
            Log l = new Log();
            l.logWrite("Error: "+s);
        }

        public static void Debug(String s)
        {
            Log l = new Log();
            l.logWrite("Debug: "+s);
        }
    }

	[StructLayout(LayoutKind.Sequential)]
	public struct SHFILEINFO
	{
		public IntPtr hIcon;
		public IntPtr iIcon;
		public uint dwAttributes;
		[MarshalAs(UnmanagedType.ByValTStr, SizeConst = 260)]
		public string szDisplayName;
		[MarshalAs(UnmanagedType.ByValTStr, SizeConst = 80)]
		public string szTypeName;
	};

	class Win32
	{
		public const uint SHGFI_ICON = 0x100;
		public const uint SHGFI_LARGEICON = 0x0; // Large icon
		public const uint SHGFI_SMALLICON = 0x1; // Small icon
		public const uint SHGFI_OPENICON = 0x2;  // get open icon
		public const uint SHGFI_SHELLICONSIZE = 0x4;  // get shell size icon 
		public const uint WM_QUIT = 18;
		public const uint WM_CLOSE = 16;
		public const int PICTYPE_UNINITIALIZED = -1;
		public const int PICTYPE_NONE = 0;
		public const int PICTYPE_BITMAP = 1;
		public const int PICTYPE_METAFILE = 2;
		public const int PICTYPE_ICON = 3;
		public const int PICTYPE_ENHMETAFILE = 4;

		public const int FO_MOVE = 1;
		public const int FO_COPY = 2;
		public const int FO_DELETE = 3;
		public const int FO_RENAME = 4;
		public const int FOF_MULTIDESTFILES = 0x0001;
		public const int FOF_SILENT =  0x0004;
		public const int FOF_RENAMEONCOLLISION =  0x0008;
		public const int FOF_NOCONFIRMATION =  0x0010;
		public const int FOF_WANTMAPPINGHANDLE =  0x0020;
		public const int FOF_ALLOWUNDO = 0x0040;
		public const int FOF_FILESONLY = 0x0080;
		public const int FOF_SIMPLEPROGRESS = 0x0100;
		public const int FOF_NOCONFIRMMKDIR = 0x0200; 
        public const int SEE_MASK_INVOKEIDLIST = 0xC; 

		[DllImport("shell32.dll")]
		public static extern IntPtr SHGetFileInfo(string pszPath, uint dwFileAttributes, ref SHFILEINFO psfi, uint cbSizeFileInfo, uint uFlags);

		// Copies, moves, renames, or deletes a file system object. 
		[DllImport("shell32.dll" , CharSet = CharSet.Unicode)]
		public static extern Int32 SHFileOperation(
			ref SHFILEOPSTRUCT lpFileOp);       // Address of an SHFILEOPSTRUCT 
		// structure that contains information this function needs 
		// to carry out the specified operation. This parameter must 
		// contain a valid value that is not NULL. You are 
		// responsibile for validating the value. If you do not 
		// validate it, you will experience unexpected results. 

        [DllImport("User32.dll", CharSet=CharSet.Auto)]
        public static extern bool DestroyIcon(IntPtr hIcon); 

		/* Struktur zur Definition der Dateioperation */
		[StructLayout(LayoutKind.Sequential, CharSet=CharSet.Auto)]
		public struct SHFILEOPSTRUCT
	    {
		    public IntPtr hwnd; 
			public int wFunc;
			public String pFrom;
			public String pTo;
			public short fFlags; 
			[MarshalAs(UnmanagedType.Bool)]    
			public bool fAnyOperationsAborted; 
			public IntPtr hNameMappings; 
			public String lpszProgressTitle; 
	    }

        [StructLayout(LayoutKind.Explicit)]
            public struct DUMMYUNIONNAME
        {
            [FieldOffset(0)]
            public IntPtr hIcon;
            [FieldOffset(0)]
            public IntPtr hMonitor;
        }
        [StructLayout(LayoutKind.Sequential)]
            public  struct SHELLEXECUTEINFO
        {
            public int  cbSize;
            public int  fMask;
            public IntPtr  hwnd;
            public string  lpVerb;
            public string  lpFile;
            public string  lpParameters;
            public string  lpDirectory;
            public int  nShow;
            public IntPtr  hInstApp;
            public int  lpIDList;
            public string  lpClass;
            public int  hkeyClass;
            public int  dwHotKey;
            public DUMMYUNIONNAME dun;
            public IntPtr  hProcess;
        }
        [DllImport("shell32.dll")]
        public  static extern bool  ShellExecuteEx(ref SHELLEXECUTEINFO si);

		public static String formatSize(long size) 
		{
			if (size > (1024*1024*1024))
				return ""+Math.Round( (double)size/(1024*1024*1024), 2)+" GB";
			if (size > (1024*1024))
				return ""+Math.Round( (double)size/(1024*1024), 2)+" MB";
			if (size > 1024)
				return ""+Math.Round( (double)size/1024, 2)+" KB";
			return size+" Bytes";
		}

    }

    /// <summary>
    /// Summary description for InputBox.
    /// </summary>
    public class InputBox : System.Windows.Forms.Form
    {
        private System.Windows.Forms.Label txtLabel;
        private System.Windows.Forms.Button cmdOK;
        private System.Windows.Forms.Button cmdCancel;
        private System.Windows.Forms.TextBox txtInput;
        private String caption;
        private String question;
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.Container components = null;
        public InputBox(String c, String q, String d)
        {
            caption = c;
            question = q;
            //
            // Required for Windows Form Designer support
            //
            InitializeComponent();
            txtInput.Text = d;
        }
        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        protected override void Dispose( bool disposing )
        {
            if( disposing )
            {
                if(components != null)
                {
                    components.Dispose();
                }
            }
            base.Dispose( disposing );
        }
        #region Windows Form Designer generated code
        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.txtLabel = new System.Windows.Forms.Label();
            this.txtInput = new System.Windows.Forms.TextBox();
            this.cmdOK = new System.Windows.Forms.Button();
            this.cmdCancel = new System.Windows.Forms.Button();
            this.SuspendLayout();
            //
            // txtlabel
            //
            this.txtLabel.Text = this.question;
            this.txtLabel.Location = new System.Drawing.Point(16, 8);
            this.txtLabel.Size = new System.Drawing.Size(248, 20);
            //
            // txtInput
            //
            this.txtInput.Location = new System.Drawing.Point(16, 28);
            this.txtInput.Name = "txtInput";
            this.txtInput.Size = new System.Drawing.Size(248, 20);
            this.txtInput.TabIndex = 0;
            this.txtInput.Text = "";
            //
            // cmdOK
            //
            this.cmdOK.Location = new System.Drawing.Point(156, 50);
            this.cmdOK.Name = "cmdOK";
            this.cmdOK.Size = new System.Drawing.Size(53, 25);
            this.cmdOK.TabIndex = 1;
            this.cmdOK.Text = "OK";
            this.cmdOK.Click += new System.EventHandler(this.cmdOK_Click);
            //
            // cmdCancel
            //
            this.cmdCancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.cmdCancel.Location = new System.Drawing.Point(211, 50);
            this.cmdCancel.Name = "cmdCancel";
            this.cmdCancel.Size = new System.Drawing.Size(53, 25);
            this.cmdCancel.TabIndex = 2;
            this.cmdCancel.Text = "Cancel";
            this.cmdCancel.Click += new System.EventHandler(this.cmdCancel_Click);
            //
            // InputBox
            //
            this.AcceptButton = this.cmdOK;
            this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
            this.CancelButton = this.cmdCancel;
            this.ClientSize = new System.Drawing.Size(272,80);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Controls.AddRange(new System.Windows.Forms.Control[] {
                                                                          this.txtLabel,
                                                                          this.cmdCancel,
                                                                          this.cmdOK,
                                                                          this.txtInput});
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "InputBox";
            this.Text = this.caption;
            this.Load += new System.EventHandler(this.InputBox_Load);
            this.ResumeLayout(false);
        }

        #endregion

        private void cmdOK_Click(object sender, System.EventArgs e)
        {
            DialogResult = DialogResult.OK;
        }

        private void cmdCancel_Click(object sender, System.EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
        }

        private void InputBox_Load(object sender, System.EventArgs e)
        {
        }

        public string Input
        {
            get
            {
                return txtInput.Text;
            }
        }
    } 

	#endregion

    #region GameserverContentItem Class

	/// <summary>
	/// This class manages each content item shown in the plugin. Each content item
	/// holds the data displayed and handles the events such as user click, opening
	/// item details, deleting the item etc.
	/// </summary>
	public class GameserverContentItem : 
		GoogleDesktopDisplayContentItemHelperClass,
        IGoogleDesktopDisplayContentItemHandler,
		IContextMenu
	{

		#region IGoogleDesktopDisplayContentItemHandler Members
 
		/// <summary>
		/// Called when the user opens the item by double-clicking it
		/// Opens the Folder in Explorer
		/// </summary>
		public void OpenItem()
		{
            Log.Debug("OpenItem Called");
            GameserverPlugin ctl = ((GameserverPlugin)open_command);
            if (ctl == null) return;

			if (this.snippet == "MESSAGE")
			{
				formServer newServer = new formServer(0);
				newServer.dataObject = ctl;
				newServer.ShowDialog();

				ctl.refresh(null);
			}
			else 
			{
				DialogResult res;
				String[] cmd = this.snippet.Split('|');
				Log.Debug("Snippet Splitted");
				String serverName=this.heading;
				int queryPort = Int32.Parse(cmd[4]);
				String[] serverData = ctl.queryServer(cmd[3], cmd[1], queryPort);
				Log.Debug("Server Queried");
				if (serverData.Length > 3) 
				{
					serverName = serverData[2];
					this.source = serverData[6]+","+serverData[5]+","+serverData[4];
				}
				String[] data = this.source.Split(',');
				Log.Debug("Connecting to "+this.snippet+" -> "+this.source);
				if (this.source == "0,0,0") 
				{
					res = MessageBox.Show( String.Format( ctl.lang.getValue("connectOffline"), serverName), "GameServer", MessageBoxButtons.YesNo);
					if (res == DialogResult.No) 
					{
						return;
					}
				}
				else if (data[1] == data[2]) 
				{
					res = MessageBox.Show( String.Format( ctl.lang.getValue("connectFull"), serverName), "GameServer", MessageBoxButtons.YesNo);
					if (res == DialogResult.No) 
					{
						return;
					}
				}
				else 
				{
					res = MessageBox.Show( String.Format( ctl.lang.getValue("connectAsk"), serverName), "GameServer", MessageBoxButtons.YesNo);
					if (res == DialogResult.No) 
					{
						return;
					}
				}
            
				ctl.joinServer(cmd[0], cmd[1], Int32.Parse(cmd[2]));
			}
		}

		/// <summary>
		/// Called when the user tries to view the details view of this item. We can
		/// create an activex control which shows the details view content, or use the
		/// details view helper. If we dont want to show the details view return true.
		/// </summary>
		/// <param name="title">title for the details view</param>
		/// <param name="flags">flags specifying the features to include in the details view</param>
		/// <param name="detailsControl">store the details view activex control here</param>
		/// <returns>true if details view should be cancelled, false if not</returns>
        public new bool OnDetailsView(out string title,
            out GoogleDesktopDisplayDetailsViewFlags flags, out object detailsControl)
		{
			// Here we can create any ActiveX control for displaying the details, and 
			// return it via the detailsControl parameter.  We choose the 
			// 'GoogleDesktopDisplayDetailsViewHelper' control that will give us a 
			// UI that's inline with how the sidebar looks.
			// Well actually the Example used GoogleDesktopDisplayDetailsViewHelper but 
			// we use a standard panel which is then filled by the standard components.

			GameserverPlugin ctl = ((GameserverPlugin)open_command);

			if (this.snippet == "MESSAGE")
			{
				formServer newServer = new formServer(0);
				newServer.dataObject = ctl;
				newServer.ShowDialog();

				ctl.refresh(null);

				detailsControl = open_command;
				title = heading;
				flags = GoogleDesktopDisplayDetailsViewFlags.GDD_DETAILS_VIEW_FLAG_TOOLBAR_OPEN;

				return true; // return false to show details view, true to cancel it.
			}
            RegistryKey key;
            String[] cmd = this.snippet.Split('|');
            String[] listData, listRules, listPlayers;

            int queryPort = Int32.Parse(cmd[4]);
            ctl.queryServerDetails(cmd[3], 
                                                                cmd[1], 
                                                                queryPort,
                                                                out listData,
                                                                out listRules,
                                                                out listPlayers
                                                               );

            System.Windows.Forms.Panel serverPanel;
            System.Windows.Forms.PictureBox serverPic;
            System.Windows.Forms.Label serverStats;
            System.Windows.Forms.ListView serverPlayers;
            System.Windows.Forms.Label serverMap;
            System.Windows.Forms.Label serverType;
            System.Windows.Forms.Label serverName;
            System.Windows.Forms.ColumnHeader columnID;
            System.Windows.Forms.TabControl tabControl1;
            System.Windows.Forms.TabPage tabPage1;
            System.Windows.Forms.TabPage tabPage2;
            System.Windows.Forms.ColumnHeader ruleName;
            System.Windows.Forms.ColumnHeader ruleValue;
            System.Windows.Forms.ListView serverRules;

            serverPanel = new System.Windows.Forms.Panel();
            serverPic = new System.Windows.Forms.PictureBox();
            serverStats = new System.Windows.Forms.Label();
            serverPlayers = new System.Windows.Forms.ListView();
            columnID = new System.Windows.Forms.ColumnHeader();
            serverMap = new System.Windows.Forms.Label();
            serverType = new System.Windows.Forms.Label();
            serverName = new System.Windows.Forms.Label();
            tabControl1 = new System.Windows.Forms.TabControl();
            tabPage1 = new System.Windows.Forms.TabPage();
            tabPage2 = new System.Windows.Forms.TabPage();
            serverRules = new System.Windows.Forms.ListView();
            ruleName = new System.Windows.Forms.ColumnHeader();
            ruleValue = new System.Windows.Forms.ColumnHeader();

            try
            {
                String[] snippetData = snippet.Split('|');
                // 
                // serverPanel
                // 
                serverPanel.BackColor = System.Drawing.Color.White;
                serverPanel.Controls.Add(serverPic);
                serverPanel.Controls.Add(serverStats);
                serverPanel.Controls.Add(tabControl1);
                serverPanel.Controls.Add(serverMap);
                serverPanel.Controls.Add(serverType);
                serverPanel.Controls.Add(serverName);
                serverPanel.Location = new System.Drawing.Point(4, 7);
                serverPanel.Name = "serverPanel";
                serverPanel.Size = new System.Drawing.Size(364, 352);
                serverPanel.TabIndex = 1;
                // 
                // tabControl1
                // 
                tabControl1.Controls.Add(tabPage1);
                tabControl1.Controls.Add(tabPage2);
                tabControl1.Location = new System.Drawing.Point(8, 96);
                tabControl1.Name = "tabControl1";
                tabControl1.SelectedIndex = 0;
                tabControl1.Size = new System.Drawing.Size(352, 232);
                tabControl1.TabIndex = 11;
                tabControl1.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Top | AnchorStyles.Bottom;
                // 
                // tabPage1
                // 
                tabPage1.Controls.Add(serverPlayers);
                tabPage1.Location = new System.Drawing.Point(4, 22);
                tabPage1.Name = "tabPlayers";
                tabPage1.Size = new System.Drawing.Size(344, 206);
                tabPage1.TabIndex = 0;
                tabPage1.Text = "Players";
                // 
                // tabPage2
                // 
                tabPage2.Controls.Add(serverRules);
                tabPage2.Location = new System.Drawing.Point(4, 22);
                tabPage2.Name = "tabRules";
                tabPage2.Size = new System.Drawing.Size(192, 74);
                tabPage2.TabIndex = 1;
                tabPage2.Text = "Rules";
                // 
                // serverPic
                // 
                serverPic.Location = new System.Drawing.Point(8, 8);
                serverPic.Name = "serverPic";
                serverPic.Size = new System.Drawing.Size(96, 88);
                serverPic.TabIndex = 10;
                serverPic.TabStop = false;
                // 
                // serverStats
                // 
                serverStats.BackColor = System.Drawing.Color.White;
                serverStats.Location = new System.Drawing.Point(108, 32);
                serverStats.Name = "serverStats";
                serverStats.Size = new System.Drawing.Size(200, 16);
                serverStats.TabIndex = 6;
                if (this.source == "0,0,0")
                {
                    serverStats.Text = ctl.lang.getValue("detailsOffline");
                    serverStats.ForeColor = Color.DarkRed;
                }
                else
                {
                    String[] stats = this.source.Split(',');
                    serverStats.Text = stats[0]+"ms ("+stats[1]+"/"+stats[2]+" Spieler)";

                    int ping = Int32.Parse(stats[0]);
                    if (ping < 80)
                        serverStats.ForeColor = Color.DarkGreen;
                    else if (ping < 100) 
                        serverStats.ForeColor = Color.Green;
                    else if (ping < 150) 
                        serverStats.ForeColor = Color.Orange;
                    else if (ping < 200) 
                        serverStats.ForeColor = Color.DarkOrange;
                    else if (ping < 250) 
                        serverStats.ForeColor = Color.Red;
                    else 
                        serverStats.ForeColor = Color.DarkRed;
                
                }
                // 
                // serverPlayers
                // 
                serverPlayers.BackColor = System.Drawing.Color.White;
                serverPlayers.BorderStyle = System.Windows.Forms.BorderStyle.None;
                serverPlayers.Columns.Add(columnID);
                serverPlayers.FullRowSelect = true;
                serverPlayers.HeaderStyle = System.Windows.Forms.ColumnHeaderStyle.Nonclickable;
                serverPlayers.Location = new System.Drawing.Point(0, 0);
                serverPlayers.Name = "serverPlayers";
                serverPlayers.Size = new System.Drawing.Size(344, 208);
                serverPlayers.TabIndex = 9;
                serverPlayers.View = System.Windows.Forms.View.Details;
                serverPlayers.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Top | AnchorStyles.Bottom;
                // 
                // columnID
                // 
                columnID.Text = "#";
                columnID.Width = 25;
                // 
                key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Games\"+snippetData[0]);
                String[] columns = key.GetValue("columns").ToString().Split(',');
                key.Close();
                for (int i=0; i<columns.Length; i++)
                {
                    if (columns[i] != "-")
                    {
                        ColumnHeader head = new ColumnHeader();
                        head.Text = columns[i];
                        if (i == 0) head.Width = 200;
                        serverPlayers.Columns.Add(head);
                    }
                }
                // 
                // serverMap
                // 
                serverMap.BackColor = System.Drawing.Color.White;
                serverMap.Location = new System.Drawing.Point(108, 80);
                serverMap.Name = "serverMap";
                serverMap.Size = new System.Drawing.Size(200, 16);
                serverMap.TabIndex = 8;
                String map = "unknown";
                if (snippetData.Length >= 6)
                {
                    map = snippetData[5];
                }
                serverMap.Text = ctl.lang.getValue("detailsMap")+": "+map;
                // 
                // serverType
                // 
                serverType.BackColor = System.Drawing.Color.White;
                serverType.Location = new System.Drawing.Point(108, 56);
                serverType.Name = "serverType";
                serverType.Size = new System.Drawing.Size(200, 16);
                serverType.TabIndex = 7;
                serverType.Text = ctl.lang.getValue("detailsGame")+": "+snippetData[0];
                // 
                // serverName
                // 
                serverName.BackColor = System.Drawing.Color.White;
                serverName.Location = new System.Drawing.Point(108, 8);
                serverName.Name = "serverName";
                serverName.Size = new System.Drawing.Size(240, 16);
                serverName.TabIndex = 5;
                serverName.Text = this.heading + " " + cmd[1]+":"+cmd[2];
                // 
                // serverRules
                // 
                serverRules.BackColor = System.Drawing.Color.White;
                serverRules.BorderStyle = System.Windows.Forms.BorderStyle.None;
                serverRules.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
                                                                                              ruleName,
                                                                                              ruleValue});
                serverRules.FullRowSelect = true;
                serverRules.HeaderStyle = System.Windows.Forms.ColumnHeaderStyle.Nonclickable;
                serverRules.Location = new System.Drawing.Point(0, -1);
                serverRules.Name = "serverRules";
                serverRules.Size = new System.Drawing.Size(344, 208);
                serverRules.TabIndex = 11;
                serverRules.View = System.Windows.Forms.View.Details;
                serverRules.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Top | AnchorStyles.Bottom;
                // 
                // ruleName
                // 
                ruleName.Text = "Name";
                ruleName.Width = 100;
                // 
                // ruleValue
                // 
                ruleValue.Text = "Value";
                ruleValue.Width = 238;

                // Fill Players
                serverPlayers.Items.Clear();
                for (int i=0; i<listPlayers.Length; i++)
                {
                    try 
                    {
                        if (listPlayers[i] == null) continue;
                        String player = listPlayers[i].Trim();
                        if (player.Length > 0)
                        {
                            // MessageBox.Show("adding "+listPlayers[i]);
                            String[] playerData = player.Split(',');
                            ListViewItem listItem = serverPlayers.Items.Add((i+1).ToString()+".");
                            for (int c=0; c<columns.Length; c++)
                            {
                                if (columns[c] != "-")
                                    listItem.SubItems.Add( playerData[c] );
                            }
                        }  
                    }
                    catch (Exception E) 
                    {
                        Log.Error("Adding Player to DetailsView: "+E.Message);
                    }
                }

                // Fill Rules
                serverRules.Items.Clear();
                for (int i=0; i<listRules.Length; i++)
                {
                    try 
                    {
                        if (listRules[i] == null) continue;
                        String rule = listRules[i].Trim();
                        if (rule.Length > 0)
                        {
                            String[] ruleData = rule.Split('=');
                            ListViewItem listItem = serverRules.Items.Add(ruleData[0]);
                            listItem.SubItems.Add( ruleData[1] );
                        }  
                    }
                    catch (Exception E) 
                    {
                        Log.Error("Adding Rule to DetailsView: "+E.Message);
                    }
                }

                serverPic.Image = new Bitmap( serverPic.Width, serverPic.Height );
                Graphics g = Graphics.FromImage( serverPic.Image );
                String resource = "GameserverPanel.Resources."+cmd[0]+".ico";
                Stream resStream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resource);
                if (resStream != null) 
                {
                    g.DrawImage( new Icon(resStream, 16, 16).ToBitmap(), 0, 0, 64, 64);
                    g.Dispose();
                }
            }
            catch (Exception E) 
            {
                Log.Error("DetailsView: "+E.Message);
            }

			detailsControl = serverPanel;
			title = heading;
			flags = GoogleDesktopDisplayDetailsViewFlags.GDD_DETAILS_VIEW_FLAG_TOOLBAR_OPEN;

			return false; // return false to show details view, true to cancel it.
		}

        public new bool OnRemoveItem() 
        {
            // return true if you don't want the item to be removed/you manually handled the command
            // return false to let the default happen, which will remove the item automatically.
            return false; 
        }


        public void GetIsTooltipRequired(GoogleDesktopDisplayTarget target,
            Int32 dc,
            ref GoogleDesktopDisplayLib.tagRECT bounds, out bool isRequired)
        {
            isRequired = true;
        }

		public void DrawItem(GoogleDesktopDisplayTarget target,
			int dc,
			ref GoogleDesktopDisplayLib.tagRECT bounds)
		{
			//Log.Debug("Called DrawItem");
			//throw new NotImplementedException();
			Graphics g = Graphics.FromHdc((IntPtr)dc);

			Font font = null;
			Rectangle rc;
			Brush brush = null;
			IGoogleDesktopDisplayContentItem helper = (IGoogleDesktopDisplayContentItem)this;

			if (this.snippet == "MESSAGE")
			{
				g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;
				rc = new Rectangle(bounds.left, bounds.top,
					bounds.right - bounds.left, bounds.bottom-bounds.top );
				font = new Font("Tahoma", 8);
				brush = Brushes.Black;
				g.DrawString(heading, font, brush, rc);
				return;
			}
            if (target == GoogleDesktopDisplayTarget.GDD_TARGET_SIDEBAR)
            {

                int left = bounds.left;
                if (this.image != null) 
                {
                    g.DrawImage( ImageConverter.IpictureToImage(this.image), bounds.left, bounds.top, 16, 16 );
                    left += 16;
                }
                g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;
                rc = new Rectangle(left, bounds.top,
                    bounds.right - left, bounds.bottom-bounds.top-12 );
                font = new Font("Tahoma", 8);
                brush = Brushes.Black;
                g.DrawString(heading, font, brush, rc);

                rc = new Rectangle(left, bounds.top + 12,
                    bounds.right - left, bounds.bottom - bounds.top );
                String text;
                if (this.source == "0,0,0") 
                {
                    text = "Offline";
                    brush = Brushes.DarkRed;
                }
                else
                {
                    String[] data = this.source.Split( ((String)",").ToCharArray() );
                    text = ""+data[0]+"ms ("+data[1]+"/"+data[2]+")";
                    int ping = Int32.Parse(data[0]);
                    if (ping < 80)
                    {
                        brush = Brushes.DarkGreen;
                    }
                    else if (ping < 100) 
                    {
                        brush = Brushes.Green;
                    }
                    else if (ping < 150) 
                    {
                        brush = Brushes.Orange;
                    }
                    else if (ping < 200) 
                    {
                        brush = Brushes.DarkOrange;
                    }
                    else if (ping < 250) 
                    {
                        brush = Brushes.Red;
                    }
                    else 
                    {
                        brush = Brushes.DarkRed;
                    }
                }
                g.DrawString(text, font, brush, rc);
            }
            else if (target == GoogleDesktopDisplayTarget.GDD_TARGET_NOTIFIER)
            {
                g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;
                rc = new Rectangle(bounds.left, bounds.top,
                    bounds.right - bounds.left, bounds.bottom-bounds.top );
                font = new Font("Tahoma", 8);
                brush = Brushes.Black;
                g.DrawString(heading, font, brush, rc);
            }

			//Log.Debug("Executed DrawItem");
		}

		public int GetHeight(GoogleDesktopDisplayTarget displayTarget,
			Int32 dc, int width)
		{
            if (displayTarget == GoogleDesktopDisplayTarget.GDD_TARGET_NOTIFIER)
            {
                return 80;
            }
            else
            {
                return 28;
            }
		}

		public new void onGetIsTooltipRequired(GoogleDesktopDisplayTarget target,
			Int32 dc,
			ref GoogleDesktopDisplayLib.tagRECT bounds, out bool isRequired)
		{
			isRequired = true;
		}

		#endregion

		#region IContextMenu Members

		int IContextMenu.QueryContextMenu(uint hMenu, uint iMenu, int
			idCmdFirst, int idCmdLast, uint uFlags)
		{

			uint order = 0;
			int id = 0;

            GameserverPlugin ctl = (GameserverPlugin)open_command;

			if (this.snippet == "MESSAGE")
			{
				MenuHelper.AddMenuItem(hMenu, ctl.lang.getValue("menuNewServer"), ++id, order++, true, true);
			}
			else 
			{
				MenuHelper.AddMenuItem(hMenu, ctl.lang.getValue("menuConnect"), ++id, order++, true, true);			

				MenuHelper.AddSeparator(hMenu, order++);
            
				Object[] friends = ctl.getFriends();
				MenuHelper.AddMenuItem(hMenu, ctl.lang.getValue("menuInvite"), ++id, order++, friends.Length > 0);

				MenuHelper.AddSeparator(hMenu, order++);

				MenuHelper.AddMenuItem(hMenu, ctl.lang.getValue("menuRefresh"), ++id, order++, true);
			}
			return id;
		}

		//handler clicks
		void IContextMenu.InvokeCommand (IntPtr pici)
		{
			Type typINVOKECOMMANDINFO =
				Type.GetType("ShellExt.INVOKECOMMANDINFO");
			INVOKECOMMANDINFO ici =
				(INVOKECOMMANDINFO)Marshal.PtrToStructure(pici, typINVOKECOMMANDINFO);

            GameserverPlugin ctl = this.open_command as GameserverPlugin;

            Log.Debug("Item ContextMenu clicked: "+ici.verb);

			if (this.snippet == "MESSAGE")
			{
				switch (ici.verb) 
				{
					case 0: formServer newServer = new formServer(0);
							newServer.dataObject = ctl;
							newServer.ShowDialog();

							ctl.refresh(null);
							break;
				}
			}
			else 
			{
				switch (ici.verb) 
				{
					case 0: OpenItem();
						break;
					case 1: Object[] friends = ctl.getFriends();
						String[] cmd = this.snippet.Split('|');
						String game = cmd[0];
						String ip = cmd[1];
						int port = Int32.Parse(cmd[2]);
						friendList fList = new friendList(friends, game, ip, port);
						fList.dataObject = open_command;
						if (fList.ShowDialog() == DialogResult.OK)
						{
							for (int i=0; i<fList.friends.CheckedItems.Count; i++)
							{
								String line = fList.friends.CheckedItems[i].ToString();
								String friendId = line.Split('\n').GetValue(1).ToString();
								friendId = friendId.Trim();
								bool sideBar = line.Split('\n').GetValue(2).ToString().Equals("true");

								if (sideBar && !fList.labelSendText.Checked)
								{
									Log.Debug("Sending Data Invite to "+friendId);
									ctl.talk_service.SendTalkData(friendId, this.snippet);
								}
								else
								{
									Log.Debug("Sending Text Invite to "+friendId);
									String msg = String.Format(ctl.lang.getValue("talkInviteText"), game, ip, port);
									ctl.talk_service.SendTalkText(friendId, msg);
								}
							}
						}
						fList.Dispose();
						/*
						if (friend.has_sidebar)
						{
							ctl.talk_service.SendTalkData(friend.user_id, this.snippet);
						}
						else
						{
							String[] cmd = this.snippet.Split('|');
							String game = cmd[0];
							String ip = cmd[1];
							int port = Int32.Parse(cmd[2]);
							String msg = String.Format("Lust auf eine Runde {0} auf {1}:{2}?", game, ip, port);
							ctl.talk_service.SendTalkText(friend.user_id, msg);
						}
						MessageBox.Show("Einladung an "+friend.user_id+" gesendet");
						*/
						break;
					case 2: ctl.refresh(null);
						break;
				}
			}

		}

		void IContextMenu.GetCommandString(int idCmd, uint uFlags, int
			pwReserved, StringBuilder commandString, int cchMax)
		{
			//do nothing (for now)
		}

		#endregion

		#region Unhandled Members
		
		// We are not interested in the following members so always throw a not-implemented
		// exception to let default processing happen.
		public void ProcessDetailsViewFeedback(GoogleDesktopDisplayDetailsViewFlags flags)
		{
			throw new NotImplementedException();
		}

		public new void onToggleItemPinnedState()
		{
			throw new NotImplementedException();
		}


		public void ToggleItemPinnedState()
		{
		}

		#endregion

	}

    #endregion

    #region Gameserver Language Class

    public class GameserverLanguage {

        private String language = "en";
        private String lngfile;

        public GameserverLanguage() {
			Log.Debug("Called GameserverLanguage Constructor");
            try {
                RegistryKey key;
                key = Registry.LocalMachine.OpenSubKey(@"Software\Imagine Interactive\Gameserver Panel");
                String path = key.GetValue("langPath").ToString();

                String lang;
                key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Google\Google Desktop");
                lang = key.GetValue(@"ResourceDLL").ToString();
                lang = lang.Replace("GoogleDesktopResources_", "");
                lang = lang.Replace(".dll", "");
                lngfile = path+@"\"+lang+".ini";
                Log.Debug("LanguageFile: "+lngfile);
                FileInfo lngtest = new FileInfo(lngfile);
                if (lngtest.Exists) {
                    language = lang;
                }
                else 
                {
                    Log.Debug("Could not find Language "+lang);
                }
            }
            catch (Exception E) {
                Log.Error("Could not initialize GameserverLanguage correctly: "+E.Message);
                language = "en";
            }
			Log.Debug("Executed GameserverLanugage Constructor");
        }

        [DllImport("kernel32", EntryPoint="GetPrivateProfileStringA",
             CharSet=CharSet.Ansi)]
        private static extern int GetPrivateProfileString(
            string sectionName,
            string keyName,
            string defaultValue,
            StringBuilder returnbuffer,
            Int32 bufferSize,
            string fileName); 

        public String getValue(String keyName)
        {
			Log.Debug("Called readLng on GameserverLanguage");
            StringBuilder buffer = new StringBuilder (256);
            String section = "language";
            String defaultValue = "untranslated";
            Int32 returnValue;

            returnValue = GetPrivateProfileString(section, keyName, defaultValue,
                buffer, 256, lngfile);

            return buffer.ToString();
        }
    }

    #endregion

    #region GameserverPlugin Class

	/// <summary>
	/// This is the actual plugin, which uses the helper object to do all the dirty work
	/// and only implements stuff related to creating/fetching the content to display
	/// in the plugin's area.
	/// </summary>
	[GuidAttribute("CC5ADB7E-28CE-4d66-AE61-5839AFF49A57")]
	public class GameserverPlugin : GoogleDesktopDisplayPluginHelperClass,
		IGoogleDesktopDisplayPluginHandler,
        IGoogleDesktopPluginTalkHandler,
		ISpecifyPropertyPages,
		IObjectWithSite,
		IPersistStreamInit,
		IContextMenu  
	{
		#region Variables and Strings 

		static String controlGuid = 
			"{CC5ADB7E-28CE-4d66-AE61-5839AFF49A57}";
		static String pluginName = "Gameserver";
		static String pluginDescription = "Gameserver Gadget";

		// The about dialog string consists of 3 lines, each shown in a different place
		// in the about dialog. Have a look at the about dialog of existing plugins for
		// an idea of how this works.
		String aboutStr;

		GoogleDesktopDisplayContentItemLayout contentLayout;
		// System.Windows.Forms.Timer timer;
        public GameserverLanguage lang;

		String displayGroup = null;

		IGoogleDesktopDisplaySite displaySite;
        public IGoogleDesktopPluginTalkService talk_service;
		const int dataVersion = 1;
		bool isDirty;

		String installPath = null;
		String qstatPath = null;

		int addItems = 0;

		public System.Windows.Forms.Timer timer;

		#endregion

		#region Plugin

		public GameserverPlugin() 
		{
		    Log.newLog();
			Log.Debug("Called Constructor");
            try {    

				lang = new GameserverLanguage();

                aboutStr = pluginName + "\r\n" +
                    pluginDescription + "\r\n\r\n" +
                    "© 2006 Imagine Interactive" + "\r\n" +
                    "Created by Benjamin Schirmer" + "\r\n\r\n" +
                    "Updates and Information available on \r\nhttp://www.clan-city.com/desktop_gadget/" + "\r\n\r\n"+
                    "qstat (www.qstat.org) © Steve Jankowski";
            }
            catch (Exception e)
            {
                Log.Error(e.Message);
            }
            Log.Debug("Executed Constructor");
		}

		void Initialize() 
		{
			Log.Debug("Called Initialize()");
			// initialize variables

			Bitmap smallImage = null;
			Bitmap largeImage = null;

			try
			{
			
				Log.Debug("Loading Paths");

				RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel");
				installPath = key.GetValue("path").ToString();
				Log.Debug("InstallPath: "+installPath);

                RegistryKey cat = key.OpenSubKey("Categories");
                displayGroup = cat.GetSubKeyNames().GetValue(0).ToString();
                cat.Close();

				key.Close();
				qstatPath = installPath+@"\qstat\qstat.exe";
				Log.Debug("Qstat: "+qstatPath);

				contentLayout = GoogleDesktopDisplayContentItemLayout.GDD_CONTENT_ITEM_LAYOUT_NOWRAP_ITEMS;

				// Load our icons
				smallImage = new Bitmap(Assembly.GetExecutingAssembly().GetManifestResourceStream(
					"GameserverPanel.iconSmall.gif"));

				largeImage = new Bitmap(Assembly.GetExecutingAssembly().GetManifestResourceStream(
					"GameserverPanel.iconLarge.gif"));
			}
			catch (Exception e)
			{
				Log.Error(e.Message);
			}

			try 
			{
				// Set plugin information
				IGoogleDesktopDisplayPluginHelper2 helper = (IGoogleDesktopDisplayPluginHelper2)this;
				helper.about_text = aboutStr;
				helper.SetIcons(ImageConverter.ImageToIpicture(smallImage),
						ImageConverter.ImageToIpicture(largeImage));
				UpdateTitle();
			}
			catch (Exception e)
			{
				Log.Error(e.Message);
			}
            Log.Debug("Executed Initialize()");
		}

		/// <summary>
		/// check what is the current display state; if we are minimized show the number
		/// of items as well in the title (as an example showing how to use the title
		/// for showing content when minimized)
		/// </summary>
		void UpdateTitle() 
		{
			Log.Debug("Called UpdateTitle");
			title = displayGroup;

			// displaySite will be null until plugin is fully initialized.
			/*
			if (displaySite != null && displaySite.display_state == 
				GoogleDesktopDisplayTileDisplayState.GDD_TILE_DISPLAY_STATE_MINIMIZED) 
			{
				title = pluginName;
			}
			*/
            Log.Debug("Executed UpdateTitle()");
		}

		void ClearAndAddFreshItems() 
		{
			Log.Debug("Called ClearAndAddFreshItems");
			// reset everything and start fresh with new layout

			try 
			{
				IGoogleDesktopDisplayPluginHelper helper = (IGoogleDesktopDisplayPluginHelper)this;

				// details are available
				GoogleDesktopDisplayContentFlags contentFlags = 
                    GoogleDesktopDisplayContentFlags.GDD_CONTENT_FLAG_HAVE_DETAILS
                    | GoogleDesktopDisplayContentFlags.GDD_CONTENT_FLAG_NO_AUTO_MIN_SIZE
                    | GoogleDesktopDisplayContentFlags.GDD_CONTENT_FLAG_MANUAL_LAYOUT;
                GoogleDesktopDisplayPluginFlags pluginFlags = 
                    GoogleDesktopDisplayPluginFlags.GDD_PLUGIN_FLAG_TOOLBAR_BACK
                    | GoogleDesktopDisplayPluginFlags.GDD_PLUGIN_FLAG_TOOLBAR_FORWARD;
				helper.SetFlags(pluginFlags, contentFlags);

				// since we are going to show items with a new layout, remove all old ones
				helper.RemoveAllContentItems();
				ChangeItems();
			}
			catch (Exception e) 
			{
				Log.Error(e.Message);
			}
            Log.Debug("Executed ClearAndAddFreshItems()");
		}

		void StartShowingContent() 
		{
			Log.Debug("Called StartShowingContent");
			ClearAndAddFreshItems();

            // this will set the layout and start showing content
			timer = new System.Windows.Forms.Timer();
			timer.Tick += new EventHandler(OnTimer);

            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel");
            try
            {
                timer.Interval = Int32.Parse( key.GetValue("timerInterval").ToString() )*1000;
            }
            catch
            {
                timer.Interval = 20000;
            }
            if (key.GetValue("useTimer").ToString()=="1")
            {
                timer.Start();
            }
            key.Close();
			
            Log.Debug("Executed StartShowingContent()");
		}

		void StopShowingContent() 
		{
			Log.Debug("Called StopShowingContent");
            
			timer.Stop();
			timer.Dispose();
		}

        public Object[] getFriends()
        {
            Object obj = null;
            IServiceProvider serviceProvider =
                (IServiceProvider)displaySite;
            serviceProvider.QueryService(
                typeof(IGoogleDesktopPluginTalkService).GUID,
                typeof(IGoogleDesktopPluginTalkService).GUID,
                out obj);

            talk_service =
                (IGoogleDesktopPluginTalkService)obj;
            return (Object[])talk_service.friends;
        }

		/// <summary>
		/// Refresh current directory because files/folders may have been moved/deleted
		/// </summary>
		/// <param name="myObject"></param>
		/// <param name="eventArgs"></param>
		void OnTimer(Object myObject, EventArgs eventArgs) 
		{
			ClearAndAddFreshItems();
		}

		public void refresh(String group) 
		{
            if (group != null) {
			    displayGroup = group;
                UpdateTitle();
            }
			ClearAndAddFreshItems();
		}

		public string getPluginName()
		{
			return pluginName;
		}

        public void findGames()
        {
            try
            {
                RegistryKey gamekey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Games\");
                String[] games = gamekey.GetSubKeyNames();
                for (int i=0; i<games.Length; i++)
                {
                    RegistryKey game = gamekey.OpenSubKey(games[i], true);
                    if (game.GetValue("isInstalled").ToString() == "0")
                    {
                        if (game.GetValue("locate").ToString().Length == 0) continue;
                        String[] locate = game.GetValue("locate").ToString().Split('|');
                        RegistryKey location = null;
                        if (locate[2] == "PATH")
                        {
                            String path = "";            
                            if (locate[0] == "HKLM") 
                            {
                                location = Registry.LocalMachine.OpenSubKey(locate[1]);
                                if (location == null) continue;
                                path = location.GetValue(locate[3]).ToString();
                                path += "\\"+locate[4];
                            }
                            else if (locate[0] == "HKCU") 
                            {
                                location = Registry.CurrentUser.OpenSubKey(locate[1]);
                                if (location == null) continue;
                                path = location.GetValue(locate[3]).ToString();
                                path += "\\"+locate[4];
                            }
                            if (File.Exists(path))
                            {
                                FileInfo fi = new FileInfo(path);
                                game.SetValue("isInstalled", 1);
                                game.SetValue("installPath", fi.FullName);
                                if (game.GetValue("needPath").ToString() == "1")
                                {
                                    game.SetValue("command", fi.Name);
                                }
                            }
                        }
                        else if (locate[2] == "BOOL")
                        {
                            bool installed = false;
                            if (locate[0] == "HKLM") 
                            {
                                location = Registry.LocalMachine.OpenSubKey(locate[1]);
                                if (location == null) continue;
                                installed = (location.GetValue(locate[3]).ToString() == "1");
                            }
                            else if (locate[0] == "HKCU") 
                            {
                                location = Registry.CurrentUser.OpenSubKey(locate[1]);
                                if (location == null) continue;
                                installed = (location.GetValue(locate[3]).ToString() == "1");
                            }
                            if (installed)
                            {
                                game.SetValue("isInstalled", 1);
                            }
                        }
                        location.Close();
                    }
                    game.Close();
                }
                gamekey.Close();
            }
            catch (Exception E)
            {
                Log.Error("findGames(): "+E.Message);
            }
        }

        public String[] queryServer(String type, String ip, int port)
        {
            try
            {
                System.Diagnostics.Process proc = new System.Diagnostics.Process();
                proc.StartInfo.FileName = this.qstatPath;
                proc.StartInfo.Arguments = "-raw , -retry 2 -interval 0.1 -timeout 1 -"+type.ToLower()+" "+ip+":"+port;
                Log.Debug("Running: qstat.exe "+proc.StartInfo.Arguments);
                proc.StartInfo.UseShellExecute = false;
                proc.StartInfo.CreateNoWindow = true;
                proc.StartInfo.RedirectStandardOutput = true;
                proc.Start();
			
                String processOutput = null;
                processOutput = proc.StandardOutput.ReadToEnd();
                proc.WaitForExit();
                proc.Dispose();

                String delim = ",";
                return processOutput.Split( delim.ToCharArray() );
            }
            catch (Exception E)
            {
                Log.Error("QueryServer(): "+E.Message);
                return new String[0];
            }
        }

        public void queryServerDetails(String type, String ip, int port, out String[] serverData, out String[] serverRules, out String[] serverPlayers)
        {
            System.Diagnostics.Process proc = new System.Diagnostics.Process();
            proc.StartInfo.FileName = this.qstatPath;
            proc.StartInfo.Arguments = "-raw , -retry 5 -sort F -P -R -tsw -timeout 2 -"+type.ToLower()+" "+ip+":"+port;
            Log.Debug("Running: qstat.exe "+proc.StartInfo.Arguments);
            proc.StartInfo.UseShellExecute = false;
            proc.StartInfo.CreateNoWindow = true;
            proc.StartInfo.RedirectStandardOutput = true;
            proc.Start();
			
            String processOutput = null;
            processOutput = proc.StandardOutput.ReadToEnd();
            proc.WaitForExit();
            proc.Dispose();
            if (processOutput.Trim().Length == 0)
            {
                serverData = new String[0];
                serverRules = new String[0];
                serverPlayers = new String[0];
            }
            String[] allData = processOutput.Split('\n');
            serverData = allData[0].Split(',');
            serverRules = allData[1].Split(',');
            serverPlayers = new String[ Int32.Parse(serverData[5]) ];
            for (int i=0; i<serverPlayers.Length; i++)
            {
                if (allData[i+2].Trim().Length > 0)
                {
                    serverPlayers[i] = allData[i+2];
                }
            }
        }

        public void joinServer(String game, String ip, int port)
        {
            timer.Stop();

            RegistryKey gamekey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Games\"+game);
            String command;
            String parameters;
            if (gamekey.GetValue("needpath").ToString() == "1") 
            {
                command = gamekey.GetValue("installPath").ToString();
                parameters = gamekey.GetValue("parameter").ToString();
            }
            else 
            {
                command = gamekey.GetValue("command").ToString();
                parameters = gamekey.GetValue("parameter").ToString();
            }
            gamekey.Close();
            command = command.Replace("%ip%", ip);
            command = command.Replace("%port%", port.ToString());
            parameters = parameters.Replace("%ip%", ip);
            parameters = parameters.Replace("%port%", port.ToString());

            Log.Debug("Joining Server "+command+" "+parameters);
            System.Diagnostics.Process proc = new System.Diagnostics.Process();

            if (File.Exists(command)) 
            {
                FileInfo fi = new FileInfo(command);
                proc.StartInfo.FileName = fi.FullName;
                proc.StartInfo.Arguments = parameters;
                proc.StartInfo.WorkingDirectory = fi.DirectoryName;
            }
            else if (command.IndexOf("://") > 0) 
            {
                proc.StartInfo.FileName = command;
            }
            else 
            {
                MessageBox.Show(lang.getValue("gameNotConfigured"));
                proc.Dispose();
                return;
            }
            proc.StartInfo.UseShellExecute = true;
            
            proc.Start();

            proc.WaitForExit();
            proc.Dispose();

            Log.Debug("Resuming Timer after playing");
            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel");
            if (key.GetValue("useTimer").ToString()=="1")
            {
                timer.Start();
            }
            key.Close();
        }

		/// <summary>
		/// Create content items and add to the display
		/// </summary>
		void ChangeItems() 
		{
            addItems = 0;

            // add content to display.
            IGoogleDesktopDisplayPluginHelper pluginHelper = 
                (IGoogleDesktopDisplayPluginHelper)this;
			
            GoogleDesktopContentItemDisplayOptions options;
            GameserverContentItem curItem;
            GoogleDesktopDisplayContentItemFlags itemFlags;
            IGoogleDesktopDisplayContentItemHelper itemHelper = null;			

            options = GoogleDesktopContentItemDisplayOptions.GDD_ITEM_DISPLAY_IN_SIDEBAR;
			
            itemFlags = 
                GoogleDesktopDisplayContentItemFlags.GDD_CONTENT_ITEM_FLAG_NO_REMOVE
                | GoogleDesktopDisplayContentItemFlags.GDD_CONTENT_ITEM_FLAG_SHAREABLE;

            DateTime now = DateTime.UtcNow;

            try
            {
                RegistryKey serverKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Servers");
				
                String[] servers = serverKey.GetSubKeyNames();

				if (servers.Length == 0)
				{
					itemFlags = GoogleDesktopDisplayContentItemFlags.GDD_CONTENT_ITEM_FLAG_LEFT_ICON |
						GoogleDesktopDisplayContentItemFlags.GDD_CONTENT_ITEM_FLAG_NO_REMOVE
						;

					curItem = new GameserverContentItem();
					itemHelper = (IGoogleDesktopDisplayContentItemHelper)curItem;

					Rectangle r = getDisplayRect();
					curItem.SetRect(r.X, r.Y, r.Width, r.Height*2);
					pluginHelper.AddContentItem(curItem, options);

					itemHelper.snippet = "MESSAGE";
					itemHelper.heading = lang.getValue("noServer");
					itemHelper.tooltip = lang.getValue("noServer");
					itemHelper.source = "";
					itemHelper.time_created = now;
					itemHelper.flags = itemFlags;
					itemHelper.layout = contentLayout;
					itemHelper.open_command = this;
				}

                for (int i=0; i<servers.Length; i++) 
                {
                    try
                    {
                        RegistryKey server = serverKey.OpenSubKey(servers[i]);

                        if (server.GetValue("category").ToString() != displayGroup) 
                        {
                            continue;
                        }
                        int queryPort = Int32.Parse(server.GetValue("port").ToString());
                        if (server.GetValue("queryPort") != null)
                        {
                            queryPort = Int32.Parse(server.GetValue("queryPort").ToString());
                        }
                        String[] serverData = queryServer(server.GetValue("qstat").ToString(), server.GetValue("ip").ToString(), queryPort);

                        itemFlags = GoogleDesktopDisplayContentItemFlags.GDD_CONTENT_ITEM_FLAG_LEFT_ICON |
                            GoogleDesktopDisplayContentItemFlags.GDD_CONTENT_ITEM_FLAG_NO_REMOVE
                            ;

                        curItem = new GameserverContentItem();
                        itemHelper = (IGoogleDesktopDisplayContentItemHelper)curItem;

                        Rectangle r = getDisplayRect();
                        curItem.SetRect(r.X, r.Y, r.Width, r.Height);
                        pluginHelper.AddContentItem(curItem, options);

                        itemHelper.snippet = server.GetValue("game").ToString() + "|"
                            + server.GetValue("ip").ToString() + "|"
                            + server.GetValue("port").ToString() + "|"
                            + server.GetValue("qstat").ToString() + "|"
                            + server.GetValue("queryPort").ToString();

                        // do the actual setting of properties
                        if (serverData.Length > 3) 
                        {
                            itemHelper.heading = serverData[2];
                            itemHelper.tooltip = serverData[2];
                            itemHelper.source = serverData[6]+","+serverData[5]+","+serverData[4];
                            itemHelper.snippet += "|"+serverData[3];
                        }
                        else 
                        {
                            itemHelper.heading = server.GetValue("name").ToString();
                            itemHelper.tooltip = server.GetValue("name").ToString();
                            itemHelper.source = "0,0,0";
                        }
                        itemHelper.time_created = now;
                        itemHelper.flags = itemFlags;
                        itemHelper.layout = contentLayout;
                        itemHelper.open_command = this;

                        Bitmap bmp;
                        loadGameIcon(server.GetValue("game").ToString(), out bmp);
                        itemHelper.image = ImageConverter.ImageToIpicture(bmp);
                        bmp.Dispose();

                        addItems++;

                        server.Close();
                    }
                    catch (Exception E)
                    {
                        Log.Error("Error Adding Item for "+servers[i]+": "+E.Message);
                    }
                }

                serverKey.Close();
            }
            catch (Exception e)
            {
                Log.Error("on ChangeItems: "+e.Message);
            }

            // Replace & with && so that the next character won't be underlined _
            //if (itemHelper != null)
            //    itemHelper.heading = itemHelper.heading.Replace("&", "&&");

			// if we are in minimized mode, update the title with latest info.
			// displaySite will be null until plugin is fully initialized.
			if (displaySite != null && displaySite.display_state == 
				GoogleDesktopDisplayTileDisplayState.GDD_TILE_DISPLAY_STATE_MINIMIZED) 
			{
				UpdateTitle();
			}
		}

		Rectangle getDisplayRect()
		{
			Rectangle res;
            if ( displaySite.display_state == GoogleDesktopDisplayTileDisplayState.GDD_TILE_DISPLAY_STATE_POPPED_OUT) {
			    res = new Rectangle(0, addItems*28, window_width, 28);
            }
            else {
                res = new Rectangle(0, addItems*28, window_width, 28);
            }

			return res;
		}

        public void loadGameIcon(String game, out Bitmap result)
        {
            try 
            {
                String resource = "GameserverPanel.Resources."+game+".ico";
                Stream resStream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resource);
                if (resStream == null) 
                {
                    result = new Bitmap(1, 1);
                    result.SetPixel(0, 0, Color.White);
                    return;
                }
                result = new Icon(resStream, 16, 16).ToBitmap();

                Color c;
                Color t = Color.FromArgb(0,0,0,0);

                for (int x=0; x<result.Width; x++)
                {
                    for (int y=0; y<result.Height; y++)
                    {
                        c = result.GetPixel(x, y);
                        if (c == t)
                            result.SetPixel(x, y, Color.White);
                    }
                }
            }
            catch (Exception E)
            {
                result = new Bitmap(1, 1);
                result.SetPixel(0, 0, Color.White);
                Log.Error("loadGameIcon(): "+E.Message);
            }
        }

		#endregion
  
		#region Registration functions

		/// <summary>
		/// Called when the plugin is registered with the system. We add a few registry
		/// keys and register with GoogleDesktop as a plugin.
		/// </summary>
		/// <param name="t"></param>
		[ComRegisterFunctionAttribute]
		static void RegisterFunction(Type t) 
		{
			try 
			{
				// Set the 'MiscStatus' value in registry to a valid value
				string keyName = @"CLSID\" + t.GUID.ToString("B");
                Log.Debug("Register: Creating Registry Keys");
				using (RegistryKey key = Registry.ClassesRoot.OpenSubKey(keyName, true)) 
				{
					key.CreateSubKey("Control").Close();
					using (RegistryKey subkey = key.CreateSubKey("MiscStatus")) 
					{
						subkey.SetValue("", "131457");
					}
					key.SetValue("", pluginName);
					using (RegistryKey subkey = key.CreateSubKey("Description"))
					{
						subkey.SetValue("", pluginDescription);
					}
				}

                Log.Debug("Register: Creating registrar Object");
				// Create the registrar object
				GoogleDesktopRegistrarClass registrar = new GoogleDesktopRegistrarClass();

                Log.Debug("Register: Filling Description Array");
				// Start component registration by specifying our attributes
				object[] descriptions = {
											"Title", pluginName,
											"Description", pluginDescription,
											"Icon", ""
										};
				registrar.StartComponentRegistration(controlGuid, descriptions);

                Log.Debug("Register: Registering Display Plugin");
				// A single component can register for multiple plugins with Google Desktop.
				// Here we register a single display plugin.
				IGoogleDesktopRegisterDisplayPlugin displayRegistration = 
					(IGoogleDesktopRegisterDisplayPlugin)
					registrar.GetRegistrationInterface("GoogleDesktop.DisplayPluginRegistration");
				displayRegistration.RegisterPlugin(controlGuid, true);

                Log.Debug("Register: Finish Component Registration");
				// Done with component registration.
				registrar.FinishComponentRegistration();
                Log.Debug("Register: Successfully Completed");
			} 
			catch (Exception e)
			{
				Log.Error("Exception thrown during registration. Description=" + e.Message);
                MessageBox.Show("The Plugin could not be registered. Please try uninstalling the Plugin and reinstalling it. If that doesn't work contact the author for support");
			}
		}
   
		/// <summary>
		/// Called when the plugin is unregistered. We unregister our plugin with 
		/// GoogleDesktop.
		/// </summary>
		/// <param name="t"></param>
		[ComUnregisterFunctionAttribute]
		static void UnregisterFunction(Type t) 
		{
			try 
			{
				// Create the registrar object
				GoogleDesktopRegistrarClass registrar = new GoogleDesktopRegistrarClass();

				// Unregister ourselves
				registrar.UnregisterComponent(controlGuid);
			} 
			catch (Exception e) 
			{
				Log.Error("Exception thrown during unregistering. Description=" + e.Message);
			}
		}

		#endregion
  
		#region IGoogleDesktopDisplayPluginHandler2 Members

		/// <summary>
		/// Called when the user selects any of the plugin's menu options/commands
		/// </summary>
		/// <param name="command">The command id to execute</param>
		public new void OnCommand(GoogleDesktopDisplayPluginCommand command) 
		{
            Log.Debug("DisplayPluginCommand executed with " + command);

			if (command == GoogleDesktopDisplayPluginCommand.GDD_CMD_ABOUT_DLG) 
			{
				// always throw this exception when you dont intend to override the default behavior
				// and you want the plugin helper to do it's usual stuff.
				throw new NotImplementedException();
			}

            RegistryKey key;
            key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Categories");
            String[] categories = key.GetSubKeyNames();
            int curIdx=0;
            for (int i=0; i<categories.Length; i++)
            {
                if (categories[i] == displayGroup)
                {
                    curIdx = i;
                    break;
                }
            }
            key.Close();

            if (command == GoogleDesktopDisplayPluginCommand.GDD_CMD_TOOLBAR_FORWARD)
            {
                if (curIdx == (categories.Length-1) )
                {
                    curIdx = 0;
                }
                else
                {
                    curIdx++;
                }
            }

			if (command == GoogleDesktopDisplayPluginCommand.GDD_CMD_TOOLBAR_BACK)
			{
                if (curIdx == 0 )
                {
                    curIdx = categories.Length-1;
                }
                else
                {
                    curIdx--;
                }
			}
            refresh(categories[curIdx]);
		}

		/// <summary>
		/// Called when the plugin's display state changes
		/// </summary>
		/// <param name="displayState">The new display state</param>
		public new void OnDisplayStateChange(GoogleDesktopDisplayTileDisplayState displayState) 
		{
            Log.Debug("Display State Changed");
			if (displayState == GoogleDesktopDisplayTileDisplayState.GDD_TILE_DISPLAY_STATE_MINIMIZED || 
				displayState == GoogleDesktopDisplayTileDisplayState.GDD_TILE_DISPLAY_STATE_RESTORED) 
			{
				// switching between minimized and normal mode, so update the title
				UpdateTitle();
			}
			
			if (displayState == GoogleDesktopDisplayTileDisplayState.GDD_TILE_DISPLAY_STATE_POPPED_OUT ||
                displayState == GoogleDesktopDisplayTileDisplayState.GDD_TILE_DISPLAY_STATE_RESIZED)
			{
				ClearAndAddFreshItems();
			}
		}

		#endregion

        #region IGoogleDesktopPluginTalkHandler Members

        public void OnReceiveTalkMessage ( System.Object talk_friend , System.String data )
        {
            Log.Debug("Received Talk Message");
            try
            {
                IGoogleDesktopTalkFriend friend = (IGoogleDesktopTalkFriend)talk_friend;
                String[] cmd = data.Split('|');
                String game = cmd[0];
                String ip = cmd[1];
                int port = Int32.Parse(cmd[2]);

                String msg = String.Format(lang.getValue("talkInvite")+"\n",
                                                friend.name, game, ip, port);
                Log.Debug("Received Invitation for "+game+" on "+ip+":"+port+" from "+friend.name);
                RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Games\"+game);
                if (key == null)
                {
                    msg += String.Format( lang.getValue("talkUnknownGame"), pluginName);
                    MessageBox.Show(msg, pluginName, MessageBoxButtons.OK, MessageBoxIcon.Information);
                    return;
                }
                if (key.GetValue("isInstalled").ToString() == "0")
                {
                    findGames();
                    if (key.GetValue("isInstalled").ToString() == "0")
                    {
                        msg += lang.getValue("talkGameNotInstalled");
                        MessageBox.Show(msg, pluginName, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return;
                    }
                }
                msg += lang.getValue("talkConnect");
                key.Close();

                Log.Debug("Displaying Notification");
                GameserverContentItem item = new GameserverContentItem();
                IGoogleDesktopDisplayContentItemHelper itemHelper = (IGoogleDesktopDisplayContentItemHelper)item;
                GoogleDesktopDisplayContentItemLayout contentLayout = 
                    GoogleDesktopDisplayContentItemLayout.GDD_CONTENT_ITEM_LAYOUT_NOWRAP_ITEMS;
                GoogleDesktopDisplayContentItemFlags itemFlags = 
                    GoogleDesktopDisplayContentItemFlags.GDD_CONTENT_ITEM_FLAG_NONE;
                itemHelper.heading = msg;
                itemHelper.tooltip = msg;
                itemHelper.source = "0,0,0";
                itemHelper.snippet = data;
                itemHelper.flags = itemFlags;
                itemHelper.open_command = this;
                itemHelper.layout = contentLayout;

                GoogleDesktopDisplayUINotificationClass notify = new GoogleDesktopDisplayLib.GoogleDesktopDisplayUINotificationClass();
                notify.enabled = true;
                notify.AddNotification(controlGuid, item);
            }
            catch (Exception E)
            {
                Log.Error("onReceiveTalkMessage: "+E.Message);
            }
            Log.Debug("Executed Talk Message");
        }
    
        #endregion

		#region IContextMenu Members

		int IContextMenu.QueryContextMenu(uint hMenu, uint iMenu, int
			idCmdFirst, int idCmdLast, uint uFlags)
		{
			int id = 1;
			uint order = 0;

			MenuHelper.AddMenuItem(hMenu, lang.getValue("menuNewServer"), ++id, order++, true);
			MenuHelper.AddMenuItem(hMenu, lang.getValue("menuRefresh"), ++id, order++, true);
            MenuHelper.AddMenuItem(hMenu, lang.getValue("menuSearchGames"), ++id, order++, true);
			// MenuHelper.AddSeparator(hMenu, order++);
			return id;

		}

		//handler clicks
		void IContextMenu.InvokeCommand (IntPtr pici)
		{
			Type typINVOKECOMMANDINFO =
				Type.GetType("ShellExt.INVOKECOMMANDINFO");
			INVOKECOMMANDINFO ici =
				(INVOKECOMMANDINFO)Marshal.PtrToStructure(pici, typINVOKECOMMANDINFO);

			switch (ici.verb)
			{
                case 1: formServer newServer = new formServer(0);
                        newServer.dataObject = this;
				        newServer.ShowDialog();

				        this.ClearAndAddFreshItems();
                        break;

                case 2: this.ClearAndAddFreshItems();
                        break;

                case 3: findGames();
                        break;
                
			}


		}

		void IContextMenu.GetCommandString(int idCmd, uint uFlags, int
			pwReserved, StringBuilder commandString, int cchMax)
		{
			//do nothing (for now)
		}

		#endregion 

		#region ISpecifyPropertyPages Members

		/// <summary>
		/// Return an array of Guids representing our plugin's property pages
		/// </summary>
		/// <param name="pPages">store the Guids and return here</param>
		public void GetPages(ref CAUUID pPages) 
		{
			Guid[] g = new Guid[1];
			g[0] = typeof(GameserverPropertyPage).GUID;
			pPages.SetPages(g);
		}

		#endregion

		#region IPersistStreamInit Members

		public void GetClassID(out Guid classId) 
		{
			classId = new Guid ();  // not used now
		}

		public ulong GetSizeMax() 
		{
			return 0; // not used now
		}

		public UInt32 IsDirty() 
		{
			return (UInt32)(isDirty ? 1 : 0);
		}

		/// <summary>
		/// Called to initialize with default settings
		/// </summary>
		public void InitNew() 
		{
            Log.Debug("Called InitNew()");
			Initialize();
		}

		/// <summary>
		/// Called to read the settings data from the given stream.
		/// </summary>
		/// <param name="stm">stream from which the settings can be read</param>
		public void Load(UCOMIStream stm) 
		{
            Log.Debug("Called Load()");
            try
            {
                const int maxDataLen = 1000;  // read a large enough number of bytes for us.
                byte[] data = new byte[maxDataLen];
                stm.Read(data, data.Length, IntPtr.Zero); 

                MemoryStream memStream = new MemoryStream(data);
                BinaryReader binReader = new BinaryReader(memStream);

                int version = binReader.ReadInt32();
                if (version != dataVersion) 
                {
                    // MessageBox.Show("Invalid data version, using default values");
                } 
                else 
                {
                    // valid version, continue reading data.

                }
            }
            catch (Exception E)
            {
                Log.Error("Load Error"+E.Message);
            }

			Initialize();
		}

		/// <summary>
		/// Called to save the settings data to the given stream.
		/// </summary>
		/// <param name="stm">stream to save the settings to</param>
		/// <param name="clearDirty">if true, clear our 'dirty' flag</param>
		public void Save(UCOMIStream stm, bool clearDirty) 
		{
            try
            {
			MemoryStream memStream = new MemoryStream();
			BinaryWriter binWriter = new BinaryWriter(memStream);

			// first our version
			binWriter.Write(dataVersion);
			// then the data.

			// cleanup
			binWriter.Flush();

			// write to actual output stream
			byte[] data = memStream.ToArray();
			stm.Write(data, data.Length, IntPtr.Zero);

			if (clearDirty)
				isDirty = false;
            }
            catch (Exception E)
            {
                Log.Error("Save Error "+E.Message);
            }
		}

		#endregion
  
		#region IObjectWithSite Members

		/// <summary>
		/// Set/reset the object's 'site' which is used to get/set various plugin 
		/// properties later on
		/// </summary>
		/// <param name="site">The site object, null when the site is reset</param>
		public void SetSite(Object site) 
		{
			displaySite = (IGoogleDesktopDisplaySite)site;

			if (displaySite != null) 
			{
				// start adding data since we are completely initialized
				StartShowingContent();
			} 
			else 
			{
				// no more adding data as we are in uninitialized state
				StopShowingContent();
			}

		}

		public void GetPageContainer(out Object site) 
		{
			site = displaySite;
		}

		#endregion
	}

    #endregion

}
