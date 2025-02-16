import { IpcMainInvokeEvent } from "electron";
import WebSocketService from "../service/WebSocketService";

export default function webSocketServerCheckHandler(e: IpcMainInvokeEvent) {
  const webSocketService = WebSocketService.getInstance();

  return webSocketService.isEnabled;
}