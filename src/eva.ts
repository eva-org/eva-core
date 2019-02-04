import logger from "./utils/log";
import WindowLoader from "./loaders/WindowLoader";
import evaSpace from "./evaspace";
import {EPluginInterface, EPluginResult} from "./eplugin";
import Electron from 'electron'
import FindApp from "./plugins/findapp";
import {load} from "./loaders/ExtendPluginLoader";
import globalShortcut = Electron.globalShortcut;
import app = Electron.app;
import ipcMain = Electron.ipcMain;

class Eva {
    private appIsVisible = false;
    private evaWindow: Electron.BrowserWindow;
    private lastedInput: string | undefined;
    private queryResult: any[] = [];
    private plugins: EPluginInterface[];

    constructor() {
        const config = evaSpace.config;
        this.evaWindow = WindowLoader.createEvaWindow(config.width, config.height, config.opacity);
        // this.evaWindow.on('blur', () => this.hideWindow());

        ipcMain.on('box-input-esc', () => this.hideWindow());
        ipcMain.on('hide-main-window', () => this.hideWindow());
        ipcMain.on('box-input', this.boxInput);
        ipcMain.on('box-blur', () => this.hideWindow());
        ipcMain.on('action', this.action);
        ipcMain.on('restore-box-height', () => this.changeBoxNum(0));
        this.registerGlobalShortcut();

        this.plugins = this.loadPlugins();
    }

    private static restart = () => {
        app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])});
        app.exit(0)
    };

    private static executeExactPlugin = async (suitablePlugin: EPluginInterface, pluginQuery: any) => {
        if (!pluginQuery) return [];
        return await suitablePlugin.query(pluginQuery)
    };

    private loadPlugins = (): EPluginInterface[] => {
        const basePlugins = [new FindApp()];
        const extendPlugins = load();
        return (<EPluginInterface[]>basePlugins).concat(extendPlugins);
    };

    private clearQueryResult = (event: any) => {
        event.sender.send('clear-query-result');
        this.changeBoxNum(0)
    };

    private changeBoxNum = (num: number) => {
        if (num > 5) num = 5;
        const h = 50;
        this.evaWindow.setSize(evaSpace.config.width, +evaSpace.config.height + h * num)
    };

    private switchWindowShown = () => {
        this.appIsVisible ? this.hideWindow() : this.showWindow()
    };

    private hideWindow = () => {
        this.evaWindow.hide();
        this.appIsVisible = false
    };

    private showWindow = () => {
        this.evaWindow.show();
        this.appIsVisible = true
    };

    private action = (event: any, index: any) => {
        if (this.queryResult.length <= 0) return;
        new Promise((resolve) => {
            this.queryResult[index].action();
            resolve()
        }).then(() => {
            event.sender.send('action-exec-success')
        }).catch(reason => {
            logger.error(reason)
        })
    };

    private executeCommonPlugin = async (input: string) => {
        const queryPromises = this.plugins.map(plugin => plugin.query(input));
        let queryResult: EPluginResult[] = [];
        const resultArr = await Promise.all(queryPromises);
        for (const result of resultArr) {
            queryResult = queryResult.concat(result)
        }
        return queryResult
    };

    private findSuitablePlugin = (quickName: string): EPluginInterface | undefined => {
        return this.plugins.find(plugin => plugin.quick === quickName)
    };

    private returnValue = (event: any, input: string, resultPromise: Promise<EPluginResult[]>) => {
        resultPromise
            .then(result => {
                // 如果本次回调对应的input不是最新输入，则忽略
                if (input !== this.lastedInput) return this.clearQueryResult(event);

                if (result.length) this.clearQueryResult(event);
                this.changeBoxNum(result.length);
                event.sender.send('query-result', result);
                // 在主线程保存插件结果，用于执行action，因为基于json的ipc通讯不可序列化function
                this.queryResult = result
            })
            .catch(reason => logger.error(reason))
    };

    private boxInput = (event: any, input: string) => {
        this.lastedInput = input;
        if (!input) return this.clearQueryResult(event);

        // 如果不包含空格则执行通用插件（*插件）
        const blankIndex = input.indexOf(' ');
        if (blankIndex === -1) {
            console.log(this.executeCommonPlugin);
            return this.returnValue(event, input, this.executeCommonPlugin(input))
        }

        const [quickName, ...values] = input.split(' ');
        const suitablePlugin = this.findSuitablePlugin(quickName);
        if (!suitablePlugin) {
            return this.returnValue(event, input, this.executeCommonPlugin(input))
        }

        const pluginQuery = values.join(' ');
        return this.returnValue(event, input, Eva.executeExactPlugin(suitablePlugin, pluginQuery))
    };

    private registerGlobalShortcut = () => {
        logger.trace('注册全局快捷键');
        globalShortcut.register('CommandOrControl+Shift+M', () => this.switchWindowShown());
        globalShortcut.register('CommandOrControl+\\', () => this.switchWindowShown());
        globalShortcut.register('CommandOrControl+Shift+Alt+M', () => this.evaWindow.webContents.openDevTools());
        globalShortcut.register('CommandOrControl+Shift+Alt+R', () => Eva.restart());
        globalShortcut.register('CommandOrControl+Alt+P', () => app.quit());
    };
}

export default Eva;
