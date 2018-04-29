:init
@echo off
FOR /F "tokens=* USEBACKQ" %%i IN (`..\..\..\node_modules\electron\dist\electron.exe --version`) DO (
  SET ELECTRON_VERSION=%%i
)
echo "Electron Version: %ELECTRON_VERSION%"

:build
@echo on
call node-gyp rebuild --python=C:\Python27 --target=%ELECTRON_VERSION% --arch=ia32 --dist-url=https://atom.io/download/electron
copy /Y .\build\Release\addon.node .\win32-ia32.node

call node-gyp rebuild --python=C:\Python27 --target=%ELECTRON_VERSION% --arch=x64 --dist-url=https://atom.io/download/electron
copy /Y .\build\Release\addon.node .\win32-x64.node

:exit
