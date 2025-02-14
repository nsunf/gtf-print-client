import { IpcMainInvokeEvent } from "electron";
import Logger from "../utils/Logger";

export default function printLog(e: IpcMainInvokeEvent, _level: LogLevel, ...args: any[]) {
    let level = _level;
    if (level === null || level === undefined)
        level = 'info';

    let func: (...agrs: any[]) => void;

    switch (level) {
        case 'info':
            func = Logger.info;
            break;
        case 'debug':
            func = Logger.debug;
            break;
        case 'warn':
            func = Logger.warn;
            break;
        case 'error':
            func = Logger.error;
            break;
        case 'verbose':
            func = Logger.verbose;
            break;
        case 'silly':
            func = Logger.silly;
            break;
    }

    func(args);
}