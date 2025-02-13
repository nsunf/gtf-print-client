import sampleDataLoader from "../../common/sampleDataLoader";

export default class PreviewButton {
    private previewItem: HTMLLIElement;
    private previewLink: HTMLAnchorElement;

    private _name: string;
    private _requestType: RequestType;

    constructor(name: string, requestType: RequestType) {
        const param = sampleDataLoader(requestType);
        console.log(param);
        this._name = name;
        this._requestType = requestType;

        this.previewItem = document.createElement('li');
        this.previewLink = document.createElement('a');

        this.previewLink.classList.add('dropdown-item', 'dropdown-item-dark', 'ps-4');
        this.previewLink.href = '#';
        this.previewLink.innerText = name;
        this.previewLink.addEventListener('click', () => {
            window.electronAPI.previewReceipt(param);
        });

        this.previewItem.appendChild(this.previewLink);
    }

    get element(): HTMLElement {
        return this.previewItem;
    }
}