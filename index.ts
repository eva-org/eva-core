import electron from 'electron';
import WindowLoader from './loaders/WindowLoader';
import CommonUtils from "./utils/common"
import evaSpace from "./evaspace";
import PlatformUtils from "./utils/plantform";
import logger from "./utils/log";
import Eva from "./eva";
import path from "path";


// 函数外部持有实例，用于阻止垃圾回收
let mainWindow; // 隐藏的主窗口
let eva;        // Eva显示窗口
let tray;       // 任务栏图标

logger.trace('开始初始化App');
const {app, Tray} = electron;
app.on('ready', () => {
    logger.trace('App已经就绪，创建隐藏的主窗口');
    mainWindow = WindowLoader.createMainWindow();

    logger.trace('创建Eva窗口');
    eva = new Eva();

    tray = new Tray(PlatformUtils.PAS(path.join(evaSpace.rootDir, './assets/logo-1024-16x16@3x.png'), './assets/icon.ico'));
    tray.setToolTip('Eva');

    logger.info('欢迎使用Eva!');
    CommonUtils.notice({title: 'Eva', body: '你好人类，我将给予你帮助！'})
});
