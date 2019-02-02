class PlatformUtils {
    static isWindows() {
        return process.platform === 'win32'
    }

    static isLinux() {
        return process.platform === 'linux'
    }

    static isMac() {
        return process.platform === 'darwin'
    }

    /**
     * platform args selector 平台参数选择器
     */
    static PAS(mac?: any, win?: any, linux?: any) {
        if (PlatformUtils.isMac()) return mac;
        else if (PlatformUtils.isWindows()) return win;
        else if (PlatformUtils.isLinux()) return linux
    };
}

export default PlatformUtils
