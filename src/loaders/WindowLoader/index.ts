import electron from 'electron'
import path from 'path';
import url from 'url';
import BrowserWindow = electron.BrowserWindow;
import MenuItemConstructorOptions = electron.MenuItemConstructorOptions;
import app = electron.app;
import Menu = electron.Menu;
import evaSpace from "../../evaspace";

const template: MenuItemConstructorOptions[] = [
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() {
                    require('electron').shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    })
}

function createMainWindow(): BrowserWindow {
    return new BrowserWindow({
        x: 0, y: 0, width: 0, height: 0, show: false, focusable: false, frame: false,
        titleBarStyle: 'customButtonsOnHover',
        transparent: true
    })
}

function createEvaWindow(width = 500, height = 60, opacity = 1): BrowserWindow {
    // Create the browser window.
    const x = (electron.screen.getPrimaryDisplay().workAreaSize.width / 2 - width / 2).toFixed(0);
    const y = 90;

    const evaWindow = new BrowserWindow({
        alwaysOnTop: true,
        x: +x,
        y: +y,
        width,
        height,
        opacity,
        // transparent: true,
        frame: false,
        skipTaskbar: true,
        resizable: false,
        movable: false,
        backgroundColor: '#232323',
        show: false,
        webPreferences: {
            devTools: true,
            nodeIntegrationInWorker: true
        }
        // parent: mainWindow
    });

    // 全屏代码
    if (process.platform === 'darwin') electron.app.dock.hide();
    evaWindow.setAlwaysOnTop(true, "floating");
    evaWindow.setVisibleOnAllWorkspaces(true);
    evaWindow.setFullScreenable(false);

    // and load the index.html of the app.
    evaWindow.loadURL(url.format({
        pathname: path.join(__dirname, `views/main.html`),
        protocol: 'file:',
        slashes: true
    }));
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    return evaWindow
}

export default {
    createMainWindow,
    createEvaWindow
};
