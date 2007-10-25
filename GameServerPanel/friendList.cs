using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using GoogleDesktopDisplayLib;

namespace GameserverPanel
{
	/// <summary>
	/// Zusammenfassung für friendList.
	/// </summary>
	public class friendList : System.Windows.Forms.Form
	{
        private System.Windows.Forms.Label label;
        public System.Windows.Forms.CheckedListBox friends;
        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.Button btnCancel;
        public Object dataObject;

        private String game;
        private String ip;
        private int port;
        public System.Windows.Forms.CheckBox labelSendText;

		/// <summary>
		/// Erforderliche Designervariable.
		/// </summary>
		private System.ComponentModel.Container components = null;

		public friendList(Object[] talkFriends, String s_game, String s_ip, int s_port )
		{
			//
			// Erforderlich für die Windows Form-Designerunterstützung
			//
			InitializeComponent();

			//
			// TODO: Fügen Sie den Konstruktorcode nach dem Aufruf von InitializeComponent hinzu
			//
            friends.Items.Clear();
            for (int i=0; i<talkFriends.Length; i++) 
            {
                IGoogleDesktopTalkFriend friend = (IGoogleDesktopTalkFriend)talkFriends[i];
                if (friend.has_sidebar)
                {
                    friends.Items.Add( friend.name + " (Sidebar) \n"+friend.user_id+"\ntrue");
                }
                else
                {
                    friends.Items.Add( friend.name + " (Chat) \n"+friend.user_id+"\nfalse");
                }
            }
            this.game = s_game;
            this.ip = s_ip;
            this.port = s_port;
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
            this.label = new System.Windows.Forms.Label();
            this.friends = new System.Windows.Forms.CheckedListBox();
            this.btnOK = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.labelSendText = new System.Windows.Forms.CheckBox();
            this.SuspendLayout();
            // 
            // label
            // 
            this.label.Location = new System.Drawing.Point(8, 8);
            this.label.Name = "label";
            this.label.Size = new System.Drawing.Size(280, 56);
            this.label.TabIndex = 0;
            // 
            // friends
            // 
            this.friends.BackColor = System.Drawing.SystemColors.Control;
            this.friends.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.friends.Location = new System.Drawing.Point(8, 64);
            this.friends.Name = "friends";
            this.friends.Size = new System.Drawing.Size(280, 135);
            this.friends.TabIndex = 1;
            // 
            // btnOK
            // 
            this.btnOK.Location = new System.Drawing.Point(120, 224);
            this.btnOK.Name = "btnOK";
            this.btnOK.TabIndex = 2;
            this.btnOK.Text = "OK";
            this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btnCancel.Location = new System.Drawing.Point(208, 224);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.TabIndex = 3;
            this.btnCancel.Text = "Abbrechen";
            // 
            // labelSendText
            // 
            this.labelSendText.Location = new System.Drawing.Point(8, 200);
            this.labelSendText.Name = "labelSendText";
            this.labelSendText.Size = new System.Drawing.Size(280, 24);
            this.labelSendText.TabIndex = 4;
            this.labelSendText.Text = "Als Textnachricht senden";
            // 
            // friendList
            // 
            this.AcceptButton = this.btnOK;
            this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
            this.CancelButton = this.btnCancel;
            this.ClientSize = new System.Drawing.Size(292, 254);
            this.Controls.Add(this.labelSendText);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnOK);
            this.Controls.Add(this.friends);
            this.Controls.Add(this.label);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "friendList";
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Freunde";
            this.TopMost = true;
            this.Load += new System.EventHandler(this.friendList_Load);
            this.ResumeLayout(false);

        }
		#endregion

        private void btnOK_Click(object sender, System.EventArgs e)
        {
            this.DialogResult = DialogResult.OK;
        }

        private void friendList_Load(object sender, System.EventArgs e)
        {
            label.Text = String.Format((dataObject as GameserverPlugin).lang.getValue("friendsText"), this.game, this.ip, this.port);
            btnOK.Text = (dataObject as GameserverPlugin).lang.getValue("buttonOk");
            btnCancel.Text = (dataObject as GameserverPlugin).lang.getValue("buttonCancel");
            labelSendText.Text = (dataObject as GameserverPlugin).lang.getValue("friendsTextmode");
        }
	}
}
