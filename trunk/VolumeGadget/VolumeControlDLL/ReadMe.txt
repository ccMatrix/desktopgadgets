========================================================================
    AKTIVE VORLAGENBIBLIOTHEK : VolumeControlDLL-Projekt�bersicht
========================================================================

Der Anwendungs-Assistent hat das VolumeControlDLL-Projekt erstellt, um es als Ausgangspunkt
zum Schreiben Ihrer DLL zu verwenden.

Die Datei enth�lt eine Zusammenfassung des Inhalts der Dateien f�r das Projekt.

VolumeControlDLL.vcproj
    Dies ist die Hauptprojektdatei f�r VC++-Projekte, die vom Anwendungs-Assistenten
    erstellt wird. Sie enth�lt Informationen �ber die Version von Visual C++, mit der 
    die Datei generiert wurde, �ber die Plattformen, Konfigurationen und Projektfeatures,
    die mit dem Anwendungs-Assistenten ausgew�hlt wurden.

VolumeControlDLL.idl
    Diese Datei enth�lt die IDL-Definitionen der Typbibliothek, Schnittstellen und Co-Klassen,
    die in Ihrem Projekt definiert sind.
    Diese Datei wird vom MIDL-Compiler verarbeitet, um Folgendes zu generieren:
        C++-Schnittstellendefinitionen und GUID-Deklarationen (VolumeControlDLL.h)
        GUID-Definitionen                                (VolumeControlDLL_i.c)
        Eine Typbibliothek                                  (VolumeControlDLL.tlb)
        Marshalingcode                                 (VolumeControlDLL_p.c und dlldata.c)

VolumeControlDLL.h
    Diese Datei enth�lt die C++-Schnittstellendefinitionen und GUID-Deklarationen der
    in VolumeControlDLL.idl definierten Elemente. Sie wird von MIDL w�hrend der Kompilierung erneut generiert.
VolumeControlDLL.cpp
    Diese Datei enth�lt die Objekttabelle und die Implementierungen Ihrer DLL-Exporte.
VolumeControlDLL.rc
    Hierbei handelt es sich um eine Auflistung aller Ressourcen von Microsoft Windows, die
 vom Programm verwendet werden.

VolumeControlDLL.def
    Die Moduldefinitionsdatei enth�lt die Linkerinformationen �ber die Exporte, die f�r die
    DLL erforderlich sind. Sie enth�lt Exporte f�r:
        DllGetClassObject  
        DllCanUnloadNow    
        GetProxyDllInfo    
        DllRegisterServer	
        DllUnregisterServer

/////////////////////////////////////////////////////////////////////////////
Weitere Standarddateien:

StdAfx.h, StdAfx.cpp
    Mit diesen Dateien werden vorkompilierte Headerdateien (PCH)
    mit der Bezeichnung VolumeControlDLL.pch und eine vorkompilierte Typdatei mit der Bezeichnung StdAfx.obj erstellt.

Resource.h
    Dies ist die Standardheaderdatei, die neue Ressourcen-IDs definiert.

/////////////////////////////////////////////////////////////////////////////
Proxy/Stub-DLL-Projekt und Moduldefinitionsdatei:

VolumeControlDLLps.vcproj
    Dies ist die Projektdatei zum Erstellen einer Proxy/Stub-DLL.
	Die IDL-Datei im Hauptprojekt muss mindestens eine Schnittstelle enthalten. Die IDL-Datei 
	muss vor dem Erstellen der Proxy/Stub-DLL kompiliert werden, um dlldata.c,	 VolumeControlDLL_i.c und VolumeControlDLL_p.c zu generieren, die zum
	Erstellen der DLL erforderlich sind.

VolumeControlDLLps.def
    Die Moduldefinitionsdatei enth�lt die Linkerinformationen �ber die Exporte, die f�r den
    Proxy/Stub erforderlich sind.
/////////////////////////////////////////////////////////////////////////////
