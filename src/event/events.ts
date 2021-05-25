import { v4 as uuidV4 } from "uuid";
import { connect } from "react-redux";
import _ from "lodash";
function meta(eventType: string, eventName: string) {
  return {
    id: uuidV4(),
    timestamp: new Date(),
    type: eventType,
    name: eventName,
    version: (new Date()).getTime()
  };
}
export const uiEventEmitAction = (
  eventObject: any,
  eventType: string,
  eventName: string
) => {
  return {
    type: "QQ/EVENT/" + eventType,
    payload: {
      event: { ...meta(eventType, eventName), payload: { ...eventObject } },
    },
  };
};

export const connectForEventListen = (
  f: (obj: object) => boolean,
  component: any
) => {
  return connect((state: any) => {
    return {
      event: _(state.events.eventLog).filter(f).last(),
    };
  })(component);
};
