import { WebSocket, WebSocketServer } from 'ws';
import { parse } from 'url';
import setting from '../../config/setting.json';
import Logger from '../utils/Logger';

// type Setting = typeof setting;

export default class WebSocketService {
    private static instance: WebSocketService;

    private server: WebSocketServer;
    private port: number;
    private _isEnabled: boolean;

    private messageEvent: (ws: WebSocket, data: any) => void;

    private constructor() {
        this._isEnabled = false;
        this.setWebSocketServer();
    }

    public static getInstance(): WebSocketService  {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new WebSocketService();
        }

        return this.instance;
    }

    private setWebSocketServer() {
        Logger.info('WebSocket Port : ' + setting.port);
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
            this._isEnabled = true;
            const url = parse(request.url);

            ws.on('open', () => {
                Logger.info('[WebSocketServer Opened]');
            });

            ws.on('message', (data) => {
                Logger.info('[WebSocket Message Received : ' + data.toString());
                try {
                    this.messageEvent(ws, data);
                    ws.send(200);
                } catch (error) {
                    Logger.error(error);
                    ws.send(500);
                }
            });

            ws.on('closed', () => {
                Logger.info('[WebSocketServer Closed]');
                this._isEnabled = false;
                this.restartServer();
            });

            ws.on('error', (error) => {
                Logger.error(error);
                this._isEnabled = false;
            });

            ws.send(200);
        });
    }

    public onMessage(callback: (ws: WebSocket, data: any) => void) {
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