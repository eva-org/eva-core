interface EPlugin {
    pluginName: string;
    quick: string;
    query: <T>(query: string) => Promise<EPluginResult[]>;
}

interface EPluginResult {
    title: string;
    subTitle: string;
    action: Function;
}

export {
    EPlugin,
    EPluginResult
};
