import { withDynamicData } from "@quick-qui/data-provider";
import { Info } from "@quick-qui/model-defines";

function insureStorage(info: Info): object | undefined {
  const localStorageString = localStorage.getItem(`data-provider-${info.name}`);
  if (!localStorageString) {
    if (info.init) {
      writeToStorage(info, info.init);
      return insureStorage(info);
    }
    return undefined;
  }
  return JSON.parse(localStorageString);
}
function writeToStorage(info: Info, data: object) {
  localStorage.setItem(`data-provider-${info.name}`, JSON.stringify(data));
}
export function createDataProvider(info: Info) {
  return withDynamicData(
    () => insureStorage(info),
    (data: any) => writeToStorage(info, data)
  );
}
