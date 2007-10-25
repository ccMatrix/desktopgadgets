using System;
using System.Runtime.InteropServices;

namespace GameserverPanel 
{
    [System.ComponentModel.RunInstaller(true)]

    public class PluginInstaller : System.Configuration.Install.Installer 
    {

        public PluginInstaller() 
        {

        }

        public override void Install(System.Collections.IDictionary stateSaver) 
        {

            base.Install (stateSaver);

            RegistrationServices regsrv = new System.Runtime.InteropServices.RegistrationServices();

            if(!regsrv.RegisterAssembly(this.GetType().Assembly,System.Runtime.InteropServices.AssemblyRegistrationFlags.SetCodeBase)) 
            {

                throw new System.Exception("Failed to register object");

            }

        }

        public override void Uninstall(System.Collections.IDictionary savedState) 
        {

            base.Uninstall (savedState);

            RegistrationServices regsrv = new RegistrationServices();

            if(!regsrv.UnregisterAssembly(this.GetType().Assembly)) 
            {

                throw new System.Exception("Failed to unregister object");

            }

        }

    }

}