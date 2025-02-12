import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:8080/ws-chat";

window.global ||= window;

export const stompClient = new Client({
  brokerURL: SOCKET_URL,
  connectHeaders: {},
  debug: (str) => console.log(str),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  webSocketFactory: () => new SockJS(SOCKET_URL),
});
