import printerListJSON from '../../config/printer-list.json';
import TestPrintBtn from './TestPrintBtn';

type PrinterList = typeof printerListJSON;
type Printer = PrinterList[number];

export default class PrinterCard {
    private col = document.createElement('div');
    private card = document.createElement('div');
    private icon = document.createElement('img');
    private text = document.createElement('span');

    private testPrintBtn: TestPrintBtn;

    private _printer: Printer;

    constructor(printer: Printer) {
        this._printer = printer;

        this.testPrintBtn = new TestPrintBtn(printer);

        this.setClass();
        this.setAttribute();
        this.setEvent();
        this.render();
    }

    private setClass() {
        this.col.classList.add('col');
        this.card.classList.add(
            'card',
            'd-flex',
            'flex-column',
            'justify-content-center',
            'align-items-center',
            'py-4',
        );

        this.text.classList.add(
            'mt-1',
            'fw-bold',
        );
    }
    
    private setAttribute() {
        this.text.innerText = this._printer.name;

        this.icon.width = 72;
        this.icon.src = './icons/Print.svg';
        this.icon.alt = 'Print Icon';

    }

    private setEvent() {

    }

    private render() {
        this.col.appendChild(this.card);
        this.card.appendChild(this.icon);
        this.card.appendChild(this.text);
        this.card.appendChild(this.testPrintBtn.element);
    }

    get element() {
        return this.col;
    }
}