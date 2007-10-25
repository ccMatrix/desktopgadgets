using System;
using System.Collections.Generic;
using System.Text;

namespace VistaGamesExecutable
{
    class Game
    {
        private String gameName = "";
        private String gameIcon = "";
        private String gameExe = "";
        private String gameBoxArt="";

        #region get/set Methods
        public String name
        {
            get
            {
                return gameName;
            }
            set
            {
                gameName = value;
            }
        }
        public String icon
        {
            get
            {
                return gameIcon;
            }
            set
            {
                gameIcon = value;
            }
        }
        public String exe
        {
            get
            {
                return gameExe;
            }
            set
            {
                gameExe = value;
            }
        }
        public String boxArt
        {
            get
            {
                return gameBoxArt;
            }
            set
            {
                gameBoxArt = value;
            }
        }
        #endregion

        public string toJSON()
        {
            String res = "\"Name\": \"{0}\", \"Icon\": \"{1}\", \"Exe\": \"{2}\", \"BoxArt\": \"{3}\"";
            String name = gameName.Replace(@"\", @"\\");
            String icon = gameIcon.Replace(@"\", @"\\");
            String exe = gameExe.Replace(@"\", @"\\");
            String boxArt = gameBoxArt.Replace(@"\", @"\\");
            res = String.Format(res, name, icon, exe, boxArt);
            res = "{" + res + "}";
            return res;
        }
    }
}
