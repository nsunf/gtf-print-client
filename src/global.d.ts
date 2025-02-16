export declare global {
  interface Window {
    electronAPI: {
      // print: (printerName: string, htmlContent: string, options?: PrintOptions) => Promise<boolean>,
      print: (param: ReceiptParam) => Promise<boolean>,
      showReceiptPreview: (htmlContent: string) => void,
      previewSTFMItemReceipt: (param: STFMItemReceiptParam) => Promise<boolean>,
      previewSTFMMediRefundReceipt: (param: STFMMediRefundReceiptParam) => Promise<boolean>,
      previewSTFMMediPayReceipt: (param: STFMMediPayReceiptParam) => Promise<boolean>,
      previewReceipt: (param: ReceiptParam) => Promise<boolean>,
      checkWebSocketServer: () => boolean,
      log: (level: LogLevel, ...args: any[]) => void,
    };
  }

  type LogLevel = 'info'|'debug'|'warn'|'error'|'verbose'|'silly';

  type RequestType = 'STFM_ITEM'|'STFM_ITEM_OFFLINE'|'STFM_MEDI_REFUND'|'STFM_MEDI_PAY'|'HTML'|'PDF';

  interface PrintOptions {
    paperWidth?: number;
    maxPaperHeight?: number;
  }

  interface GoodsItem {
    goodsName?: string;
    qty?: number;
    vatAmt?: number;
    sellAmt?: number;
    itemsCode?: string;
  }

  interface ReceiptParam {
    type: RequestType;
    printerName: string;
  }
  interface STFMItemReceiptParam extends ReceiptParam {
    buySerialNo: string;
    shopTmlId: string;
    shopName?: string;
    ceoName?: string;
    bizPermitNo?: string;
    shopAddr?: string;
    shopTelNo?: string;
    sellDate?: string;
    sellTime?: string;
    cardNo?: string;
    totalSalesAmt?: number;
    totalVATAmt?: number;
    totalSCTAmt?: number;
    totalETAmt?: number;
    totalTaxAmt?: number;
    totalChargeAmt?: number;
    totalRefundAmt?: number;
    passportName?: string;
    passportNo?: string;
    passportNationalityCode?: string;
    passportGenderCode?: string;
    passportBirthday?: string;
    passportExpiryDate?: string;
    signData?: string;
    exportExpiryDate?: string;
    purpose?: string;
    goodsList: GoodsItem[];
  }

  interface STFMMediRefundReceiptParam extends ReceiptParam {
    buySerialNo: string;
    shopTmlId: string;
    shopName?: string;
    ceoName?: string;
    bizPermitNo?: string;
    mediFullCode?: string;
    shopAddr?: string;
    shopTelNo?: string;
    facilitatorName?: string;
    facilitatorFullCode?: string;
    facilitatorBizNo?: string;
    sellDate?: string;
    sellTime?: string;
    cardNo?: string;
    totalSalesAmt?: number;
    totalVATAmt?: number;
    totalChargeAmt?: number;
    totalRefundAmt?: number;
    cashPayAmt?: number;
    cardPayAmt?: number;
    passportName?: string;
    passportNo?: string;
    passportNationalityCode?: string;
    passportGenderCode?: string;
    passportBirthday?: string;
    passportExpiryDate?: string;
    signData?: string;
    exportExpiryDate?: string;
    purpose?: string;
    goodsList: GoodsItem[];
  }

  interface STFMMediPayReceiptParam extends ReceiptParam {
    tradeNo: string;
    payType?: string;
    shopName?: string;
    ceoName?: string;
    bizPermitNo?: string;
    shopAddr?: string;
    shopTelNo?: string;
    sellDate?: string;
    sellTime?: string;
    totalSalesAmt?: number;
    purpose?: string;
  }

  interface HTMLReceiptParam extends ReceiptParam {
    content: string;
  }

  interface PDFReceiptParam extends ReceiptParam {
    content: string;
  }
}