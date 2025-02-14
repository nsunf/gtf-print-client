import { WebSocketServer } from 'ws';
import { parse } from 'url';
import setting from '../../config/setting.json';
import Logger from '../utils/Logger';

type Setting = typeof setting;

export default class WebSockerService {
    private static instance: WebSockerService;

    private server: WebSocketServer;
    private port: number;
    private _isEnabled: boolean;

    private messageEvent: (data: any) => void;

    private constructor() {
        this._isEnabled = false;
        this.setWebSocketServer();
    }

    public static getInstance(): WebSockerService  {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new WebSockerService();
        }

        return this.instance;
    }

    private setWebSocketServer() {
        this.port = setting.port;

        this.server = new WebSocketServer({
            port: this.port
        }, () => {
            this.initialize();
        });
    }

    private initialize() {
        Logger.info('===Initialize WebSocketService===');

        this.server.on('connection', (ws, request) => {
            Logger.info('[WebSocketServer Connected]');
            const url = parse(request.url);

            ws.on('open', () => {
                Logger.info('[WebSocketServer Opened]');
                this._isEnabled = true;
            });

            ws.on('message', (data) => {
                Logger.info('[WebSocket Message Received : ' + data.toString());
                try {
                    this.messageEvent(data);
                    ws.send(200);
                } catch (error) {
                    Logger.error(error);
                    ws.send(500);
                }
            });

            ws.on('closed', () => {
                Logger.info('[WebSocketServer Closed]');
                this._isEnabled = false;
            });

            ws.on('error', (error) => {
                Logger.error(error);
                this._isEnabled = false;
            });

            ws.send(200);
        });
    }

    public onMessage(callback: (data: any) => void) {
        this.messageEvent = callback;
    }

    public restartServer() {
        Logger.info('[Restart WebSocketServer]');
        this.server.close();
        this.setWebSocketServer();
    }

    get isEnabled(): boolean {
        return this._isEnabled;
    }
}