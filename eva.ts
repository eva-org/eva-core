import * as electron from "electron";

class Eva {
    private appIsVisible = false;
    private app: electron.App;
    private evaWindow: Electron.BrowserWindow;

    constructor(app: electron.App, evaWindow: electron.BrowserWindow) {
        this.app = app;
        this.evaWindow = evaWindow;
    }

    switchWindowShown() {
        this.appIsVisible ? this.hideWindow() : this.showWindow()
    }

    hideWindow() {
        this.evaWindow.hide();
        this.appIsVisible = false
    }

    showWindow() {
        this.evaWindow.show();
        this.appIsVisible = true
    }

    restart() {
        this.app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])});
        this.app.exit(0)
    }
}

export default Eva;
