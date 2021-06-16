// import { withDynamicData } from "@quick-qui/data-provider";
import { Info } from "@quick-qui/model-defines";
import { implementationGlobal } from "@quick-qui/implementation-model";
import { evaluateInObject } from "@quick-qui/model-defines";
import { localStorageDp } from "@quick-qui/data-provider";
// function insureStorage(info: Info): object | undefined {
//   const localStorageString = localStorage.getItem(`data-provider-${info.name}`);
//   if (!localStorageString) {
//     if (info.default) {
//       const evaluatedDefault = evaluateInObject(info.default, {
//         env: implementationGlobal.env,
//         dp: implementationGlobal.dp
//       });
//       writeToStorage(info, evaluatedDefault);
//       return insureStorage(info);
//     }
//     return undefined;
//   }
//   return JSON.parse(localStorageString);
// }
// function writeToStorage(info: Info, data: object) {
//   localStorage.setItem(`data-provider-${info.name}`, JSON.stringify(data));
// }
export async function createDataProvider(info: Info) {
  let init: any = undefined;
  if (info.default) {
    init = (await evaluateInObject(info.default, {
      env: implementationGlobal.env,
      dp: implementationGlobal.dp,
    }))[0]
  }
  
  return localStorageDp(`data-provider-${info.name}`, init);
}
