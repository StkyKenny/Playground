
cd /d "%USERPROFILE%\Desktop\CLEAN PLAYGROUND\backwork"
powershell -NoProfile -Command "Get-Process | Where-Object {$_.MainWindowTitle} | Select-Object ProcessName,MainWindowTitle"

::pause

net start mongodb

set "APP_TITLE=STKY | Backwork"

cscript "%~f0?.wsf"
if %ERRORLEVEL%==0 exit

title Backwork_terminal

::pause
:: Launch the app
java -jar target/backwork-0.0.1-SNAPSHOT.jar
:: mvn compile exec:java -Dexec.mainClass="me.stky.backwork.BackworkApplication"

exit /b

<job id="ActivateWindow">
<script language="VBScript">
Set sh = CreateObject("WScript.Shell")

If  sh.AppActivate("STKY | Backwork") Then
    sh.SendKeys ""
    WScript.Echo("Found application with title ")
    WScript.Quit(0)
Else
    WScript.Echo("Failed to find application with title ")
    WScript.Quit(1)
End If
</script>
</job>