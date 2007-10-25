using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using Microsoft.Win32;

namespace GameserverPanel
{
	/// <summary>
	/// Zusammenfassung für formServer.
	/// </summary>
	public class formServer : System.Windows.Forms.Form
	{
		private System.Windows.Forms.Label label_game;
		private System.Windows.Forms.Label label_ip;
		private System.Windows.Forms.Label label_port;
		private System.Windows.Forms.Button btnOK;
		private System.Windows.Forms.Button btnCancel;
		/// <summary>
		/// Erforderliche Designervariable.
		/// </summary>
		private System.ComponentModel.Container components = null;
		private System.Windows.Forms.Label label_name;
		private System.Windows.Forms.ComboBox server_game;
		private System.Windows.Forms.TextBox server_ip;
		private System.Windows.Forms.TextBox server_port;
		private System.Windows.Forms.TextBox server_name;
        private System.Windows.Forms.Label label_category;
        private System.Windows.Forms.ComboBox category;

		private int serverID = 0;
        private System.Windows.Forms.Label label_queryPort;
        private System.Windows.Forms.TextBox server_queryPort;
        public Object dataObject;

		public formServer(int sid)
		{
			//
			// Erforderlich für die Windows Form-Designerunterstützung
			//
			InitializeComponent();
            this.serverID = sid;
			//
			// TODO: Fügen Sie den Konstruktorcode nach dem Aufruf von InitializeComponent hinzu
			//
		}

		/// <summary>
		/// Die verwendeten Ressourcen bereinigen.
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

		#region Vom Windows Form-Designer generierter Code
		/// <summary>
		/// Erforderliche Methode für die Designerunterstützung. 
		/// Der Inhalt der Methode darf nicht mit dem Code-Editor geändert werden.
		/// </summary>
		private void InitializeComponent()
		{
            this.server_game = new System.Windows.Forms.ComboBox();
            this.label_game = new System.Windows.Forms.Label();
            this.server_ip = new System.Windows.Forms.TextBox();
            this.label_ip = new System.Windows.Forms.Label();
            this.server_port = new System.Windows.Forms.TextBox();
            this.label_port = new System.Windows.Forms.Label();
            this.btnOK = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.server_name = new System.Windows.Forms.TextBox();
            this.label_name = new System.Windows.Forms.Label();
            this.label_category = new System.Windows.Forms.Label();
            this.category = new System.Windows.Forms.ComboBox();
            this.label_queryPort = new System.Windows.Forms.Label();
            this.server_queryPort = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // server_game
            // 
            this.server_game.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.server_game.Location = new System.Drawing.Point(64, 8);
            this.server_game.Name = "server_game";
            this.server_game.Size = new System.Drawing.Size(240, 21);
            this.server_game.Sorted = true;
            this.server_game.TabIndex = 0;
            this.server_game.SelectedIndexChanged += new System.EventHandler(this.server_game_SelectedIndexChanged);
            // 
            // label_game
            // 
            this.label_game.Location = new System.Drawing.Point(8, 8);
            this.label_game.Name = "label_game";
            this.label_game.Size = new System.Drawing.Size(56, 24);
            this.label_game.TabIndex = 1;
            this.label_game.Text = "Spiel:";
            this.label_game.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // server_ip
            // 
            this.server_ip.Location = new System.Drawing.Point(64, 80);
            this.server_ip.Name = "server_ip";
            this.server_ip.Size = new System.Drawing.Size(240, 20);
            this.server_ip.TabIndex = 2;
            this.server_ip.Text = "192.168.0.1";
            // 
            // label_ip
            // 
            this.label_ip.Location = new System.Drawing.Point(8, 80);
            this.label_ip.Name = "label_ip";
            this.label_ip.Size = new System.Drawing.Size(56, 24);
            this.label_ip.TabIndex = 3;
            this.label_ip.Text = "IP:";
            this.label_ip.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // server_port
            // 
            this.server_port.Location = new System.Drawing.Point(64, 104);
            this.server_port.Name = "server_port";
            this.server_port.Size = new System.Drawing.Size(48, 20);
            this.server_port.TabIndex = 3;
            this.server_port.Text = "12345";
            this.server_port.TextChanged += new System.EventHandler(this.server_port_TextChanged);
            // 
            // label_port
            // 
            this.label_port.Location = new System.Drawing.Point(8, 104);
            this.label_port.Name = "label_port";
            this.label_port.Size = new System.Drawing.Size(56, 24);
            this.label_port.TabIndex = 5;
            this.label_port.Text = "Port:";
            this.label_port.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // btnOK
            // 
            this.btnOK.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.btnOK.Location = new System.Drawing.Point(152, 136);
            this.btnOK.Name = "btnOK";
            this.btnOK.TabIndex = 4;
            this.btnOK.Text = "OK";
            this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btnCancel.Location = new System.Drawing.Point(232, 136);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.TabIndex = 5;
            this.btnCancel.Text = "Abbrechen";
            // 
            // server_name
            // 
            this.server_name.Location = new System.Drawing.Point(64, 56);
            this.server_name.Name = "server_name";
            this.server_name.Size = new System.Drawing.Size(240, 20);
            this.server_name.TabIndex = 1;
            this.server_name.Text = "";
            // 
            // label_name
            // 
            this.label_name.Location = new System.Drawing.Point(8, 56);
            this.label_name.Name = "label_name";
            this.label_name.Size = new System.Drawing.Size(56, 24);
            this.label_name.TabIndex = 3;
            this.label_name.Text = "Name:";
            this.label_name.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // label_category
            // 
            this.label_category.Location = new System.Drawing.Point(8, 32);
            this.label_category.Name = "label_category";
            this.label_category.Size = new System.Drawing.Size(56, 24);
            this.label_category.TabIndex = 7;
            this.label_category.Text = "Kategorie:";
            this.label_category.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // category
            // 
            this.category.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.category.Location = new System.Drawing.Point(64, 32);
            this.category.Name = "category";
            this.category.Size = new System.Drawing.Size(240, 21);
            this.category.Sorted = true;
            this.category.TabIndex = 6;
            // 
            // label_queryPort
            // 
            this.label_queryPort.Location = new System.Drawing.Point(120, 104);
            this.label_queryPort.Name = "label_queryPort";
            this.label_queryPort.Size = new System.Drawing.Size(72, 24);
            this.label_queryPort.TabIndex = 8;
            this.label_queryPort.Text = "QueryPort:";
            this.label_queryPort.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // server_queryPort
            // 
            this.server_queryPort.Location = new System.Drawing.Point(192, 104);
            this.server_queryPort.Name = "server_queryPort";
            this.server_queryPort.Size = new System.Drawing.Size(48, 20);
            this.server_queryPort.TabIndex = 9;
            this.server_queryPort.Text = "12345";
            // 
            // formServer
            // 
            this.AcceptButton = this.btnOK;
            this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
            this.CancelButton = this.btnCancel;
            this.ClientSize = new System.Drawing.Size(312, 168);
            this.Controls.Add(this.server_queryPort);
            this.Controls.Add(this.label_queryPort);
            this.Controls.Add(this.label_category);
            this.Controls.Add(this.category);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnOK);
            this.Controls.Add(this.server_port);
            this.Controls.Add(this.server_ip);
            this.Controls.Add(this.server_name);
            this.Controls.Add(this.label_port);
            this.Controls.Add(this.label_ip);
            this.Controls.Add(this.label_game);
            this.Controls.Add(this.server_game);
            this.Controls.Add(this.label_name);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "formServer";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Neuer Server";
            this.TopMost = true;
            this.Load += new System.EventHandler(this.formServer_Load);
            this.ResumeLayout(false);

        }
		#endregion

		private void btnOK_Click(object sender, System.EventArgs e)
		{
            GameserverPlugin ctl = (GameserverPlugin)dataObject;
			if (this.server_ip.Text == "") 
			{
				MessageBox.Show( ctl.lang.getValue("formNoIp") );
				this.DialogResult = DialogResult.None;
				return;
			}
			if (this.server_port.Text == "") 
			{
				MessageBox.Show( ctl.lang.getValue("formNoPort") );
				this.DialogResult = DialogResult.None;
				return;
			}
			if (this.server_name.Text == "") 
			{
				MessageBox.Show( ctl.lang.getValue("formNoName") );
				this.DialogResult = DialogResult.None;
				return;
			}

			String keyToOpen = null;
			if (this.serverID == 0) 
			{
				int newId=0;

				try 
				{
					RegistryKey key = null;
					key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Servers");
					newId = 0;
					String[] servers = key.GetSubKeyNames();
					for (int i=0; i<servers.Length; i++) 
					{
						String serverData = servers[i];
						serverData = serverData.Replace("Server", "");
						if (int.Parse(serverData) > newId) 
						{
							newId = int.Parse(serverData);
						}
					}
					newId++;
					key.Close();

					keyToOpen = @"SOFTWARE\Imagine Interactive\Gameserver Panel\Servers\Server"+newId;

					key = Registry.LocalMachine.CreateSubKey(keyToOpen);
					key.Close();
				}
				catch (Exception error) 
				{
					Log.Error(error.Message);
				}
			}
			else 
			{
				keyToOpen = @"SOFTWARE\Imagine Interactive\Gameserver Panel\Servers\Server"+serverID;
			}

			RegistryKey server = Registry.LocalMachine.OpenSubKey(keyToOpen, true);
			
			server.SetValue("game", this.server_game.Text);
			server.SetValue("ip", this.server_ip.Text);
			server.SetValue("port", this.server_port.Text);
			server.SetValue("name", this.server_name.Text);
            server.SetValue("category", this.category.Text);
            server.SetValue("queryPort", this.server_queryPort.Text);

			RegistryKey gameData = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Imagine Interactive\Gameserver Panel\Games\"+this.server_game.Text);
			server.SetValue("qstat", gameData.GetValue("qstat"));
			gameData.Close();

			server.Close();
		}

        private void formServer_Load(object sender, System.EventArgs e)
        {
            GameserverPlugin ctl = (GameserverPlugin)dataObject;
            this.server_game.Items.Clear();

            RegistryKey server = Registry.LocalMachine.OpenSubKey(@"Software\Imagine Interactive\Gameserver Panel\Servers\Server"+this.serverID);

            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"Software\Imagine Interactive\Gameserver Panel\Games");
            String[] games = key.GetSubKeyNames();

            if (games.Length == 0) 
            {
                key.Close();
                this.Close();
                return;
            }
            for (int i=0; i<games.Length; i++) 
            {
                RegistryKey gameInfo = key.OpenSubKey(games[i]);
                if ( int.Parse(gameInfo.GetValue("isInstalled").ToString()) == 1) 
                {
                    this.server_game.Items.Add(games[i]);
                }
                gameInfo.Close();
            }

            if (this.server_game.Items.Count == 0)
            {
                ctl.findGames();
                for (int i=0; i<games.Length; i++) 
                {
                    RegistryKey gameInfo = key.OpenSubKey(games[i]);
                    if ( int.Parse(gameInfo.GetValue("isInstalled").ToString()) == 1) 
                    {
                        this.server_game.Items.Add(games[i]);
                    }
                    gameInfo.Close();
                }
            }
            key.Close();

            if (this.server_game.Items.Count == 0) 
            {
                MessageBox.Show( ctl.lang.getValue("formNoGames") );
                this.Close();
                return;
            }

            key = Registry.LocalMachine.OpenSubKey(@"Software\Imagine Interactive\Gameserver Panel\Categories");
            category.Items.AddRange( key.GetSubKeyNames() );
            key.Close();

            if (this.category.Items.Count == 0) 
            {
                MessageBox.Show( ctl.lang.getValue("formNoCats") );
                this.Close();
                return;
            }
            this.category.SelectedIndex = 0;

            if (this.serverID > 0)
            {
                this.server_game.SelectedIndex = this.server_game.Items.IndexOf(server.GetValue("game").ToString());
                this.server_ip.Text = server.GetValue("ip").ToString();
                this.server_port.Text = server.GetValue("port").ToString();
                this.server_name.Text = server.GetValue("name").ToString();

                server.Close();
            }
            else 
            {
                this.server_ip.Text = "";
                this.server_port.Text = "";
                this.server_game.SelectedIndex = 0;
                this.server_name.Text = "";
            }

            this.label_game.Text = ctl.lang.getValue("formLblGame")+":";
            this.label_category.Text = ctl.lang.getValue("formLblCategory")+":";
            this.label_name.Text = ctl.lang.getValue("formLblName")+":";
            this.label_ip.Text = ctl.lang.getValue("formLblIp")+":";
            this.label_port.Text = ctl.lang.getValue("formLblPort")+":";
            this.btnOK.Text = ctl.lang.getValue("buttonOk");
            this.btnCancel.Text = ctl.lang.getValue("buttonCancel");
        }

        private void server_port_TextChanged(object sender, System.EventArgs e)
        {
            if (!server_queryPort.Enabled)
            {
                server_queryPort.Text = server_port.Text;
            }
        }

        private void server_game_SelectedIndexChanged(object sender, System.EventArgs e)
        {
            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"Software\Imagine Interactive\Gameserver Panel\Games\"+server_game.Items[server_game.SelectedIndex].ToString());
            server_queryPort.Enabled = (key.GetValue("queryPort") != null);
            if (server_queryPort.Enabled)
            {
                server_queryPort.Text = key.GetValue("queryPort").ToString();
            }
            else
            {
                server_queryPort.Text = server_port.Text;
            }
            key.Close();
        }

	}
}
