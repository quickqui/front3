import _ from "lodash";
import { filterObject, no } from "./Util";



export const env: {
  modelUrl: string;
  appServerUrl: string;
  extendPath: string;
} = (() => {
  const defaults = {
    modelUrl: "http://localhost:1111",
    appServerUrl: "http://localhost:4000"
  };

  return _.assign(
    {},
    defaults,
    filterObject({
      modelUrl: process.env.MODEL_URL || process.env.REACT_APP_MODEL_URL,
      appServerUrl:
        process.env.APP_SERVER_URL || process.env.REACT_APP_SERVER_URL,
        //TODO 不能支持比model path/node-modules 的情况？
      extendPath:
        (process.env.EXTEND_PATH || process.env.REACT_APP_EXTEND_PATH) ??
        no("EXTEND_PATH")
    })
  );
})();
