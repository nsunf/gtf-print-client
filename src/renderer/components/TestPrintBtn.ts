import printerListJSON from '../../config/printer-list.json';
import dataSample from '../../config/data-sample.json';
import sampleDataLoader from '../../common/sampleDataLoader';

type PrinterList = typeof printerListJSON;
type Printer = PrinterList[number];

export default class TestPrintBtn {
    private btnGrp = document.createElement('div');
    private printBtn = document.createElement('button');
    private btnText = document.createElement('span');
    private dropdownBtn = document.createElement('button');
    private dropdownBtnSpan = document.createElement('span');
    private dropdownMenu = document.createElement('ul');
    private spinner = document.createElement('span');

    private _printer: Printer;

    constructor(printer: Printer) {
        this._printer = printer;

        this.addTemplatePrintBtn('STFM 물품', 'STFM_ITEM', true);
        this.addTemplatePrintBtn('STFM 물품 오프라인', 'STFM_ITEM_OFFLINE');
        this.addTemplatePrintBtn('STFM 의료 환급', 'STFM_MEDI_REFUND');
        this.addTemplatePrintBtn('STFM 의료 결제', 'STFM_MEDI_PAY');

        this.setClass();
        this.setAttr();
        this.setEvent();
        this.render();
    }

    private addTemplatePrintBtn(name: string, requestType: RequestType, isDefault?: boolean) {
        const item = document.createElement('li');
        const anchor = document.createElement('a');
        const defaultLabel = document.createElement('span');

        anchor.classList.add('dropdown-item');
        anchor.style.fontSize = '13px';
        anchor.href = '#';
        anchor.innerText = name;
        defaultLabel.classList.add('text-body-tertiary', 'ms-1', 'fw-bold');
        defaultLabel.style.fontSize = '11px';
        defaultLabel.innerText = 'Default';

        this.dropdownMenu.appendChild(item);
        item.appendChild(anchor);
        if (isDefault)
            anchor.appendChild(defaultLabel);

        anchor.addEventListener('click', () => {
            this.printBtn.disabled = true;
            this.spinner.classList.toggle('d-none');
            this.btnText.innerText = '출력 중...';

            const param = sampleDataLoader(requestType, this._printer.name);

            window.electronAPI.print(param).then(success => {
                }).finally(() => {
                    this.printBtn.disabled = false;
                    this.spinner.classList.toggle('d-none');
                    this.btnText.innerText = '테스트 출력';
                });
        });
    }

    private setClass() {
        this.btnGrp.classList.add('btn-group');

        this.printBtn.classList.add(
            'btn',
            'btn-dark',
            'mt-3',
        );

        this.dropdownBtn.classList.add(
            'btn',
            'btn-dark',
            'dropdown-toggle',
            'dropdown-toggle-split',
            'mt-3'
        );
        this.dropdownBtnSpan.classList.add('visually-hidden');

        this.dropdownMenu.classList.add('dropdown-menu');
        this.spinner.classList.add(
            'spinner-border',
            'spinner-border-sm',
            'd-none',
            'me-1',
        );
    }

    private setAttr() {
        this.btnText.innerText = '테스트 출력';

        this.dropdownBtn.setAttribute('data-bs-toggle', 'dropdown');
        this.dropdownBtnSpan.innerText = 'Toggle Dropdown';
    }

    private setEvent() {
        this.printBtn.addEventListener('click', () => {
            this.printBtn.disabled = true;
            this.spinner.classList.toggle('d-none');
            this.btnText.innerText = '출력 중...';

            const param = sampleDataLoader('STFM_ITEM', this._printer.name);

            window.electronAPI.print(param).then(success => {
            }).finally(() => {
                this.printBtn.disabled = false;
                this.spinner.classList.toggle('d-none');
                this.btnText.innerText = '테스트 출력';
            });
        });
    }

    private render() {
        this.btnGrp.appendChild(this.printBtn)
        this.btnGrp.appendChild(this.dropdownBtn);
        this.btnGrp.appendChild(this.dropdownMenu);
        this.dropdownBtn.appendChild(this.dropdownBtnSpan);
        this.printBtn.appendChild(this.spinner);
        this.printBtn.appendChild(this.btnText);
    }

    get element(): HTMLElement {
        return this.btnGrp;
    }
}