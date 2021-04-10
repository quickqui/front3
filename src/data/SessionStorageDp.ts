import { withDynamicData } from "@quick-qui/data-provider";
import { Info, implementationGlobal } from "@quick-qui/model-defines";
import { evaluateInObject } from "@quick-qui/model-defines";
function insureStorage(info: Info): object | undefined {
  const sessionStorageString = sessionStorage.getItem(
    `data-provider-${info.name}`
  );
  if (!sessionStorageString) {
    if (info.default) {
      const evaluatedDefault = evaluateInObject(info.default, {
        env: implementationGlobal.env,
        dp: implementationGlobal.dp,
      });
      writeToStorage(info, evaluatedDefault);
      return insureStorage(info);
    }
    return undefined;
  }
  return JSON.parse(sessionStorageString);
}
function writeToStorage(info: Info, data: object) {
  sessionStorage.setItem(`data-provider-${info.name}`, JSON.stringify(data));
}
export function createDataProvider(info: Info) {
  return withDynamicData(
    () => insureStorage(info),
    (data: any) => writeToStorage(info, data)
  );
}
