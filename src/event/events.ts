import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import _ from "lodash";
function meta(eventType: string, eventName: string) {
  return {
    id: uuidv4(),
    timestamp: new Date(),
    type: eventType,
    name: eventName,
  };
}
export const selectedChangedAction = (
  id: any,
  eventType: string,
  eventName: string
) => {
  return {
    type: "QQ/EVENT/" + eventType,
    payload: { id, event: meta(eventType, eventName) },
  };
};

export const connectForEventListen = (eventType: string, component: any) => {
  return connect((state: any) => {
    return {
      event: _(state.eventLog["QQ/EVENT/" + eventType] ?? []).last(),
    };
  })(component);
};
