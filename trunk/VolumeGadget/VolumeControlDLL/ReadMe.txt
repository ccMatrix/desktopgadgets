========================================================================
    AKTIVE VORLAGENBIBLIOTHEK : VolumeControlDLL-Projektübersicht
========================================================================

Der Anwendungs-Assistent hat das VolumeControlDLL-Projekt erstellt, um es als Ausgangspunkt
zum Schreiben Ihrer DLL zu verwenden.

Die Datei enthält eine Zusammenfassung des Inhalts der Dateien für das Projekt.

VolumeControlDLL.vcproj
    Dies ist die Hauptprojektdatei für VC++-Projekte, die vom Anwendungs-Assistenten
    erstellt wird. Sie enthält Informationen über die Version von Visual C++, mit der 
    die Datei generiert wurde, über die Plattformen, Konfigurationen und Projektfeatures,
    die mit dem Anwendungs-Assistenten ausgewählt wurden.

VolumeControlDLL.idl
    Diese Datei enthält die IDL-Definitionen der Typbibliothek, Schnittstellen und Co-Klassen,
    die in Ihrem Projekt definiert sind.
    Diese Datei wird vom MIDL-Compiler verarbeitet, um Folgendes zu generieren:
        C++-Schnittstellendefinitionen und GUID-Deklarationen (VolumeControlDLL.h)
        GUID-Definitionen                                (VolumeControlDLL_i.c)
        Eine Typbibliothek                                  (VolumeControlDLL.tlb)
        Marshalingcode                                 (VolumeControlDLL_p.c und dlldata.c)

VolumeControlDLL.h
    Diese Datei enthält die C++-Schnittstellendefinitionen und GUID-Deklarationen der
    in VolumeControlDLL.idl definierten Elemente. Sie wird von MIDL während der Kompilierung erneut generiert.
VolumeControlDLL.cpp
    Diese Datei enthält die Objekttabelle und die Implementierungen Ihrer DLL-Exporte.
VolumeControlDLL.rc
    Hierbei handelt es sich um eine Auflistung aller Ressourcen von Microsoft Windows, die
 vom Programm verwendet werden.

VolumeControlDLL.def
    Die Moduldefinitionsdatei enthält die Linkerinformationen über die Exporte, die für die
    DLL erforderlich sind. Sie enthält Exporte für:
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
    Die Moduldefinitionsdatei enthält die Linkerinformationen über die Exporte, die für den
    Proxy/Stub erforderlich sind.
/////////////////////////////////////////////////////////////////////////////
