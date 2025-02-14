import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    print: (param: ReceiptParam) => ipcRenderer.invoke('print', param),
    showReceiptPreview: (htmlContent: string) => ipcRenderer.invoke('showReceiptPreview', htmlContent),
    previewSTFMItemReceipt: (param: STFMItemReceiptParam) => ipcRenderer.invoke('previewSTFMItemReceipt', param),
    previewSTFMMediRefundReceipt: (param: STFMMediRefundReceiptParam) => ipcRenderer.invoke('previewSTFMMediRefundReceipt', param),
    previewSTFMMediPayReceipt: (param: STFMMediPayReceiptParam) => ipcRenderer.invoke('previewSTFMMediPayReceipt', param),
    previewReceipt: (param: ReceiptParam) => ipcRenderer.invoke('previewReceipt', param),
    log: (level: LogLevel, ...args: any[]) => ipcRenderer.invoke('log', level, ...args),
});