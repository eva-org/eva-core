import evaSpace from "../evaspace";

import child_process from 'child_process';
import glob from 'glob';
import os from 'os';
import logger from "../utils/log";
import PlatformUtils from "../utils/plantform";
import CommonUtils from "../utils/common";
import * as path from "path";
import {EPlugin, EPluginResult} from "../eplugin";

let files: any = [];
let config: any;
let initialized = false;

const createFolder = (to: string) => { //文件写入
    const sep = path.sep;
    const folders = path.dirname(to).split(sep);
    let p = '';
    while (folders.length) {
        p += folders.shift() + sep;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};

function globPromise(pattern: string, options: any) {
    return new Promise(function (resolve, reject) {
        const g = new glob.Glob(pattern, options);
        g.once('end', resolve);
        g.once('error', reject)
    })
}

let searchCache: any = {};
const fs = require('fs');
// 缓存路径
const cachePath = `${evaSpace.evaWorkHome}FindApp/cache.json`;

async function initAndGetData(query: string): Promise<EPluginResult[]> {
    initialized = true;

    config = CommonUtils.getConfig('FindApp');
    if (!config.patterns) {
        logger.error('Error');
        if (PlatformUtils.isMac()) {
            config.patterns = ['/Applications/**.app', `${os.homedir()}/Downloads/**.**`];
            config.command = 'open '
        } else if (PlatformUtils.isWindows()) {
            config.patterns = ['C:/ProgramData/Microsoft/Windows/Start Menu/Programs/**.lnk'];
            config.command = ''
        } else if (PlatformUtils.isLinux()) {
            // TODO linux support. Pull request needed.
        } else {
            logger.error('Not support current system.')
        }
        CommonUtils.saveConfig('findApp', config)
    }

    for (const pattern of config.patterns) {
        await globPromise(pattern, (err: any, file: any) => {
            if (err) {
                logger.error(err);
                return
            }
            files = files.concat(file.toString().split(',').filter(() => true))
        })
    }

    //加载缓存
    const cacheFileExist = fs.existsSync(cachePath);
    files.forEach((file: any) => {
        searchCache[file] = 0
    });
    if (cacheFileExist) {
        Object.assign(searchCache, JSON.parse(fs.readFileSync(cachePath).toString()))
    } else {
        createFolder(cachePath)
    }
    return getData(query)
}

function getData(query: string): Promise<EPluginResult[]> {
    return new Promise(resolve => {
        const resultFileArr = files.filter((fileUri: any) => {
            const position = fileUri.lastIndexOf('/') + 1;
            return fileUri.slice(position).toUpperCase().indexOf(query.toUpperCase()) >= 0
        });

        const resultArr = resultFileArr.map((fileUri: string) => {
            const position = fileUri.lastIndexOf('/') + 1;
            const order = searchCache[fileUri];

            return {
                title: fileUri.slice(position),
                subTitle: `打开 ${fileUri}`,
                order,
                action() {
                    try {
                        cache(fileUri)
                    } catch (e) {
                        console.log(e)
                    }
                    child_process.exec(`${config.command}"${fileUri}"`)
                }
            }
        });
        resultArr.sort((a: any, b: any) => {
            return b['order'] - a['order']
        });
        resolve(resultArr)
    })
}

class FindApp implements EPlugin {
    pluginName = 'FindApp';
    quick = '*';

    async query(query: string): Promise<EPluginResult[]> {
        if (!initialized) return initAndGetData(query);
        return getData(query)
    }
}

export default FindApp;

function cache(filePath: string) {
    const times = searchCache[filePath] || 0;
    searchCache[filePath] = times + 1;
    fs.writeFileSync(cachePath, JSON.stringify(searchCache))
}
