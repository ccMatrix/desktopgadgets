#define MyAppName "Gameserver Gadget"
#define MyAppVer "1.1"
#define MyAppPublisher "Imagine Interactive"
#define MyAppURL "http://www.imagine-interactive.de"

#define ProjectDir "D:\Eigene Dateien\Meine Visual Studio Projekte\GameServerPanel"
#define DLLVersion "Release"

[Setup]
AppName={#MyAppName}
AppVerName={#MyAppName} {#MyAppVer}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
AppID={{2ACF2BC6-0C29-4387-8CAD-89AFA314BAAB}
VersionInfoCompany={#MyAppPublisher}
VersionInfoCopyright=©2006 Imagine Interactive
VersionInfoDescription=Gameserver Gadget for Google Desktop Search
VersionInfoTextVersion={#MyAppVer}
VersionInfoVersion={#MyAppVer}
DefaultDirName={pf}\Gameserver Gadget
DisableDirPage=false
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=false
AllowNoIcons=true
OutputBaseFilename=gameserver_gadget_{#MyAppVer}
OutputDir={#ProjectDir}\installer\Output
Compression=lzma/ultra
SolidCompression=true
SourceDir={#ProjectDir}\bin\{#DLLVersion}
WizardImageFile=compiler:WizModernImage-IS.bmp
WizardSmallImageFile=compiler:WizModernSmallImage-IS.bmp
InfoAfterFile=
InternalCompressLevel=ultra
ShowLanguageDialog=yes
AppVersion={#MyAppVer}
AppContact=Benjamin Schirmer
UninstallDisplayIcon={app}\GameserverPanel.ico
UninstallDisplayName={#MyAppName}


[Languages]
Name: en; MessagesFile: compiler:Default.isl; LicenseFile: {#ProjectDir}\installer\license_en.rtf
Name: de; MessagesFile: compiler:Languages\German.isl; LicenseFile: {#ProjectDir}\installer\license_de.rtf

[CustomMessages]
en.dotNetMissing=You do not have a .NET Framework installed. Please download it from the WindowsUpdate Homepage.
en.GDSMissing=You do not have Google Desktop Search 2 installed. Pleae download it from desktop.google.com.
en.Register=Registering Gameserver Panel with Google Desktop Sidebar
en.UnRegister=Removing Gameserver Panel from Google Desktop Sidebar
en.GDSTooOld=Your Google Desktop Search Version is too old. Please upgrade your version from desktop.google.com.

de.dotNetMissing=Sie haben das .NET Framework nicht installiert. Bitte laden Sie es sich von WidowsUpdate herunter.
de.GDSMissing=Sie haben Google Desktop Search 2 nicht installiert. Bitte laden Sie es sich von desktop.google.com.
de.Register=Registriere Gameserver Panel mit Google Desktop Sidebar
de.UnRegister=Entferne Gameserver Panel von der Google Desktop Sidebar
de.GDSTooOld=Ihre Google Desktop Search Version ist nicht aktuell. Bitte updaten Sie auf die aktuellste Version von desktop.google.com.

[Files]
; Assembly Installer MSI
;Source: {#ProjectDir}\AssemblySetup\Release\AssemblySetup.msi; DestDir: {app}

Source: {#ProjectDir}\installer\Language\*.ini; DestDir: {app}\Language; Flags: ignoreversion

Source: {#ProjectDir}\installer\regsvrnet\bin\Release\regsvrnet.exe; DestDir: {app}; Flags: ignoreversion

;Source: {#ProjectDir}\installer\Files\stdole.dll; DestDir: {app}
Source: {#ProjectDir}\bin\{#DLLVersion}\Interop.GoogleDesktopDisplayLib.dll; DestDir: {app}
Source: {#ProjectDir}\bin\{#DLLVersion}\Interop.GoogleDesktopAPILib.dll; DestDir: {app}
Source: {#ProjectDir}\bin\{#DLLVersion}\Interop.GoogleTalkAPILib.dll; DestDir: {app}
Source: {#ProjectDir}\bin\{#DLLVersion}\Gameserver Panel.dll; DestDir: {app}

;Source: {#ProjectDir}\GameserverPanel.ico; DestDir: {app}
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\info\a2s.txt; DestDir: {app}\qstat\info
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\info\GhostRecon.txt; DestDir: {app}\qstat\info
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\info\Makefile.am; DestDir: {app}\qstat\info
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\info\Makefile.in; DestDir: {app}\qstat\info
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\info\UT2003.txt; DestDir: {app}\qstat\info
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\brocTh.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\brocTp.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\brocTs.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\brocTt.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\ghostreconTh.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\ghostreconTp.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\ghostreconTs.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\ghostreconTt.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\Makefile.am; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\Makefile.in; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\README.txt; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\tribes2th.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\tribes2tp.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\tribes2ts.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\tribes2tt.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\unrealTh.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\unrealTp.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\unrealTs.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\template\unrealTt.html; DestDir: {app}\qstat\template
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\CHANGES.txt; DestDir: {app}\qstat\
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\COMPILE.txt; DestDir: {app}\qstat\
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\LICENSE.txt; DestDir: {app}\qstat\
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\qstat.cfg; DestDir: {app}\qstat\
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\qstat.exe; DestDir: {app}\qstat\
Source: {#ProjectDir}\bin\{#DLLVersion}\qstat\qstatdoc.html; DestDir: {app}\qstat\

[Run]
; Unregister if already registered (for Update Installation)
Filename: {app}\regsvrnet.exe; Parameters: "removeasm ""{app}\Gameserver Panel.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\Gameserver Panel.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
;Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\stdole.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\Interop.GoogleDesktopAPILib.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\Interop.GoogleDesktopDisplayLib.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\Interop.GoogleTalkAPILib.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
;Filename: msiexec; Parameters: "/qn /x ""{app}\AssemblySetup.msi"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden

; Register new Plugin
Filename: {app}\regsvrnet.exe; Parameters: "install ""{app}\Interop.GoogleTalkAPILib.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "install ""{app}\Interop.GoogleDesktopAPILib.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "install ""{app}\Interop.GoogleDesktopDisplayLib.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
;Filename: {app}\regsvrnet.exe; Parameters: "install ""{app}\stdole.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "installasm ""{app}\Gameserver Panel.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "install ""{app}\Gameserver Panel.dll"""; WorkingDir: {app}; StatusMsg: {cm:Register}; Flags: runhidden
;Filename: msiexec; Parameters: "/qn /i ""{app}\AssemblySetup.msi"""; WorkingDir: {app}; StatusMsg: {cm:Register}
Filename: {app}\GameserverGadget.url; WorkingDir: {app}; Flags: shellexec runmaximized; Description: Homepage

[UninstallRun]
; Unregister Plugin for uninstallation
Filename: {app}\regsvrnet.exe; Parameters: "removeasm ""{app}\Gameserver Panel.dll"""; WorkingDir: {app}; StatusMsg: {cm:UnRegister}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\Gameserver Panel.dll"""; WorkingDir: {app}; StatusMsg: {cm:UnRegister}; Flags: runhidden
;Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\stdole.dll"""; WorkingDir: {app}; StatusMsg: {cm:UnRegister}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\Interop.GoogleDesktopAPILib.dll"""; WorkingDir: {app}; StatusMsg: {cm:UnRegister}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\Interop.GoogleDesktopDisplayLib.dll"""; WorkingDir: {app}; StatusMsg: {cm:UnRegister}; Flags: runhidden
Filename: {app}\regsvrnet.exe; Parameters: "remove ""{app}\Interop.GoogleTalkAPILib.dll"""; WorkingDir: {app}; StatusMsg: {cm:UnRegister}; Flags: runhidden
;Filename: msiexec; Parameters: "/qn /x ""{app}\AssemblySetup.msi"""; WorkingDir: {app}; StatusMsg: {cm:UnRegister}; Flags: runhidden

[Registry]
Root: HKLM; Subkey: Software\Imagine Interactive\Gameserver Panel; ValueType: string; ValueName: path; ValueData: {app}; Flags: uninsdeletekey deletevalue
Root: HKLM; Subkey: Software\Imagine Interactive\Gameserver Panel; ValueType: string; ValueName: timerInterval; ValueData: 20; Flags: uninsdeletekey createvalueifdoesntexist
Root: HKLM; Subkey: Software\Imagine Interactive\Gameserver Panel; ValueType: string; ValueName: useTimer; ValueData: 1; Flags: uninsdeletekey deletevalue
Root: HKLM; Subkey: Software\Imagine Interactive\Gameserver Panel; ValueType: string; ValueName: langPath; ValueData: {app}\Language; Flags: uninsdeletekey deletevalue
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Servers; ValueType: string; ValueName: ; ValueData: 1
;Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Servers\Server1; ValueType: string; ValueName: game; ValueData: Counter-Strike Source
;Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Servers\Server1; ValueType: string; ValueName: ip; ValueData: 62.75.178.16
;Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Servers\Server1; ValueType: string; ValueName: port; ValueData: 27015
;Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Servers\Server1; ValueType: string; ValueName: name; ValueData: Der Matrix Clan Server
;Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Servers\Server1; ValueType: string; ValueName: qstat; ValueData: CSS
;Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Servers\Server1; ValueType: string; ValueName: category; ValueData: GameServer
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Categories\GameServer; ValueType: string; ValueData: 1
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games; ValueType: string; ValueName: ; ValueData: 1
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: string; ValueName: columns; ValueData: Player,Ping
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: string; ValueName: command; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: string; ValueName: locate; ValueData: HKLM|SOFTWARE\Electronic Arts\EA Games\Battlefield 2|PATH|InstallDir|Bf2.exe
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: dword; ValueName: needpath; ValueData: $00000001
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: string; ValueName: parameter; ValueData: +joinServer %ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: string; ValueName: qstat; ValueData: GS3
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Battlefield 2; ValueType: string; ValueName: queryPort; ValueData: 29900
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Call of Duty; ValueType: string; ValueName: columns; ValueData: Player,Score,Ping
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Call of Duty; ValueType: string; ValueName: command; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Call of Duty; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Call of Duty; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Call of Duty; ValueType: string; ValueName: locate; ValueData: HKLM|SOFTWARE\Activision\Call of Duty|PATH|InstallPath|CoDMP.exe
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Call of Duty; ValueType: dword; ValueName: needpath; ValueData: $00000001
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Call of Duty; ValueType: string; ValueName: parameter; ValueData: +connect %ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Call of Duty; ValueType: string; ValueName: qstat; ValueData: CODS
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: string; ValueName: command; ValueData: steam://connect/%ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: dword; ValueName: needpath; ValueData: $00000000
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: string; ValueName: ; ValueData: 1
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: string; ValueName: qstat; ValueData: A2S
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: string; ValueName: parameter; ValueData: 
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: string; ValueName: locate; ValueData: HKCU|Software\Valve\Steam\Apps\240|BOOL|Installed
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike Source; ValueType: string; ValueName: columns; ValueData: Player,Score,Time
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike; ValueType: string; ValueName: columns; ValueData: Player,Score,Time
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike; ValueType: string; ValueName: command; ValueData: steam://connect/%ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike; ValueType: string; ValueName: locate; ValueData: HKCU|Software\Valve\Steam\Apps\10|BOOL|Installed
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike; ValueType: string; ValueName: parameter; ValueData: 
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike; ValueType: dword; ValueName: needpath; ValueData: $00000000
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Counter-Strike; ValueType: string; ValueName: qstat; ValueData: CSS
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat; ValueType: string; ValueName: command; ValueData: steam://connect/%ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat; ValueType: string; ValueName: columns; ValueData: Player,Score,Time
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat; ValueType: string; ValueName: locate; ValueData: HKCU|Software\Valve\Steam\Apps\30|BOOL|Installed
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat; ValueType: string; ValueName: parameter; ValueData: 
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat; ValueType: string; ValueName: qstat; ValueData: CSS
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat; ValueType: dword; ValueName: needpath; ValueData: $00000000
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat Source; ValueType: string; ValueName: columns; ValueData: Player,Score,Time
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat Source; ValueType: string; ValueName: command; ValueData: steam://connect/%ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat Source; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat Source; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat Source; ValueType: string; ValueName: locate; ValueData: HKCU|Software\Valve\Steam\Apps\300|BOOL|Installed
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat Source; ValueType: dword; ValueName: needpath; ValueData: $00000000
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat Source; ValueType: string; ValueName: parameter; ValueData: 
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Day of Defeat Source; ValueType: string; ValueName: qstat; ValueData: A2S
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Doom III; ValueType: string; ValueName: columns; ValueData: Player,-,Ping
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Doom III; ValueType: string; ValueName: command; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Doom III; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Doom III; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Doom III; ValueType: string; ValueName: locate; ValueData: HKLM|SOFTWARE\id\doom 3|PATH|InstallPath|Doom3.exe
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Doom III; ValueType: dword; ValueName: needpath; ValueData: $00000001
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Doom III; ValueType: string; ValueName: parameter; ValueData: +connect %ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Doom III; ValueType: string; ValueName: qstat; ValueData: DM3S
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Enemy Territory; ValueType: string; ValueName: columns; ValueData: Player,Score,Ping
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Enemy Territory; ValueType: string; ValueName: command; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Enemy Territory; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Enemy Territory; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Enemy Territory; ValueType: dword; ValueName: needpath; ValueData: $00000001
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Enemy Territory; ValueType: string; ValueName: parameters; ValueData: +connect %ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Enemy Territory; ValueType: string; ValueName: qstat; ValueData: Q3S
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Enemy Territory; ValueType: string; ValueName: locate; ValueData: HKLM|SOFTWARE\Activision\Wolfenstein - Enemy Territory|PATH|InstallPath|ET.exe
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: string; ValueName: ; ValueData: 1
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: string; ValueName: command; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: dword; ValueName: needpath; ValueData: $00000001
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: string; ValueName: qstat; ValueData: GS2
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: string; ValueName: parameter; ValueData: " +join %ip%:%port%"
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: string; ValueName: locate; ValueData: HKLM|SOFTWARE\Monolith Productions\FEARCombat\1.00.0000|PATH|InstallDir|FEARMP.exe
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\F.E.A.R Combat; ValueType: string; ValueName: columns; ValueData: Player,Score,Ping
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Half-Life2 DeathMatch; ValueType: string; ValueName: columns; ValueData: Player,Score,Time
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Half-Life2 DeathMatch; ValueType: string; ValueName: command; ValueData: steam://connect/%ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Half-Life2 DeathMatch; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Half-Life2 DeathMatch; ValueType: string; ValueName: locate; ValueData: HKCU|Software\Valve\Steam\Apps\320|BOOL|Installed
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Half-Life2 DeathMatch; ValueType: string; ValueName: parameter; ValueData: 
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Half-Life2 DeathMatch; ValueType: dword; ValueName: needpath; ValueData: $00000000
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Half-Life2 DeathMatch; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Half-Life2 DeathMatch; ValueType: string; ValueName: qstat; ValueData: A2S
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Natural Selection; ValueType: string; ValueName: columns; ValueData: Player,Score,Time
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Natural Selection; ValueType: string; ValueName: command; ValueData: steam://connect/%ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Natural Selection; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Natural Selection; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Natural Selection; ValueType: string; ValueName: locate; ValueData: HKCU|Software\Valve\Steam\Apps\70_Natural Selection|BOOL|Installed
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Natural Selection; ValueType: dword; ValueName: needpath; ValueData: $00000000
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Natural Selection; ValueType: string; ValueName: parameter; ValueData: 
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Natural Selection; ValueType: string; ValueName: qstat; ValueData: CSS
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Quake4; ValueType: string; ValueName: columns; ValueData: Player,-,Ping
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Quake4; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Quake4; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Quake4; ValueType: dword; ValueName: needpath; ValueData: $00000001
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Quake4; ValueType: string; ValueName: parameter; ValueData: +connect %ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Quake4; ValueType: string; ValueName: qstat; ValueData: Q4S
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Quake4; ValueType: string; ValueName: command; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Quake4; ValueType: string; ValueName: locate; ValueData: HKLM|SOFTWARE\id\Quake 4|PATH|InstallPath|Quake4.exe
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Americas Army; ValueType: string; ValueName: columns; ValueData: Player,Score,Ping
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Americas Army; ValueType: string; ValueName: command; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Americas Army; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Americas Army; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Americas Army; ValueType: string; ValueName: locate; ValueData: HKLM|SOFTWARE\US Army\America's Army\Operations|PATH|InstallDir|System\ArmyOps.exe
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Americas Army; ValueType: string; ValueName: parameter; ValueData: %ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Americas Army; ValueType: dword; ValueName: needpath; ValueData: $00000001
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Americas Army; ValueType: string; ValueName: qstat; ValueData: AMS
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Unreal Tournament 2004; ValueType: string; ValueName: columns; ValueData: Player,Score,Ping,Team
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Unreal Tournament 2004; ValueType: string; ValueName: command; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Unreal Tournament 2004; ValueType: string; ValueName: installPath; ValueData: ; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Unreal Tournament 2004; ValueType: string; ValueName: locate; ValueData: HKLM|SOFTWARE\Unreal Technology\Installed Apps\UT2004|PATH|Folder|System\UT2004.exe
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Unreal Tournament 2004; ValueType: dword; ValueName: isInstalled; ValueData: $00000000; Flags: createvalueifdoesntexist
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Unreal Tournament 2004; ValueType: dword; ValueName: needpath; ValueData: $00000001
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Unreal Tournament 2004; ValueType: string; ValueName: parameter; ValueData: %ip%:%port%
Root: HKLM; SubKey: SOFTWARE\Imagine Interactive\Gameserver Panel\Games\Unreal Tournament 2004; ValueType: string; ValueName: qstat; ValueData: UT2004S

[Icons]
Name: {group}\{cm:UninstallProgram,{#MyAppName}}; Filename: {uninstallexe}

[UninstallDelete]
Name: {app}\Gameserver Panel.tlb; Type: files
Type: files; Name: {app}\GameserverGadget.url

[Dirs]
Name: {app}\qstat
[INI]
Filename: {app}\GameserverGadget.url; Section: InternetShortcut; Key: URL; String: http://www.clan-city.com/desktop_gadget/
[Code]
var
  netpath: String;

procedure DecodeVersion( verstr: String; var verint: array of Integer );
var
  i,p: Integer; s: string;
begin
  // initialize array
  verint := [0,0,0,0];
  i := 0;
  while ( (Length(verstr) > 0) and (i < 4) ) do
  begin
  	p := pos('.', verstr);
  	if p > 0 then
  	begin
      if p = 1 then s:= '0' else s:= Copy( verstr, 1, p - 1 );
  	  verint[i] := StrToInt(s);
  	  i := i + 1;
  	  verstr := Copy( verstr, p+1, Length(verstr));
  	end
  	else
  	begin
  	  verint[i] := StrToInt( verstr );
  	  verstr := '';
  	end;
  end;

end;

// This function compares version string
// return -1 if ver1 < ver2
// return  0 if ver1 = ver2
// return  1 if ver1 > ver2
function CompareVersion( ver1, ver2: String ) : Integer;
var
  verint1, verint2: array of Integer;
  i: integer;
begin

  SetArrayLength( verint1, 4 );
  DecodeVersion( ver1, verint1 );

  SetArrayLength( verint2, 4 );
  DecodeVersion( ver2, verint2 );

  Result := 0; i := 0;
  while ( (Result = 0) and ( i < 4 ) ) do
  begin
  	if verint1[i] > verint2[i] then
  	  Result := 1
  	else
      if verint1[i] < verint2[i] then
  	    Result := -1
  	  else
  	    Result := 0;

  	i := i + 1;
  end;

end;

function initializeSetup(): boolean;
var
  FindRec: TFindRec;
  curPath: String;
  GDVersion: String;
begin
  result := true;
  if FindFirst(ExpandConstant('{win}\microsoft.net\Framework\*'), FindRec) then begin
    try
      repeat
          begin
            curPath := ExpandConstant('{win}\microsoft.net\Framework\')+FindRec.Name;
            if not (FileSearch('IEExec.exe', curPath) = '') then
            begin
              netpath := curPath;
              break;
            end;
          end;
      until not FindNext(FindRec);
    finally
      FindClose(FindRec);
    end;
  end;

  GDVersion := ExpandConstant('{reg:HKLM\SOFTWARE\Google\Google Desktop,installed_version|}');
  if (length(GDVersion) = 0) then
  begin
    MsgBox( CustomMessage('GDSMissing'), mbInformation, MB_OK);
    netpath := 'empty';
    result := false;
  end;

  if (CompareVersion(GDVersion, '3.2005.1208.1655') < 0) then
  begin
    MsgBox( CustomMessage('GDSTooOld'), mbInformation, MB_OK);
    netpath := 'empty';
    result := false;
  end;

  if (length(netpath) = 0) then
  begin
    MsgBox( CustomMessage('dotNetMissing'), mbInformation, MB_OK);
    result := false;
  end;
end;

function getDotNetDir(s: String): String;
begin
  result := netpath;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin

end;
