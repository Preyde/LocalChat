import { serve } from "https://deno.land/std@0.89.0/http/mod.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket
} from "https://deno.land/std@0.89.0/ws/mod.ts";

const PORT = 8000;

const connectedClients = new Map<number, WebSocket>()


for await (const req of serve(`:${PORT}`)) {
  if (req.url === "/ping") {
    req.respond({ status: 200 })
    continue
  }
  const { conn, r: bufReader, w: bufWriter, headers } = req;
  acceptWebSocket({
    conn,
    bufReader,
    bufWriter,
    headers,
  })
    .then(handleWs)
    .catch(async (err) => {
      console.error(`failed to accept websocket: ${err}`);
      await req.respond({ status: 400 });
    });
}

async function handleWs(sock: WebSocket) {
  connectedClients.set(sock.conn.rid, sock)
  console.log("New User joined the chat");
  try {
    for await (const ev of sock) {
      if (typeof ev === "string") {
        // text message.

        for (let socket of connectedClients.values()) {
          socket.send(ev)
        }
      } else if (ev instanceof Uint8Array) {
        // binary message.
        console.log("ws:Binary", ev);
      } else if (isWebSocketPingEvent(ev)) {
        const [, body] = ev;
        // ping.
        console.log("ws:Ping", body);
      } else if (isWebSocketCloseEvent(ev)) {
        // close.
        const { code, reason } = ev;
        console.log("ws:Close", code, reason);
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);

    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}
