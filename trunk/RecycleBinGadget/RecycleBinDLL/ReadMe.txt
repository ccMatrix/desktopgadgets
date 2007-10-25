========================================================================
    AKTIVE VORLAGENBIBLIOTHEK : RecycleBinDLL-Projekt�bersicht
========================================================================

Der Anwendungs-Assistent hat das RecycleBinDLL-Projekt erstellt, um es als Ausgangspunkt
zum Schreiben Ihrer DLL zu verwenden.

Die Datei enth�lt eine Zusammenfassung des Inhalts der Dateien f�r das Projekt.

RecycleBinDLL.vcproj
    Dies ist die Hauptprojektdatei f�r VC++-Projekte, die vom Anwendungs-Assistenten
    erstellt wird. Sie enth�lt Informationen �ber die Version von Visual C++, mit der 
    die Datei generiert wurde, �ber die Plattformen, Konfigurationen und Projektfeatures,
    die mit dem Anwendungs-Assistenten ausgew�hlt wurden.

RecycleBinDLL.idl
    Diese Datei enth�lt die IDL-Definitionen der Typbibliothek, Schnittstellen und Co-Klassen,
    die in Ihrem Projekt definiert sind.
    Diese Datei wird vom MIDL-Compiler verarbeitet, um Folgendes zu generieren:
        C++-Schnittstellendefinitionen und GUID-Deklarationen (RecycleBinDLL.h)
        GUID-Definitionen                                (RecycleBinDLL_i.c)
        Eine Typbibliothek                                  (RecycleBinDLL.tlb)
        Marshalingcode                                 (RecycleBinDLL_p.c und dlldata.c)

RecycleBinDLL.h
    Diese Datei enth�lt die C++-Schnittstellendefinitionen und GUID-Deklarationen der
    in RecycleBinDLL.idl definierten Elemente. Sie wird von MIDL w�hrend der Kompilierung erneut generiert.
RecycleBinDLL.cpp
    Diese Datei enth�lt die Objekttabelle und die Implementierungen Ihrer DLL-Exporte.
RecycleBinDLL.rc
    Hierbei handelt es sich um eine Auflistung aller Ressourcen von Microsoft Windows, die
 vom Programm verwendet werden.

RecycleBinDLL.def
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
    mit der Bezeichnung RecycleBinDLL.pch und eine vorkompilierte Typdatei mit der Bezeichnung StdAfx.obj erstellt.

Resource.h
    Dies ist die Standardheaderdatei, die neue Ressourcen-IDs definiert.

/////////////////////////////////////////////////////////////////////////////
Proxy/Stub-DLL-Projekt und Moduldefinitionsdatei:

RecycleBinDLLps.vcproj
    Dies ist die Projektdatei zum Erstellen einer Proxy/Stub-DLL.
	Die IDL-Datei im Hauptprojekt muss mindestens eine Schnittstelle enthalten. Die IDL-Datei 
	muss vor dem Erstellen der Proxy/Stub-DLL kompiliert werden, um dlldata.c,	 RecycleBinDLL_i.c und RecycleBinDLL_p.c zu generieren, die zum
	Erstellen der DLL erforderlich sind.

RecycleBinDLLps.def
    Die Moduldefinitionsdatei enth�lt die Linkerinformationen �ber die Exporte, die f�r den
    Proxy/Stub erforderlich sind.
/////////////////////////////////////////////////////////////////////////////
