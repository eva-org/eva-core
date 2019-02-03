import * as os from "os";
import {sep} from "path";

const evaSpace = {
    config: {
        logLevel: "all",
        width: 600,
        height: 60,
        opacity: 0.9,
        evaWorkHome: `${os.homedir()}/.eva`
    },
    rootDir: __dirname,
    evaWorkHome: `${os.homedir()}${sep}.eva${sep}`
};

export default evaSpace;
