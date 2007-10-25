@echo off
"C:\Programme\Inno Setup 5\ISCC.exe" "D:\Eigene Dateien\Meine Visual Studio Projekte\GameServerPanel\\installer\GameserverSetup.iss"
if errorlevel 1 goto CSharpReportError
goto CSharpEnd
:CSharpReportError
echo Project error: Ein Tool hat einen Fehlercode des Buildereignisses zurÅckgegeben.
exit 1
:CSharpEnd