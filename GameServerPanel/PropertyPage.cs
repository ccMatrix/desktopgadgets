using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.IO;
using Microsoft.Win32;

namespace GameserverPanel {

	#region GameserverPropertyPage Class

	/// <summary>
	/// This is our plugin's property page where it shows the plugin's settings and
	/// allows the user to change them.
	/// </summary>
	[GuidAttribute("EC4EDCF9-3084-4e11-9D40-5215EE97BDF4")]
	[ClassInterface(ClassInterfaceType.None)]
	public class GameserverPropertyPage : PropertyPage 
	{
		private System.Windows.Forms.Label label1;
		private System.Windows.Forms.ComboBox servers;
		private System.Windows.Forms.Button btnEdit;
		private System.Windows.Forms.Button btnRemove;
		private System.Windows.Forms.Button btnAdd;
        private System.Windows.Forms.ComboBox games;
        private System.Windows.Forms.ImageList optionIcons;
        private System.Windows.Forms.Button btnSetPath;
        private System.Windows.Forms.ComboBox categories;
        private System.Windows.Forms.Button btnCatAdd;
        private System.Windows.Forms.Button btnCatDel;
        private System.Windows.Forms.Button btnDelGame;
        private System.Windows.Forms.CheckBox timerEnabled;
        private System.Windows.Forms.NumericUpDown timerInterval;
        private System.Windows.Forms.Button btnAutoSeek;
        private System.Windows.Forms.Label labelServer;
        private System.Windows.Forms.Label labelGames;
        private System.Windows.Forms.Label labelCategories;
        private System.Windows.Forms.Label labelSeconds;
		private System.Windows.Forms.ToolTip propertyTooltip;
        private System.ComponentModel.IContainer components;

		public GameserverPropertyPage() 
		{
			Log.Debug("Called GameserverPropertyPage Constructor");
			try 
			{
				InitializeComponent();
			}
			catch (Exception e) 
			{
				Log.Error(e.Message);
			}

		}

		protected override void Dispose(bool disposing) 
		{
			if (disposing) 
			{
				if (components != null) 
				{
					components.Dispose();
				}
			}
			base.Dispose(disposing);
		}

		#region Initialize Components
		/// <summary> 
		/// Required method for Designer support - do not modify 
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.components = new System.ComponentModel.Container();
			System.Resources.ResourceManager resources = new System.Resources.ResourceManager(typeof(GameserverPropertyPage));
			this.label1 = new System.Windows.Forms.Label();
			this.servers = new System.Windows.Forms.ComboBox();
			this.btnEdit = new System.Windows.Forms.Button();
			this.optionIcons = new System.Windows.Forms.ImageList(this.components);
			this.btnRemove = new System.Windows.Forms.Button();
			this.btnAdd = new System.Windows.Forms.Button();
			this.games = new System.Windows.Forms.ComboBox();
			this.btnSetPath = new System.Windows.Forms.Button();
			this.categories = new System.Windows.Forms.ComboBox();
			this.btnCatAdd = new System.Windows.Forms.Button();
			this.btnCatDel = new System.Windows.Forms.Button();
			this.btnDelGame = new System.Windows.Forms.Button();
			this.timerEnabled = new System.Windows.Forms.CheckBox();
			this.timerInterval = new System.Windows.Forms.NumericUpDown();
			this.labelSeconds = new System.Windows.Forms.Label();
			this.btnAutoSeek = new System.Windows.Forms.Button();
			this.labelServer = new System.Windows.Forms.Label();
			this.labelGames = new System.Windows.Forms.Label();
			this.labelCategories = new System.Windows.Forms.Label();
			this.propertyTooltip = new System.Windows.Forms.ToolTip(this.components);
			((System.ComponentModel.ISupportInitialize)(this.timerInterval)).BeginInit();
			this.SuspendLayout();
			// 
			// label1
			// 
			this.label1.AutoSize = true;
			this.label1.Location = new System.Drawing.Point(5, 5);
			this.label1.Name = "label1";
			this.label1.Size = new System.Drawing.Size(0, 16);
			this.label1.TabIndex = 0;
			// 
			// servers
			// 
			this.servers.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.servers.Location = new System.Drawing.Point(8, 24);
			this.servers.Name = "servers";
			this.servers.Size = new System.Drawing.Size(240, 21);
			this.servers.TabIndex = 1;
			// 
			// btnEdit
			// 
			this.btnEdit.ImageIndex = 1;
			this.btnEdit.ImageList = this.optionIcons;
			this.btnEdit.Location = new System.Drawing.Point(280, 24);
			this.btnEdit.Name = "btnEdit";
			this.btnEdit.Size = new System.Drawing.Size(23, 21);
			this.btnEdit.TabIndex = 0;
			this.btnEdit.Click += new System.EventHandler(this.btnEdit_Click);
			// 
			// optionIcons
			// 
			this.optionIcons.ImageSize = new System.Drawing.Size(16, 16);
			this.optionIcons.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("optionIcons.ImageStream")));
			this.optionIcons.TransparentColor = System.Drawing.Color.Fuchsia;
			// 
			// btnRemove
			// 
			this.btnRemove.ImageIndex = 2;
			this.btnRemove.ImageList = this.optionIcons;
			this.btnRemove.Location = new System.Drawing.Point(304, 24);
			this.btnRemove.Name = "btnRemove";
			this.btnRemove.Size = new System.Drawing.Size(23, 21);
			this.btnRemove.TabIndex = 1;
			this.btnRemove.Click += new System.EventHandler(this.btnRemove_Click);
			// 
			// btnAdd
			// 
			this.btnAdd.ImageIndex = 0;
			this.btnAdd.ImageList = this.optionIcons;
			this.btnAdd.Location = new System.Drawing.Point(256, 24);
			this.btnAdd.Name = "btnAdd";
			this.btnAdd.Size = new System.Drawing.Size(23, 21);
			this.btnAdd.TabIndex = 2;
			this.btnAdd.Click += new System.EventHandler(this.btnAdd_Click);
			// 
			// games
			// 
			this.games.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.games.Location = new System.Drawing.Point(8, 72);
			this.games.Name = "games";
			this.games.Size = new System.Drawing.Size(240, 21);
			this.games.TabIndex = 3;
			// 
			// btnSetPath
			// 
			this.btnSetPath.ImageIndex = 3;
			this.btnSetPath.ImageList = this.optionIcons;
			this.btnSetPath.Location = new System.Drawing.Point(256, 72);
			this.btnSetPath.Name = "btnSetPath";
			this.btnSetPath.Size = new System.Drawing.Size(23, 21);
			this.btnSetPath.TabIndex = 4;
			this.btnSetPath.Click += new System.EventHandler(this.btnEditGame_Click);
			// 
			// categories
			// 
			this.categories.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.categories.Location = new System.Drawing.Point(8, 120);
			this.categories.Name = "categories";
			this.categories.Size = new System.Drawing.Size(240, 21);
			this.categories.TabIndex = 5;
			// 
			// btnCatAdd
			// 
			this.btnCatAdd.ImageIndex = 6;
			this.btnCatAdd.ImageList = this.optionIcons;
			this.btnCatAdd.Location = new System.Drawing.Point(256, 120);
			this.btnCatAdd.Name = "btnCatAdd";
			this.btnCatAdd.Size = new System.Drawing.Size(23, 21);
			this.btnCatAdd.TabIndex = 6;
			this.btnCatAdd.Click += new System.EventHandler(this.btnCatAdd_Click);
			// 
			// btnCatDel
			// 
			this.btnCatDel.ImageIndex = 7;
			this.btnCatDel.ImageList = this.optionIcons;
			this.btnCatDel.Location = new System.Drawing.Point(280, 120);
			this.btnCatDel.Name = "btnCatDel";
			this.btnCatDel.Size = new System.Drawing.Size(23, 21);
			this.btnCatDel.TabIndex = 7;
			this.btnCatDel.Click += new System.EventHandler(this.btnCatDel_Click);
			// 
			// btnDelGame
			// 
			this.btnDelGame.ImageIndex = 4;
			this.btnDelGame.ImageList = this.optionIcons;
			this.btnDelGame.Location = new System.Drawing.Point(280, 72);
			this.btnDelGame.Name = "btnDelGame";
			this.btnDelGame.Size = new System.Drawing.Size(23, 21);
			this.btnDelGame.TabIndex = 8;
			this.btnDelGame.Click += new System.EventHandler(this.btnDelGame_Click);
			// 
			// timerEnabled
			// 
			this.timerEnabled.Location = new System.Drawing.Point(8, 152);
			this.timerEnabled.Name = "timerEnabled";
			this.timerEnabled.Size = new System.Drawing.Size(144, 24);
			this.timerEnabled.TabIndex = 9;
			this.timerEnabled.Text = "Liste aktualisieren alle";
			this.timerEnabled.CheckedChanged += new System.EventHandler(this.timerEnabled_CheckedChanged);
			// 
			// timerInterval
			// 
			this.timerInterval.Location = new System.Drawing.Point(160, 152);
			this.timerInterval.Maximum = new System.Decimal(new int[] {
																		  3600,
																		  0,
																		  0,
																		  0});
			this.timerInterval.Name = "timerInterval";
			this.timerInterval.Size = new System.Drawing.Size(56, 20);
			this.timerInterval.TabIndex = 10;
			this.timerInterval.Value = new System.Decimal(new int[] {
																		20,
																		0,
																		0,
																		0});
			// 
			// labelSeconds
			// 
			this.labelSeconds.Location = new System.Drawing.Point(224, 152);
			this.labelSeconds.Name = "labelSeconds";
			this.labelSeconds.Size = new System.Drawing.Size(80, 24);
			this.labelSeconds.TabIndex = 11;
			this.labelSeconds.Text = "Sekunden";
			this.labelSeconds.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
			// 
			// btnAutoSeek
			// 
			this.btnAutoSeek.ImageIndex = 5;
			this.btnAutoSeek.ImageList = this.optionIcons;
			this.btnAutoSeek.Location = new System.Drawing.Point(304, 72);
			this.btnAutoSeek.Name = "btnAutoSeek";
			this.btnAutoSeek.Size = new System.Drawing.Size(23, 21);
			this.btnAutoSeek.TabIndex = 12;
			this.btnAutoSeek.Click += new System.EventHandler(this.btnAutoSeek_Click);
			// 
			// labelServer
			// 
			this.labelServer.Location = new System.Drawing.Point(8, 8);
			this.labelServer.Name = "labelServer";
			this.labelServer.Size = new System.Drawing.Size(240, 16);
			this.labelServer.TabIndex = 13;
			this.labelServer.Text = "Server";
			// 
			// labelGames
			// 
			this.labelGames.Location = new System.Drawing.Point(8, 56);
			this.labelGames.Name = "labelGames";
			this.labelGames.Size = new System.Drawing.Size(240, 16);
			this.labelGames.TabIndex = 14;
			this.labelGames.Text = "Spiele";
			// 
			// labelCategories
			// 
			this.labelCategories.Location = new System.Drawing.Point(8, 104);
			this.labelCategories.Name = "labelCategories";
			this.labelCategories.Size = new System.Drawing.Size(240, 16);
			this.labelCategories.TabIndex = 15;
			this.labelCategories.Text = "Kategorien";
			// 
			// GameserverPropertyPage
			// 
			this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
			this.ClientSize = new System.Drawing.Size(330, 184);
			this.Controls.Add(this.btnAutoSeek);
			this.Controls.Add(this.labelSeconds);
			this.Controls.Add(this.timerInterval);
			this.Controls.Add(this.timerEnabled);
			this.Controls.Add(this.btnDelGame);
			this.Controls.Add(this.btnCatDel);
			this.Controls.Add(this.btnCatAdd);
			this.Controls.Add(this.categories);
			this.Controls.Add(this.btnSetPath);
			this.Controls.Add(this.games);
			this.Controls.Add(this.btnAdd);
			this.Controls.Add(this.btnEdit);
			this.Controls.Add(this.btnRemove);
			this.Controls.Add(this.label1);
			this.Controls.Add(this.servers);
			this.Controls.Add(this.labelCategories);
			this.Controls.Add(this.labelGames);
			this.Controls.Add(this.labelServer);
			this.Name = "GameserverPropertyPage";
			this.Text = "Gameserver Panel";
			this.Load += new System.EventHandler(this.GameserverPropertyPage_Load);
			((System.ComponentModel.ISupportInitialize)(this.timerInterval)).EndInit();
			this.ResumeLayout(false);

		}
		#endregion

		#region PropertyPage handlers/overrides


		/// <summary>
		/// Called when user hits OK in the property page
		/// </summary>
		protected override void OnPageApply() 
		{
			GameserverPlugin ctl = dataObject as GameserverPlugin;
			if (ctl != null) 
			{
                ctl.timer.Interval = ((int)timerInterval.Value)*1000;
                ctl.timer.Enabled = timerEnabled.Checked;
                ctl.timer.Stop();
				ctl.refresh(null);
			}
            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel", true);
            key.SetValue("useTimer", timerEnabled.Checked?"1":"0");
            key.SetValue("timerInterval", timerInterval.Value);
            key.Close();
			base.OnPageApply();
		}

		/// <summary>
		/// Called just before the property page is displayed
		/// </summary>
		protected override void OnPageActivate(System.IntPtr wndParent, Rectangle Rect, bool modal) 
		{
			GameserverPlugin ctl = (dataObject as GameserverPlugin);
			if (ctl != null) 
			{
				labelServer.Text = ctl.lang.getValue("optionsServer");
				labelGames.Text = ctl.lang.getValue("optionsGames");
                labelCategories.Text = ctl.lang.getValue("optionsCategory");
                timerEnabled.Text = ctl.lang.getValue("optionsRefresh");
                labelSeconds.Text = ctl.lang.getValue("optionsSeconds");

				propertyTooltip.SetToolTip( btnAdd, ctl.lang.getValue("hintServerAdd") );
				propertyTooltip.SetToolTip( btnEdit, ctl.lang.getValue("hintServerEdit") );
				propertyTooltip.SetToolTip( btnRemove, ctl.lang.getValue("hintServerRemove") );
				propertyTooltip.SetToolTip( btnSetPath, ctl.lang.getValue("hintSetPath") );
				propertyTooltip.SetToolTip( btnDelGame, ctl.lang.getValue("hintDelGame") );
				propertyTooltip.SetToolTip( btnAutoSeek, ctl.lang.getValue("hintAutoSeek") );
				propertyTooltip.SetToolTip( btnCatAdd, ctl.lang.getValue("hintCatAdd") );
				propertyTooltip.SetToolTip( btnCatDel, ctl.lang.getValue("hintCatDel") );
			}

			try 
			{
				base.OnPageActivate(wndParent, Rect, modal);

                RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel");
                timerEnabled.Checked = key.GetValue("useTimer").ToString()=="1"?true:false;
                timerInterval.Value = Int32.Parse( key.GetValue("timerInterval").ToString() );
                timerInterval.Enabled = timerEnabled.Checked;
                key.Close();
	
			}
			catch (Exception e) 
			{
				Log.Error(e.Message);
			}
		}

		#endregion

		private void loadServers()
		{
			this.servers.Items.Clear();

			RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Servers");
			String[] serverList = key.GetSubKeyNames();
			for (int i=0; i<serverList.Length; i++) 
			{
				RegistryKey server = key.OpenSubKey(serverList[i]);
				this.servers.Items.Add(server.GetValue("name"));
				server.Close();
			}
			key.Close();

			if (this.servers.Items.Count > 0) 
			{
				this.servers.SelectedIndex = 0;
			}
			this.btnEdit.Enabled = (this.servers.Items.Count > 0);
			this.btnRemove.Enabled = (this.servers.Items.Count > 0);
		}

        private void loadGames()
        {
            this.games.Items.Clear();

            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Games");
            String[] gamesList = key.GetSubKeyNames();
            for (int i=0; i<gamesList.Length; i++)
            {
                RegistryKey game = key.OpenSubKey(gamesList[i]);
                String gameInfo = gamesList[i];
                if ( game.GetValue("isInstalled").ToString() == "1" )
                {
                    gameInfo += " ("+((GameserverPlugin)dataObject).lang.getValue("optionsInstalled")+")";
                }
                this.games.Items.Add(gameInfo);
                game.Close();
            }
            key.Close();

            if (this.games.Items.Count > 0) 
            {
                this.games.SelectedIndex = 0;
            }
			this.btnAutoSeek.Enabled = (this.games.Items.Count > 0);
			this.btnSetPath.Enabled = (this.games.Items.Count > 0);
			this.btnDelGame.Enabled = (this.games.Items.Count > 0);
        }

        private void loadCategories()
        {
            this.categories.Items.Clear();

            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Categories");
            this.categories.Items.AddRange( key.GetSubKeyNames() );
            key.Close();

            if (this.categories.Items.Count > 0) 
            {
                this.categories.SelectedIndex = 0;
            }
			this.btnCatAdd.Enabled = (this.categories.Items.Count > 0);
			this.btnCatDel.Enabled = (this.categories.Items.Count > 0);
        }

		private void GameserverPropertyPage_Load(object sender, System.EventArgs e)
		{
			this.loadServers();
            this.loadGames();
            this.loadCategories();
		}

		private void btnRemove_Click(object sender, System.EventArgs e)
		{
			DialogResult res = MessageBox.Show( ((GameserverPlugin)dataObject).lang.getValue("optionsDelServer") , "Gameserver Panel", MessageBoxButtons.YesNo);

			if (res == DialogResult.Yes) 
			{
				RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Servers", true);

				String[] serverList = key.GetSubKeyNames();
				key.DeleteSubKey(serverList[this.servers.SelectedIndex]);
				this.servers.Items.RemoveAt(this.servers.SelectedIndex);

				if (this.servers.Items.Count > 0) 
				{
					this.servers.SelectedIndex = 0;
				}

				key.Close();
			}
		}

		private void btnEdit_Click(object sender, System.EventArgs e)
		{
			RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Servers");

			String[] serverList = key.GetSubKeyNames();
			String idx = serverList[this.servers.SelectedIndex];
			idx = idx.Replace("Server", "");
			key.Close();

			formServer form = new formServer(int.Parse(idx));
            form.dataObject = dataObject;
			form.ShowDialog();

			this.loadServers();

		}

		private void btnAdd_Click(object sender, System.EventArgs e)
		{
			formServer form = new formServer(0);
            form.dataObject = dataObject;
			form.ShowDialog();

			this.loadServers();
		}

        private void btnEditGame_Click(object sender, System.EventArgs e)
        {
            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Games");

            String[] gameList = key.GetSubKeyNames();
            String gameName = gameList[this.games.SelectedIndex];
            OpenFileDialog openFile = new OpenFileDialog();
            openFile.Filter = "Ausführbare Dateien|*.exe";
            openFile.Title = gameName;
            if (openFile.ShowDialog() == DialogResult.OK)
            {
                FileInfo fi = new FileInfo(openFile.FileName);
                RegistryKey game = key.OpenSubKey(gameName, true);
                game.SetValue("isInstalled", 1);
                if (game.GetValue("needpath").ToString() == "1") {
                    game.SetValue("command", fi.Name);
                }
                game.SetValue("installPath", fi.FullName);
                game.Close();
            }
            openFile.Dispose();
            
            key.Close();

            this.loadGames();
        }

        private void btnCatAdd_Click(object sender, System.EventArgs e)
        {
            InputDialog id = new InputDialog( ((GameserverPlugin)dataObject).lang.getValue("optionsNewCat"));
            id.dataObject = dataObject;
            if (id.ShowDialog(this) == DialogResult.OK)
            {
                if (id.inputText.Length > 0)
                {
                    RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Categories", true);
                    key.CreateSubKey(id.inputText);
                    key.Close();
                }
            }
            id.Dispose();
            loadCategories();
        }

        private void btnCatDel_Click(object sender, System.EventArgs e)
        {
            GameserverPlugin ctl = (dataObject as GameserverPlugin);
            DialogResult res;
            RegistryKey key;
            RegistryKey server;
            if (categories.Items.Count == 1)
            {
                MessageBox.Show(ctl.lang.getValue("optionsCatMin"), "Gameserver");
                return;
            }

            int servers = 0;
            key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Servers", true);
            String[] serverList = key.GetSubKeyNames();
            for (int i=0; i<serverList.Length; i++)
            {
                server = key.OpenSubKey(serverList[i]);
                MessageBox.Show(server.GetValue("category").ToString() +"=="+ categories.SelectedItem.ToString());
                if (server.GetValue("category").ToString() == categories.SelectedItem.ToString())
                {
                    servers++;
                }
                server.Close();
            }
            key.Close();
 
            if (servers > 0)
            {
                MessageBox.Show( ctl.lang.getValue("optionsCatEmpty"), "Gameserver");
                return;
            }

            res = MessageBox.Show( ctl.lang.getValue("optionsCatDel"), "GameServer", MessageBoxButtons.YesNo);
            if (res == DialogResult.Yes)
            {
                key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Categories", true);
                key.DeleteSubKey(categories.SelectedText);
                key.Close();
            }
            loadCategories();
        }

        private void btnDelGame_Click(object sender, System.EventArgs e)
        {
            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Games");

            String[] gameList = key.GetSubKeyNames();
            String gameName = gameList[this.games.SelectedIndex];

            RegistryKey game = key.OpenSubKey(gameName, true);
            game.SetValue("isInstalled", 0);
            game.SetValue("installPath", "");
            game.Close();
            
            key.Close();

            this.loadGames();
        }

        private void timerEnabled_CheckedChanged(object sender, System.EventArgs e)
        {
            timerInterval.Enabled = (sender as CheckBox).Checked;
        }

        private void btnAutoSeek_Click(object sender, System.EventArgs e)
        {
            ((GameserverPlugin)dataObject).findGames();
            loadGames();
        }

	}


	#endregion

	#region Generic PropertyPage base class

  public class PropertyPage : Form, IPropertyPage 
  {
    #region Imported win32 API calls

    [DllImport("user32.dll")]
    public static extern int SetParent(IntPtr wnd, IntPtr newParentWnd);

    [DllImport("user32.dll", SetLastError = true)]
    static extern int SetWindowLong(IntPtr wnd, int index, UInt32 newLong);

    #endregion

    #region Overridables

    protected virtual void OnPageActivate(
        IntPtr wndParent, Rectangle Rect, bool modal) {
    }

    protected virtual void OnPageDeactivate() {
    }

    protected virtual void OnPageApply() {
    }

    #endregion

    #region IPropertyPage Members

    public void SetPageSite(IPropertyPageSite site) {
    }

    public void Help(ref String helpDir) {
    }

    public void Activate(IntPtr wndParent, ref Rectangle rect, bool modal) {
      // Make us a child of the given parent, and remove all window styles except WS_CHILD
      SetParent(Handle, wndParent);
      SetWindowLong(Handle, -16, 0x40000000);

      OnPageActivate(wndParent, rect, modal);  // inform derived class
    }

    public new void Deactivate() {
      OnPageDeactivate();
      Close();
    }

    public void GetPageInfo(ref PROPPAGEINFO info) {
      info.cb = (UInt32)Marshal.SizeOf(typeof(PROPPAGEINFO));
      info.size.Width = Width;
      info.size.Height = Height;
      info.szDocString = IntPtr.Zero;
      info.szHelpFile = IntPtr.Zero;

      // Caller frees this pointer
      info.szTitle = (Text.Length == 0) ? IntPtr.Zero : 
        Marshal.StringToCoTaskMemUni(Text);
    }

    public void SetObjects(UInt32 count, Object[] objs) {
      // Here we just take the first object, but in reality we should take all the
      // given objects and set the properties to them.
      dataObject = (count > 0) ? objs[0] : null;
    }

    public void Show(UInt32 cmdShow) {
      Visible = (cmdShow == 0) ? false : true;
    }

    public new void Move(ref Rectangle rect) {
      Location = rect.Location;
      Size = rect.Size;
    }

    public UInt32 IsPageDirty() {
      return 1; // for our purposes we always say settings have changed
    }

    public void Apply() {
      OnPageApply();  // inform derived class
    }

    public UInt32 TranslateAccelerator(ref Message msg) {
      // Default processing. If you want tabbing to work between the property frame's
      // controls and your controls, you need to add more stuff here.
      return (UInt32)((PreProcessMessage(ref msg) == false) ? 1 : 0);
    }

    #endregion

    public PropertyPage() {
      dataObject = null;

      // Override form defaults
      FormBorderStyle = FormBorderStyle.FixedSingle;
      ControlBox = false;
      MaximizeBox = false;
      MinimizeBox = false;
      ShowInTaskbar = false;
      StartPosition = FormStartPosition.Manual;
      WindowState = FormWindowState.Normal;
      Location = new Point(0);
    }

    // data
    protected Object dataObject;
  }

  #endregion

}
