import PrinterCard from "../components/PrinterCard";
import printerListJSON from '../../config/printer-list.json';

export default class Body {
    private printerList = document.getElementById('printerList');

    constructor() {
        printerListJSON.forEach(printer => {
            if (this.printerList) {
                const printerCard = new PrinterCard(printer);
                this.printerList.appendChild(printerCard.element);
            }
        });
    }
}