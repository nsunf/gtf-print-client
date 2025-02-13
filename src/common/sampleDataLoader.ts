import dataSampleJson from '../config/data-sample.json';

export default function sampleDataLoader(type: RequestType, printerName?: string): ReceiptParam {
    let param: ReceiptParam;
    try {
        switch (type) {
            case 'STFM_ITEM':
                param = dataSampleJson.STFM_ITEM as STFMItemReceiptParam;
                break;
            case 'STFM_ITEM_OFFLINE':
                param = dataSampleJson.STFM_ITEM_OFFLINE as STFMItemReceiptParam;
                break;
            case 'STFM_MEDI_REFUND':
                param = dataSampleJson.STFM_MEDI_REFUND as STFMMediRefundReceiptParam;
                break;
            case 'STFM_MEDI_PAY':
                param = dataSampleJson.STFM_MEDI_PAY as STFMMediPayReceiptParam;
                break;
        }
    } catch (e) {
        throw new Error('샘플 데이터가 존재하지 않습니다.');
    }

    return { ...param, printerName: printerName ?? '' };
}