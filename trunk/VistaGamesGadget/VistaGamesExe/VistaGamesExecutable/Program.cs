using System;
using System.Collections.Generic;
using System.Windows.Forms;
using System.Threading;
using Microsoft.Win32;
using System.IO;
using Common;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Reflection;
using System.Text;
using System.Xml;
using System.Drawing.Imaging;
using Utility.IO.ShellLink;

namespace VistaGamesExecutable
{
    static class Program
    {
        private static String outFolder = "";
        /// <summary>
        /// Der Haupteinstiegspunkt für die Anwendung.
        /// </summary>
        [STAThread]
        static int Main(string[] args)
        {
            if (args.Length == 0) return 1;

            String outputFile = args[0];
            Console.WriteLine("Output is: " + outputFile);
            FileInfo fi = new FileInfo(outputFile);
            outFolder = fi.DirectoryName;

            RegistryKey key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameUX");
            String[] subKeys = key.GetSubKeyNames();
            Game[] gameList = new Game[0];
            foreach (String subKey in subKeys)
            {
                RegistryKey sKey = key.OpenSubKey(subKey);
                String[] gameKeys = sKey.GetSubKeyNames();
                Game[] games = new Game[gameKeys.Length];
                for (int i = 0; i < gameKeys.Length; i++ )
                {
                    String gameKey = gameKeys[i];
                    RegistryKey gKey = sKey.OpenSubKey(gameKey);
                    games[i] = getGameData(gKey);
                    gKey.Close();
                }
                int addAt = gameList.Length;
                Array.Resize<Game>(ref gameList, gameList.Length+games.Length);
                games.CopyTo(gameList, addAt);
                sKey.Close();
            }
            key.Close();

            Console.WriteLine("Scanned " + gameList.Length + " Games");

            String outJson = "[";
            for (int i=0; i<gameList.Length; i++)
            {
                Game g = gameList[i];
                if (g == null) continue;
                outJson += g.toJSON();
                if (i < gameList.Length - 1)
                {
                    outJson += ",";
                }
            }
            outJson += "]";
            //Console.WriteLine(outJson);
            StreamWriter strm = File.CreateText(outputFile);
            strm.Write(outJson);
            strm.Close();

            return 0;
        }

        private static void getShellIconAsImage(String location, out System.Drawing.Bitmap result)
        {
            if (!File.Exists(location))
            {
                result = new Bitmap(32, 32);
                return;
            }
            SHFILEINFO shinfo = new SHFILEINFO();

            uint iconType = 0;

            iconType = Win32.SHGFI_LARGEICON | Win32.SHGFI_SHELLICONSIZE;

            IntPtr hImgSmall = Win32.SHGetFileInfo(location,
                0,
                ref shinfo,
                (uint)Marshal.SizeOf(shinfo),
                Win32.SHGFI_ICON | iconType);

            result = Bitmap.FromHicon(shinfo.hIcon);

            Win32.DestroyIcon(shinfo.hIcon);
            Win32.DestroyIcon(shinfo.iIcon);
            Win32.DestroyIcon(hImgSmall);
            iconType = 0;

            /*Color c;
            Color t = Color.FromArgb(0, 0, 0, 0);

            for (int x = 0; x < result.Width; x++)
            {
                for (int y = 0; y < result.Height; y++)
                {
                    c = result.GetPixel(x, y);
                    if (c == t)
                        result.SetPixel(x, y, Color.Pink);
                }
            }*/
        }

        private static Game getGameData(RegistryKey gKey)
        {
            Game result = new Game();
            String guid = (String)gKey.GetValue("ApplicationId");
            result.name = (String)gKey.GetValue("Title");
            String outIcon = outFolder + @"\" + guid + ".png";

            // Retrieve Path for executable
            String exePath = "";
            if (gKey.GetValue("AppExePath") != null)
            {
                exePath = (String)gKey.GetValue("AppExePath");
                if (!File.Exists(exePath))
                {
                    exePath = (String)gKey.GetValue("ConfigApplicationPath") + @"\" + (String)gKey.GetValue("AppExePath");
                }
            }
            if (!File.Exists(exePath))
            {
                String exeFile = getExecutablePathFromGDF((String)gKey.GetValue("ConfigGDFBinaryPath"));
                exePath = (String)gKey.GetValue("ConfigApplicationPath") + @"\" + exeFile;
                exePath = exePath.Replace(@"\\", @"\");
                //Console.WriteLine("GDF File: " + exePath);
            }
            if (!File.Exists(exePath))
            {
                return null;// throw new NotSupportedException();
            }
            result.exe = exePath;

            // Get Icon for Game
            //if (!File.Exists(outIcon))
            {
                FileInfo fi = new FileInfo(exePath);
                if (fi.Extension.ToLower() == ".lnk")
                {
                    String iconPath = "";
                    ShellShortcut fileShortcut = new ShellShortcut(exePath);
                    if (fileShortcut.Icon != null)
                    {
                        Bitmap bmp = new Bitmap(32, 32);
                        Graphics g = Graphics.FromImage(bmp);
                        g.DrawIcon(fileShortcut.Icon, 0, 0);
                        bmp.Save(outIcon, ImageFormat.Png);
                        bmp.Dispose();
                        g.Dispose();
                    }
                    else
                    {
                        iconPath = fileShortcut.IconPath;
                        // GetIconPath from link file
                        Bitmap bmp = new Bitmap(32, 32);
                        getShellIconAsImage(iconPath, out bmp);
                        bmp.Save(outIcon, ImageFormat.Png);
                        bmp.Dispose();
                    }
                }
                else
                {
                    Bitmap bmp = new Bitmap(32, 32);
                    getShellIconAsImage(exePath, out bmp);
                    bmp.Save(outIcon, ImageFormat.Png);
                    bmp.Dispose();
                }
            }
            result.icon = outIcon;

            // Get BoxArt from registry if available
            // Loading the thumbnail from resource is not available yet
            if (gKey.GetValue("BoxArt") != null)
            {
                result.boxArt = (String)gKey.GetValue("BoxArt");
            }
            return result;
        }

        private static string getExecutablePathFromGDF(string p)
        {
            if (!File.Exists(p)) return "";
            IntPtr hModuleInstance = Kernel32.LoadLibraryEx(p, IntPtr.Zero, Kernel32.LOAD_LIBRARY_AS_DATAFILE);
            //Console.WriteLine("Scanning: " + p);
            IntPtr hXmlResource = Kernel32.FindResource(hModuleInstance, "__GDF_XML", "DATA");

            // get its size
            uint resourceSize = Kernel32.SizeofResource(hModuleInstance, hXmlResource);

            // load the resource
            IntPtr resourceData = Kernel32.LoadResource(hModuleInstance, hXmlResource);

            // copy the resource data into a byte array so we
            // still have a copy once the resource is freed
            byte[] uiBytes = new byte[resourceSize];
            GCHandle gcHandle = GCHandle.Alloc(uiBytes, GCHandleType.Pinned);
            IntPtr firstCopyElement = Marshal.UnsafeAddrOfPinnedArrayElement(uiBytes, 0);
            Kernel32.CopyMemory(firstCopyElement, resourceData, resourceSize);

            // free the resource
            gcHandle.Free();
            Kernel32.FreeResource(resourceData);
            Kernel32.FreeLibrary(hModuleInstance);

            // convert the char array to an ansi string
            String s = Marshal.PtrToStringAnsi(firstCopyElement, (int)resourceSize);
            Int32 initial = (Int32)s[1];
            XmlDocument xml = new XmlDocument();
            if (initial == 187)
            {
                s = s.Substring( s.IndexOf("<") );
            }
            else if (initial == 254)
            {
                s = s.Replace("\0", "");
                s = s.Substring(s.IndexOf("<"));
            }
            // Console.WriteLine(s);
            xml.LoadXml(s);

            String exeFile = "";
            try
            {
                XmlNodeList gameExecutabels = xml.GetElementsByTagName("GameExecutable");
                XmlElement element = (XmlElement)gameExecutabels[0];
                exeFile = element.Attributes["path"].Value;
            }
            catch
            {
                exeFile = "";
            }

            Kernel32.FreeLibrary(hModuleInstance);
            return exeFile;
        }
    }
}