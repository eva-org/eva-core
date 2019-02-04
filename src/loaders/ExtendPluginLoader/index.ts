import evaSpace from "../../evaspace";
import path from 'path';
import CommonUtils from "../../utils/common";
import {EPluginInterface} from "../../eplugin";

function load(): EPluginInterface[] {
    CommonUtils.createFolder(evaSpace.evaWorkHome + '/plugins/default');
    const extendArr = getPluginFromDir(path.join(evaSpace.evaWorkHome, 'plugins'));
    console.trace('扩展插件加载完毕.');

    extendArr.forEach(plugin => {
        console.trace(`初始化插件: ${plugin.name}`);
        plugin.init && plugin.init()
    });
    return extendArr
}

function getPluginFromDir(path: string): EPluginInterface[] {
    return require("fs")
        .readdirSync(path)
        .filter((item: string) => item !== '.DS_Store')
        .map((fileName: string) => {
            return {
                ...require(`${path}/` + fileName)
            }
        })
}

export {
    load
}
