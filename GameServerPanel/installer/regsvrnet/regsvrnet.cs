using System;
using System.Runtime.InteropServices;
using System.EnterpriseServices.Internal;
using System.Reflection;
using System.IO;

namespace regsvrnet
{
	/// <summary>
	/// Zusammenfassung für registerclass.
	/// </summary>
	class registerclass
	{
		/// <summary>
		/// Der Haupteinstiegspunkt für die Anwendung.
		/// </summary>
		[STAThread]
		static void Main(string[] args)
		{
            //System.Console.Out.WriteLine("arguments: "+args.Length);

            try
            {
                if (args.Length == 2) 
                {
                    Publish p = new Publish();
                    if (args[0] == "install") 
                    {
                        System.Console.Out.WriteLine("Registering {0} into GAC", args[1]);
                        p.GacInstall(args[1]);
                    }
                    else if (args[0] == "remove") 
                    {
                        System.Console.Out.WriteLine("Removing {0} from GAC", args[1]);
                        p.GacRemove(args[1]);
                    }           
                    else if (args[0] == "installasm") 
                    {
                        System.Console.Out.WriteLine("Registering Assembly {0}", args[1]);
                        RegistrationServices regsrv = new System.Runtime.InteropServices.RegistrationServices();
                        Assembly ass = Assembly.LoadFrom(args[1]);
                        regsrv.RegisterAssembly( ass,
                            System.Runtime.InteropServices.AssemblyRegistrationFlags.SetCodeBase); 
                        //p.RegisterAssembly(args[1]);
                    }
                    else if (args[0] == "removeasm") 
                    {
                        System.Console.Out.WriteLine("Removing Assembly {0}", args[1]);
                        RegistrationServices regsrv = new System.Runtime.InteropServices.RegistrationServices();
                        Assembly ass = Assembly.LoadFrom(args[1]);
                        regsrv.UnregisterAssembly( ass ); 
                        //p.UnRegisterAssembly(args[1]);
                    }
					else 
					{
						displayUsage();
					}
                }
                else 
                {
                    displayUsage();
                }
            }
            catch (Exception E) {
                String s = "Error "+E.Source+" while "+args[0]+" "+args[1]+": "+E.Message;
                s = DateTime.Now.ToString()+" "+s;
                System.Console.Out.WriteLine(s);
            }
		}

		public static void displayUsage()
		{
			System.Console.Out.WriteLine("Usage:");
			System.Console.Out.WriteLine("install assembly.dll\t\tRegister file into GAC");
			System.Console.Out.WriteLine("remove assembly.dll\t\tRemove file from GAC");
			System.Console.Out.WriteLine("installasm assembly.dll\t\tRegister Assembly");
			System.Console.Out.WriteLine("removeasm assembly.dll\t\tRemove Assembly");
		}
	}
}
