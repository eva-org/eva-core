import {join} from 'path'
import electron from 'electron';
import {createEvaWindow, createMainWindow} from './loaders/WindowLoader';
import CommonUtils from "./utils/common"
import evaSpace from "./evaspace";
import EPlugin from "./eplugin";
import PlatformUtils from "./utils/plantform";
import logger from "./utils/log";
import Eva from "./eva";

const {app, globalShortcut, ipcMain, Tray} = electron;
import BrowserWindow = Electron.BrowserWindow;

logger.trace('开始初始化App');

let evaWindow: BrowserWindow;
let mainWindow;
let tray;
let queryResult: any[] = [];
let eva: Eva;

function registerGlobalShortcut() {
    logger.trace('注册全局快捷键');
    globalShortcut.register('CommandOrControl+Shift+M', () => eva.switchWindowShown());
    globalShortcut.register('CommandOrControl+\\', () => eva.switchWindowShown());
    globalShortcut.register('CommandOrControl+Shift+Alt+M', () => evaWindow.webContents.openDevTools());
    globalShortcut.register('CommandOrControl+Shift+Alt+R', () => eva.restart());
    globalShortcut.register('CommandOrControl+Alt+P', () => app.quit());
}

app.on('ready', () => {
    logger.trace('App已经就绪');
    try {
        logger.trace('创建隐藏的主窗口');
        mainWindow = createMainWindow()
    } catch (e) {
        logger.error(e)
    }
    logger.trace('创建Eva窗口');
    evaWindow = createEvaWindow(evaSpace.config.width, evaSpace.config.height, evaSpace.config.opacity);
    eva = new Eva(app, evaWindow);

    tray = new Tray(PlatformUtils.PAS(join(evaSpace.ROOT_DIR, './assets/logo-1024-16x16@3x.png'), './assets/icon.ico'));
    tray.setToolTip('Eva');

    evaWindow.on('blur', () => eva.hideWindow());

    registerGlobalShortcut();
    ipcMain.on('box-input-esc', () => eva.hideWindow());
    ipcMain.on('hide-main-window', () => eva.hideWindow());
    ipcMain.on('box-input', boxInput);
    ipcMain.on('box-blur', () => eva.hideWindow());
    ipcMain.on('action', action);
    ipcMain.on('restore-box-height', () => changeBoxNum(0));
    logger.info('欢迎使用Eva!');
    CommonUtils.notice({
        title: 'Eva',
        body: '你好人类，我将给予你帮助！'
    })
});

function changeBoxNum(num: number) {
    if (num > 5) num = 5;
    const h = 50;
    evaWindow.setSize(evaSpace.config.width, +evaSpace.config.height + h * num)
}

function action(event: any, index: any) {
    if (queryResult.length <= 0) return;
    new Promise((resolve) => {
        queryResult[index].action();
        resolve()
    }).then(() => {
        event.sender.send('action-exec-success')
    }).catch(reason => {
        logger.error(reason)
    })
}

async function executeCommonPlugin(input: string) {
    const queryPromises = ([] as EPlugin[]).map(plugin => plugin.query({
        query: input
    }));
    let queryResult: any = [];
    const resultArr = await Promise.all(queryPromises);
    for (const result of resultArr) {
        queryResult = queryResult.concat(result)
    }
    return queryResult
}

function findSuitablePlugin(quickName: string): EPlugin | undefined {
    return ([] as EPlugin[]).find(plugin => plugin.quick === quickName)
}

async function executeExactPlugin(suitablePlugin: EPlugin, pluginQuery: any) {
    if (!pluginQuery) return [];
    return await suitablePlugin.query({
        query: pluginQuery,
    })
}

let lastedInput: string;

function boxInput(event: any, input: string) {
    lastedInput = input;
    if (!input) return clearQueryResult(event);

    // 如果不包含空格则执行通用插件（*插件）
    const blankIndex = input.indexOf(' ');
    if (blankIndex === -1) {
        return returnValue(event, input, executeCommonPlugin(input))
    }

    const [quickName, ...values] = input.split(' ');
    const suitablePlugin = findSuitablePlugin(quickName);
    if (!suitablePlugin) {
        return returnValue(event, input, executeCommonPlugin(input))
    }

    const pluginQuery = values.join(' ');
    return returnValue(event, input, executeExactPlugin(suitablePlugin, pluginQuery))
}

function returnValue(event: any, input: string, resultPromise: Promise<any>) {
    resultPromise
        .then(result => {
            // 如果本次回调对应的input不是最新输入，则忽略
            if (input !== lastedInput) return clearQueryResult(event);

            if (result.length) clearQueryResult(event);
            changeBoxNum(result.length);
            event.sender.send('query-result', result);
            // 在主线程保存插件结果，用于执行action，因为基于json的ipc通讯不可序列化function
            queryResult = result
        })
        .catch(reason => logger.error(reason))
}

function clearQueryResult(event: any) {
    event.sender.send('clear-query-result');
    changeBoxNum(0)
}
