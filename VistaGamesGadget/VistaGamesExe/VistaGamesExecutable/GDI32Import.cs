using System;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;

namespace VistaGamesExecutable
{
    class GDI32
    {
        [DllImport("gdi32.dll")]
        public static extern bool GdiFlush();
    }
}
