import PreviewButton from "../components/PreviewButton";

export default class Menu {
    private receiptPreviewList: HTMLElement;
    private stfmItemPreview = new PreviewButton('STFM 물품', 'STFM_ITEM');

    private stfmItemOfflinePreview = new PreviewButton('STFM 물품 오프라인', 'STFM_ITEM_OFFLINE');

    private stfmMediRefundPreview = new PreviewButton('STFM 의료 환급', 'STFM_MEDI_REFUND');

    private stfmMediPayPreview = new PreviewButton('STFM 의료 결제', 'STFM_MEDI_PAY');

    constructor() {
        this.receiptPreviewList = document.getElementById('receiptPreviewList');

        this.receiptPreviewList.appendChild(this.stfmItemPreview.element);
        this.receiptPreviewList.appendChild(this.stfmItemOfflinePreview.element);
        this.receiptPreviewList.appendChild(this.stfmMediRefundPreview.element);
        this.receiptPreviewList.appendChild(this.stfmMediPayPreview.element);
    };
}