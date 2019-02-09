interface EPluginInterface {
    name: string;
    quick: string;

    query(query: string): Promise<EPluginResult[]>;

    init(): void;
}

abstract class EPlugin implements EPluginInterface {
    abstract name: string;
    abstract quick: string;

    abstract query(query: string): Promise<EPluginResult[]> ;

    init() {
    };
}

interface EPluginResult {
    title: string;
    subTitle: string;
    action: Function;
}

export {
    EPluginInterface,
    EPluginResult,
    EPlugin
};
