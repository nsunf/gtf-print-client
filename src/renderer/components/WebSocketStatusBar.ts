export default class WebSocketStatusBar {
  private wrap = document.createElement('div');
  private statusIndicator = document.createElement('div');
  private statusLabel = document.createElement('span');

  constructor() {
    this.setClass();
    this.setAttr();
    this.setEvent();
    this.render();

    setInterval(() => {
      const wsStatus = window.electronAPI.checkWebSocketServer();
      this.setStatus(wsStatus);
    }, 1000);
  }

  private setStatus(webSocketServerEnabled: boolean) {
    const indicatorColorList = ['bg-warning', 'bg-success'];

    let indicatorColor = '';
    let labelText = '';

    if (webSocketServerEnabled) {
      indicatorColor = 'bg-success';
      labelText = '연결됨';
    } else {
      indicatorColor = 'bg-warning';
      labelText = '연결 대기중';
    }

    this.statusIndicator.classList.remove(...indicatorColorList)
    this.statusIndicator.classList.add(indicatorColor);
    this.statusLabel.innerText = labelText;
  }

  private setClass() {
    this.wrap.classList.add('position-absolute bottom-0 end-0 fw-bold hstack gap-1 my-1 me-3');
    this.statusIndicator.classList.add('bg-warning rounded-pill');
  }

  private setAttr() {
    this.wrap.style.fontSize = '11px';
    this.statusIndicator.style.width = '20px';
    this.statusIndicator.style.height = '12px';
    this.statusLabel.innerText = '연결 대기중';
  }

  private setEvent() {
    this.wrap.addEventListener('click', () => {
      // restart server
    });
  }

  private render() {
    this.wrap.appendChild(this.statusIndicator);
    this.wrap.appendChild(this.statusLabel);
  }

  get element() {
    return this.wrap;
  }
}