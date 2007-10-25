using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;

namespace GameserverPanel
{
	/// <summary>
	/// Zusammenfassung für ServerDetails.
	/// </summary>
	public class ServerDetails : System.Windows.Forms.Form
	{
        public System.Windows.Forms.Panel serverPanel;
        public System.Windows.Forms.PictureBox serverPic;
        public System.Windows.Forms.Label serverStats;
        public System.Windows.Forms.Label serverMap;
        public System.Windows.Forms.Label serverType;
        public System.Windows.Forms.Label serverName;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage tabPage1;
        private System.Windows.Forms.TabPage tabPage2;
        public System.Windows.Forms.ListView serverPlayers;
        public System.Windows.Forms.ColumnHeader columnID;
        public System.Windows.Forms.ColumnHeader columnName;
        public System.Windows.Forms.ColumnHeader columnPing;
        public System.Windows.Forms.ColumnHeader columnScore;
        private System.Windows.Forms.ColumnHeader ruleName;
        private System.Windows.Forms.ColumnHeader ruleValue;
        public System.Windows.Forms.ListView serverRules;
		/// <summary>
		/// Erforderliche Designervariable.
		/// </summary>
		private System.ComponentModel.Container components = null;

		public ServerDetails()
		{
			//
			// Erforderlich für die Windows Form-Designerunterstützung
			//
			InitializeComponent();

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
            this.serverPanel = new System.Windows.Forms.Panel();
            this.serverPic = new System.Windows.Forms.PictureBox();
            this.serverStats = new System.Windows.Forms.Label();
            this.serverMap = new System.Windows.Forms.Label();
            this.serverType = new System.Windows.Forms.Label();
            this.serverName = new System.Windows.Forms.Label();
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.tabPage1 = new System.Windows.Forms.TabPage();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.serverPlayers = new System.Windows.Forms.ListView();
            this.columnID = new System.Windows.Forms.ColumnHeader();
            this.columnName = new System.Windows.Forms.ColumnHeader();
            this.columnPing = new System.Windows.Forms.ColumnHeader();
            this.columnScore = new System.Windows.Forms.ColumnHeader();
            this.serverRules = new System.Windows.Forms.ListView();
            this.ruleName = new System.Windows.Forms.ColumnHeader();
            this.ruleValue = new System.Windows.Forms.ColumnHeader();
            this.serverPanel.SuspendLayout();
            this.tabControl1.SuspendLayout();
            this.tabPage1.SuspendLayout();
            this.tabPage2.SuspendLayout();
            this.SuspendLayout();
            // 
            // serverPanel
            // 
            this.serverPanel.BackColor = System.Drawing.Color.White;
            this.serverPanel.Controls.Add(this.tabControl1);
            this.serverPanel.Controls.Add(this.serverPic);
            this.serverPanel.Controls.Add(this.serverStats);
            this.serverPanel.Controls.Add(this.serverMap);
            this.serverPanel.Controls.Add(this.serverType);
            this.serverPanel.Controls.Add(this.serverName);
            this.serverPanel.Location = new System.Drawing.Point(4, 7);
            this.serverPanel.Name = "serverPanel";
            this.serverPanel.Size = new System.Drawing.Size(364, 352);
            this.serverPanel.TabIndex = 1;
            // 
            // serverPic
            // 
            this.serverPic.Location = new System.Drawing.Point(8, 8);
            this.serverPic.Name = "serverPic";
            this.serverPic.Size = new System.Drawing.Size(96, 88);
            this.serverPic.TabIndex = 10;
            this.serverPic.TabStop = false;
            // 
            // serverStats
            // 
            this.serverStats.BackColor = System.Drawing.Color.White;
            this.serverStats.Location = new System.Drawing.Point(108, 32);
            this.serverStats.Name = "serverStats";
            this.serverStats.Size = new System.Drawing.Size(200, 16);
            this.serverStats.TabIndex = 6;
            this.serverStats.Text = "120ms (20/50 Spieler)";
            // 
            // serverMap
            // 
            this.serverMap.BackColor = System.Drawing.Color.White;
            this.serverMap.Location = new System.Drawing.Point(108, 80);
            this.serverMap.Name = "serverMap";
            this.serverMap.Size = new System.Drawing.Size(200, 16);
            this.serverMap.TabIndex = 8;
            this.serverMap.Text = "Map: de_dust";
            // 
            // serverType
            // 
            this.serverType.BackColor = System.Drawing.Color.White;
            this.serverType.Location = new System.Drawing.Point(108, 56);
            this.serverType.Name = "serverType";
            this.serverType.Size = new System.Drawing.Size(200, 16);
            this.serverType.TabIndex = 7;
            this.serverType.Text = "Spieltyp: Deathmatch";
            // 
            // serverName
            // 
            this.serverName.BackColor = System.Drawing.Color.White;
            this.serverName.Location = new System.Drawing.Point(108, 8);
            this.serverName.Name = "serverName";
            this.serverName.Size = new System.Drawing.Size(240, 16);
            this.serverName.TabIndex = 5;
            this.serverName.Text = "Der Matrix Clan Server";
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.tabPage1);
            this.tabControl1.Controls.Add(this.tabPage2);
            this.tabControl1.Location = new System.Drawing.Point(8, 96);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(352, 232);
            this.tabControl1.TabIndex = 11;
            this.tabControl1.SelectedIndexChanged += new System.EventHandler(this.tabControl1_SelectedIndexChanged);
            // 
            // tabPage1
            // 
            this.tabPage1.Controls.Add(this.serverPlayers);
            this.tabPage1.Location = new System.Drawing.Point(4, 22);
            this.tabPage1.Name = "tabPage1";
            this.tabPage1.Size = new System.Drawing.Size(344, 206);
            this.tabPage1.TabIndex = 0;
            this.tabPage1.Text = "Players";
            // 
            // tabPage2
            // 
            this.tabPage2.Controls.Add(this.serverRules);
            this.tabPage2.Location = new System.Drawing.Point(4, 22);
            this.tabPage2.Name = "tabPage2";
            this.tabPage2.Size = new System.Drawing.Size(344, 206);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "Rules";
            // 
            // serverPlayers
            // 
            this.serverPlayers.BackColor = System.Drawing.Color.White;
            this.serverPlayers.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.serverPlayers.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
                                                                                            this.columnID,
                                                                                            this.columnName,
                                                                                            this.columnPing,
                                                                                            this.columnScore});
            this.serverPlayers.FullRowSelect = true;
            this.serverPlayers.HeaderStyle = System.Windows.Forms.ColumnHeaderStyle.Nonclickable;
            this.serverPlayers.Location = new System.Drawing.Point(0, 0);
            this.serverPlayers.Name = "serverPlayers";
            this.serverPlayers.Size = new System.Drawing.Size(344, 208);
            this.serverPlayers.TabIndex = 10;
            this.serverPlayers.View = System.Windows.Forms.View.Details;
            // 
            // columnID
            // 
            this.columnID.Text = "#";
            this.columnID.Width = 25;
            // 
            // columnName
            // 
            this.columnName.Text = "Spieler";
            this.columnName.Width = 200;
            // 
            // columnPing
            // 
            this.columnPing.Text = "Ping";
            this.columnPing.Width = 56;
            // 
            // columnScore
            // 
            this.columnScore.Text = "Score";
            // 
            // serverRules
            // 
            this.serverRules.BackColor = System.Drawing.Color.White;
            this.serverRules.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.serverRules.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
                                                                                          this.ruleName,
                                                                                          this.ruleValue});
            this.serverRules.FullRowSelect = true;
            this.serverRules.HeaderStyle = System.Windows.Forms.ColumnHeaderStyle.Nonclickable;
            this.serverRules.Location = new System.Drawing.Point(0, -1);
            this.serverRules.Name = "serverRules";
            this.serverRules.Size = new System.Drawing.Size(344, 208);
            this.serverRules.TabIndex = 11;
            this.serverRules.View = System.Windows.Forms.View.Details;
            // 
            // ruleName
            // 
            this.ruleName.Text = "Name";
            this.ruleName.Width = 100;
            // 
            // ruleValue
            // 
            this.ruleValue.Text = "Value";
            this.ruleValue.Width = 238;
            // 
            // ServerDetails
            // 
            this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
            this.ClientSize = new System.Drawing.Size(368, 366);
            this.Controls.Add(this.serverPanel);
            this.Name = "ServerDetails";
            this.Text = "ServerDetails";
            this.Load += new System.EventHandler(this.ServerDetails_Load);
            this.serverPanel.ResumeLayout(false);
            this.tabControl1.ResumeLayout(false);
            this.tabPage1.ResumeLayout(false);
            this.tabPage2.ResumeLayout(false);
            this.ResumeLayout(false);

        }
		#endregion

        private void label2_Click(object sender, System.EventArgs e)
        {
        
        }

        private void playerDetails_SelectedIndexChanged(object sender, System.EventArgs e)
        {
        
        }

        private void ServerDetails_Load(object sender, System.EventArgs e)
        {
        
        }

        private void tabControl1_SelectedIndexChanged(object sender, System.EventArgs e)
        {
        
        }
	}
}
