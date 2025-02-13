import log from "electron-log/main";
import path from 'path';
import os from 'os';
import fs from 'fs';
import { dateToYYYYMMDD } from "../../common/common";

/**
 * 로거
 * 프로그램 실행 및 로깅 때 마다 로그 로테이팅
 */
export default class Logger {
    private constructor() {}
    private static _log = log;

    private static maxLogFileCnt = 60;

    /**
     * 로그파일 초기화
     */
    public static initLog() {
        const logdir = Logger.getLogDir();

        // 로그 경로 존재 여부를 확인하여 경로 생성
        if (!fs.existsSync(logdir)) {
            fs.mkdirSync(logdir, { recursive: true });
        }
        // 로그 로테이팅
        Logger.rotateLogFiles();
        // 로그파일 제거
        Logger.pruneLogFiles(this.maxLogFileCnt);
        // 로그 파일 지정
        Logger._log.transports.file.resolvePathFn = Logger.getLogFilePath;
    }

    /**
     * os에 따른 로그 경로 디렉토리 반환
     * @returns 로그 경로 디렉토리
     */
    private static getLogDir(): string {
        if (process.platform === 'win32') {
            return path.join('C:/', 'log', 'GTF', 'GTF_Client');
        } else if (process.platform === 'darwin') {
            return path.join(os.homedir(), 'log', 'GTF', 'GTF_Client');
        }
    }

    /**
     * 로그 파일 경로 반환
     * @returns 로그 파일 경로
     */
    private static getLogFilePath(): string {
        return path.join(Logger.getLogDir(), 'GTF_Client.log');
    }

    /**
     * 로그 파일 순환
     * @param maxFileCnt
     */
    private static rotateLogFiles() {

        const logFilePath = Logger.getLogFilePath();

        // console.log('logFilePath : ' +logFilePath);
        if (fs.existsSync(logFilePath)) {
            // 로그 파일이 존재할 경우 생성 날짜를 확인하여 rotate
            // console.log('Log File Exist');
            const stat = fs.statSync(logFilePath);
            const lastModDateStr = dateToYYYYMMDD(stat.mtime);
            const currentDateStr = dateToYYYYMMDD(new Date());

            if (lastModDateStr < currentDateStr) {
                // console.log(`Rotate Log File ${lastModDateStr}`);

                const rotatingLogFilePath = path.join(Logger.getLogDir(), `GTF_Client.${lastModDateStr}.log`);
                // const tmpLogFilePath = path.join(Logger.getLogDir(), `GTF_Client${randomUUID()}.tmp`,)

                fs.renameSync(logFilePath, rotatingLogFilePath);
                fs.writeFileSync(logFilePath, '');
                // fs.writeFileSync(tmpLogFilePath, '');
                // fs.renameSync(tmpLogFilePath, logFilePath);
            }
        } else {
            // 로그 파일이 존재하지 않을 경우 생성
            // console.log('Log File Not Exist')
            fs.writeFileSync(logFilePath, '');
        }
    }

    /**
     * 로그파일 초과 시 제거
     * @param maxFileCnt 최대 로그파일 개수
     */
    private static pruneLogFiles(maxFileCnt: number) {
        // 최대 로그 보관 개수를 초과할 경우 삭제
        const logDir = Logger.getLogDir();

        fs.readdirSync(logDir)
            .filter(v => {
                return v.match(/GTF_Client\.\d{8}\.log/)
            }).sort((a, b) => {
                const creationDateStrA = a.substring(13, 19);
                const creationDateStrB = b.substring(13, 19);

                return creationDateStrA > creationDateStrB ? 0 : 1;
            }).forEach((filename, i) => {
                if (i >= maxFileCnt) {
                    fs.rmSync(path.join(logDir, filename));
                }
            })
    }


    // 로깅 시 로그 로테이팅

    public static error(...args: any[]) {
        Logger.initLog();
        return Logger._log.error(...args);
    }

    public static warn(...args: any[]) {
        Logger.initLog();
        return Logger._log.warn(...args);
    }

    public static info(...args: any[]) {
        Logger.initLog();
        return Logger._log.info(...args);
    }

    public static verbose(...args: any[]) {
        Logger.initLog();
        return Logger._log.verbose(...args);
    }

    public static debug(...args: any[]) {
        Logger.initLog();
        return Logger._log.debug(...args);
    }

    public static silly(...args: any[]) {
        Logger.initLog();
        return Logger._log.silly(...args);
    }
}
