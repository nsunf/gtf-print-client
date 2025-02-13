import { BrowserWindow, dialog, IpcMainInvokeEvent, screen } from 'electron';
import TemplateService from '../service/TemplateService';
import Logger from '../utils/Logger';

let previewWindow: BrowserWindow = null;
let previewWidth: number = null;
let previewHeight: number = null;

const createPreviewWindow = () => {
  previewWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  });

  previewWindow.webContents.on('did-finish-load', async () => {
    const dimensions = await previewWindow.webContents.executeJavaScript(`
      new Promise(resolve => {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        resolve({ width, height });
      });
    `);

    const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    const screenHeight = screen.getPrimaryDisplay().workAreaSize.height;

    if (previewWidth === null)
      previewWidth = Math.min(dimensions.width, screenWidth) + 20;
    if (previewHeight === null)
      previewHeight = Math.min(dimensions.height, screenHeight);

    previewWindow.setBounds({ x: 0, y: 0, width: previewWidth, height: previewHeight });
    previewWindow.show();
  });

  previewWindow.on('closed', () => {
    previewWidth = null;
    previewHeight = null;
  });
};

export default async function previewReceiptHandler(e: IpcMainInvokeEvent, param: ReceiptParam) {
  Logger.info('[previewReceiptHandler]');
  Logger.info(param.type);
  createPreviewWindow();

  const templateService = TemplateService.getInstance();

  let htmlContent = '';

  switch (param.type) {
    case 'STFM_ITEM':
      htmlContent = await templateService.renderSTFMItemReceipt(param as STFMItemReceiptParam);
      break;
    case 'STFM_ITEM_OFFLINE':
      htmlContent = await templateService.renderSTFMItemReceipt(param as STFMItemReceiptParam);
      break;
    case 'STFM_MEDI_REFUND':
      htmlContent = await templateService.renderSTFMMediRefundReceipt(param as STFMMediRefundReceiptParam);
      break;
    case 'STFM_MEDI_PAY':
      htmlContent = await templateService.renderSTFMMediPayReceipt(param as STFMMediPayReceiptParam);
      break;
    default:
  }

  try {
    previewWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`)
  } catch (error) {
    Logger.error(error);
    dialog.showMessageBox({
      type: 'error',
      title: '영수증 미리보기 오류',
      message: '영수증을 불러오는 중 오류가 발생했습니다.',
      buttons: ['확인'],
    })
  }
}