import { app } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import Logger from '../utils/Logger';
import axios from 'axios';
import parse from 'node-html-parser';

export default class TemplateService {
    private static INSTANCE?: TemplateService;

    private constructor() {}

    public static getInstance(): TemplateService {
        if (TemplateService.INSTANCE === undefined) {
            TemplateService.INSTANCE = new TemplateService();
        }

        return TemplateService.INSTANCE;
    }

    private _templateDir = 'receipt-template';

    /**
     * 템플릿 파일 로드
     * @param filename 
     * @returns 
     */
    async loadTemplate(filename: string): Promise<string> {
        Logger.info('[loadTemplate]')
        Logger.info(process.type);
        let data = '';

        if (app.isPackaged) {
            const templatePath = path.join(__dirname, '..', 'renderer', MAIN_WINDOW_VITE_NAME, this.templateDir, filename);
            Logger.info(`load template file from file system: ${templatePath}`);

            data = await fs.readFile(templatePath, 'utf-8')
        } else {
            const templatePath = path.join(MAIN_WINDOW_VITE_DEV_SERVER_URL, this.templateDir, filename);
            Logger.info(`load template file from localhost: ${templatePath}`);

            const response = await axios.get(templatePath)
            data = response.data as string;
        }

        return this.transformHTMLURL(data);
    }

    transformHTMLURL(src: string): string {
        const root = parse(src);

        // 전체에서 %BASE_URL%을 감지하도록 변경
        if (app.isPackaged) {
            root.innerHTML = root.innerHTML.replaceAll(/%BASE_URL%/g, path.join('file://', __dirname, '../renderer', MAIN_WINDOW_VITE_NAME).replaceAll('\\', '/'))
        } else {
            root.innerHTML = root.innerHTML.replaceAll(/%BASE_URL%/g, MAIN_WINDOW_VITE_DEV_SERVER_URL)
        }

        // script 태그 src 변환
        // root.querySelectorAll('script[src], img[src]').forEach((el) => {
        //     const ogPath = el.getAttribute('src');

        //     if (!ogPath || !ogPath.startsWith('%BASE_URL%')) return;

        //     const targetPath = ogPath.substring(11);

        //     if (app.isPackaged) {
        //         el.setAttribute('src', path.join('file://', __dirname, '../renderer', MAIN_WINDOW_VITE_NAME, targetPath).replaceAll('\\', '/'));
        //     } else {
        //         el.setAttribute('src',MAIN_WINDOW_VITE_DEV_SERVER_URL + '/' + targetPath);
        //     }
        // });

        // link 태그 href 변환
        // root.querySelectorAll('link[href]').forEach((el) => {
        //     const ogPath = el.getAttribute('href');

        //     if (!ogPath || !ogPath.startsWith('%BASE_URL%')) return;

        //     const targetPath = ogPath.substring(11);

        //     if (app.isPackaged) {
        //         el.setAttribute('href', path.join('file://', __dirname, '../renderer', MAIN_WINDOW_VITE_NAME, targetPath).replaceAll('\\', '/'));
        //     } else {
        //         el.setAttribute('href',MAIN_WINDOW_VITE_DEV_SERVER_URL + '/' + targetPath);
        //     }
        // });

        return root.toString();
    }

    /**
     * STFM 물품 영수증 렌더링
     * @param param 
     * @returns 
     */
    async renderSTFMItemReceipt(param: STFMItemReceiptParam): Promise<string> {
        Logger.info("[renderSTFMItemReceipt]");
        const filename = param.type === 'STFM_ITEM' ? 'stfm-item-receipt.html' : 'stfm-item-offline-receipt.html';
        const template = await this.loadTemplate(filename);

        const result =
            template.replace(/{{\s*(\w+)\s*}}/g, (_, varName) => {
                if (Object.hasOwn(param, varName)) {
                    const obj = param[varName as keyof STFMItemReceiptParam];
                    if (typeof obj === 'string')
                        return String(obj);
                    else
                        return JSON.stringify(obj);
                }

                return '';
            });
        
        return result;
    }

    /**
     * STFM 의료 발행 영수증 렌더링
     * @param param 
     * @returns 
     */
    async renderSTFMMediRefundReceipt(param: STFMMediRefundReceiptParam) {
        Logger.info("[renderSTFMMediRefundReceipt]");
        const template = await this.loadTemplate('stfm-medi-refund-receipt.html');

        const result =
            template.replace(/{{\s*(\w+)\s*}}/g, (_, varName) => {
                if (Object.hasOwn(param, varName)) {
                    const obj = param[varName as keyof STFMMediRefundReceiptParam];
                    if (typeof obj === 'string')
                        return String(obj);
                    else
                        return JSON.stringify(obj);
                }

                return '';
            });
        
        return result;
    }

    /**
     * STFM 의료 결제 영수증 렌더링
     * @param param 
     * @returns 
     */
    async renderSTFMMediPayReceipt(param: STFMMediPayReceiptParam) {
        Logger.info("[renderSTFMMediPayReceipt]");
        const template = await this.loadTemplate('stfm-medi-pay-receipt.html');

        const result =
            template.replace(/{{\s*(\w+)\s*}}/g, (_, varName) => {
                if (Object.hasOwn(param, varName)) {
                    const obj = param[varName as keyof STFMMediPayReceiptParam];
                    if (typeof obj === 'string')
                        return String(obj);
                    else
                        return JSON.stringify(obj);
                }

                return '';
            });
        
        return result;
    }

    get templateDir() {
        return this._templateDir;
    }

    set templateDir(value: string) {
        if (value.length > 0 && value[0] === '/') {
            this._templateDir = value.substring(1);
        } else {
            this._templateDir = value;
        }
    }
}