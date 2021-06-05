import _ from "lodash";
import axios from "axios";

export const env: Promise<{implementationName:string}> = axios
  .get("/runtimeEnv")
  .then((_) => ({ implementationName: _.data.IMPLEMENTATION_NAME }));
