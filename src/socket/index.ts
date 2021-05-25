import { eventChannel, EventChannel } from "redux-saga";
import { take, call, put, ChannelTakeEffect } from "redux-saga/effects";

function url(s: string) {
  var l = window.location;
  return (l.protocol === "https:" ? "wss://" : "ws://") + l.host + s;
}
const wsUrl = url("/app-server/ws");

function initWebsocket(): EventChannel<unknown> {
  return eventChannel((emitter) => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log("opening...");
      ws.send("hello server");
    };
    ws.onerror = (error) => {
      console.log("WebSocket error " + error);
      console.dir(error);
    };
    ws.onmessage = (e) => {
      let msg = null;
      try {
        msg = JSON.parse(e.data);
      } catch (e) {
        console.error(`Error parsing : ${e.data}`);
      }
      if (msg) {
        const { type, payload } = msg;
        // console.info(type);
        // console.info(payload);
        return emitter(msg);
      }
    };
    // unsubscribe function
    return () => {
      console.log("Socket off");
    };
  });
}
export function* wsSagas() {
  const channel: EventChannel<unknown> = yield call(initWebsocket);
  while (true) {
    const action: ChannelTakeEffect<unknown> = yield take(channel);
    yield put(action);
  }
}
