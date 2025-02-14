import { BrowserWindow, IpcMainInvokeEvent, WebContentsPrintOptions } from 'electron';
import TemplateService from '../service/TemplateService';
import printerListJSON from '../../config/printer-list.json';
import Logger from '../utils/Logger';

type PrinterSettingList = typeof printerListJSON;
type PrinterSetting = PrinterSettingList[number];

export default function printHandler(e: IpcMainInvokeEvent, param: ReceiptParam) {
    
    return new Promise(async (resolve, reject) => {
        Logger.info('프린트 출력 시작');

        // 영수증 미리보기
        // 실제로 화면에 보여지지 않고 데이터 로드 후 바로 출력됨.
        const preview = new BrowserWindow({
            show: false,
            webPreferences: {
                webSecurity: false,
            }
        });

        // printer-list.json 파일에 정의되어있는 프린터 존재하는지 확인.
        // TODO: 프린터가 존재하지 않아도 ReceiptParam으로 전달받은 프린터 이름으로 진행하도록 수정
        Logger.info('프린트 조회');
        const printerList = await preview.webContents.getPrintersAsync();
        printerList.forEach(p => {
            Logger.info('- ' + p.name);
        });

        const printer = printerList.findLast(p => p.name === param.printerName)
            ?? printerList.findLast(p => {
                const p1 = p.name.replaceAll(/[\s|\-|_]/g, '');
                const p2 = param.printerName.replaceAll(/[\s|\-|_]/g, '');

                return p1 === p2;
            });

        if (printer === null || printer === undefined) {
            const errorMsg = '요청한 프린터 기종을 찾지 못했습니다.'; 
            Logger.error(errorMsg)
            throw new Error(errorMsg);
        }

        Logger.info("선택된 프린터");
        Logger.info(JSON.stringify(printer, null, 2));

        const printerSetting: PrinterSetting = printerListJSON.find(p => p.name === param.printerName)
            ?? printerListJSON.find(p => {
                const p1 = p.name.replaceAll(/[\s|\-|_]/g, '');
                const p2 = param.printerName.replaceAll(/[\s|\-|_]/g, '');

                return p1 === p2;
            });


        // 영수증 데이터 로드 시 프린트 출력
        preview.webContents.on('did-finish-load', () => {
            // 프린트 옵셥
            const electronPrintOptions: WebContentsPrintOptions = {
                silent: true,
                printBackground: true,
                deviceName: printer.name,
                margins: {
                marginType: 'custom',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                },
            };

            // 설정된 영수증 사이즈가 있는 경우 사이즈 변경
            if (printerSetting.paperWidth && printerSetting.maxPaperHeight) {
                electronPrintOptions.pageSize = { width: printerSetting.paperWidth, height: printerSetting.maxPaperHeight };
            }

            // 이벤트 완료 후 콜백
            const callback = (success: boolean, failure: string) => {
                preview.close();
                if (success) {
                    Logger.info('프린트 요청 성공');
                    resolve(success);
                } else {
                    Logger.error('프린트 요청 실패');
                    Logger.error(failure);
                    reject(success);
                }
            };

            preview.webContents.print(electronPrintOptions, callback);
        });


        // ReceiptParam 데이터를 기준으로 영수증 데이터 설정
        const templateService = TemplateService.getInstance();

        let htmlContent = '';
        let dataUrl = '';

        switch (param.type) {
            case 'STFM_ITEM':
            case 'STFM_ITEM_OFFLINE':
                htmlContent = await templateService.renderSTFMItemReceipt(param as STFMItemReceiptParam)
                dataUrl = `data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`;
                break;
            case 'STFM_MEDI_REFUND':
                htmlContent = await templateService.renderSTFMMediRefundReceipt(param as STFMMediRefundReceiptParam);
                dataUrl = `data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`;
                break;
            case 'STFM_MEDI_PAY':
                htmlContent = await templateService.renderSTFMMediPayReceipt(param as STFMMediPayReceiptParam);
                dataUrl = `data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`;
                break;
            case 'HTML':
                htmlContent = (param as HTMLReceiptParam).content;
                dataUrl = `data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`;
                break;
            case 'PDF':
                const base64Str = (param as PDFReceiptParam).content;
                dataUrl = `data:application/pdf;base64,${base64Str}`;
                break;
            default:
                throw new Error('비정상적인 데이터가 감지되었습니다.');
                break;
        }

        // 영수증 데이터를 preview에 로드하면 did-finish-load 트리거
        preview.loadURL(dataUrl);
    });
}