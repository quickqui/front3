import axios from "axios";
import { resolve } from "../Resolve";
import { model } from "../Model/Model";
import createRealtimeSaga from "./createRealtimeSaga";
import {
  DataProvider,
  DataProviderParams,
  chain,
  forResource,
} from "@quick-qui/data-provider";
import { parseRefWithProtocolInsure } from "@quick-qui/model-defines";
import { withInfoModel, Info } from "@quick-qui/model-defines";
import { createDataProvider as localStorageDp } from "./LocalStorageDp";
import { createDataProvider as sessionStorageDp } from "./SessionStorageDp";
import _ from "lodash";
import { notNil } from "@quick-qui/util";

const backEndDataProvider: DataProvider = (
  type: string,
  resource: string,
  params: DataProviderParams<any>
) => {
  const json = { type, resource, params };
  return axios.post(`/app-server/dataProvider`, json).then((r) => r.data);
};
const modelDataProvider: DataProvider = (
  type: string,
  resource: string,
  params: DataProviderParams<any>
) => {
  const json = { type, resource, params };
  return axios.post(`/model-server/dataProvider`, json).then((r) => r.data);
};
const thisEndDataProvider: Promise<
  { dataProvider: DataProvider; realtimeSagas: any[] } | undefined
> = (async () => {
  //TODO exchange to ==back的时候如何使用realtime？ 应该也可以realtime才对呀。

  const infoModel = withInfoModel(await model)?.infoModel;
  const infos =
    infoModel?.infos.filter((info: Info) => {
      //TODO 什么样的info大概会在front实现？
      return (
        info.type === "resource" &&
        info.annotations?.implementation?.at === "front"
      );
    }) ?? [];
  if (_.isEmpty(infos)) return undefined;
  const realtimeSagas: any[] = [];
  const providers: Promise<DataProvider | undefined>[] = infos.map(
    getDataProvider
  );

  return Promise.all(providers)
    .then((dataPS) => dataPS.filter(notNil).reduce(chain))
    .then((ps) => {
      return { dataProvider: ps, realtimeSagas: realtimeSagas };
    });
})();

export const dataProvider: Promise<
  [DataProvider, any[]]
> = thisEndDataProvider.then((dpr) => {
  const dp = dpr?.dataProvider;
  const realtimeSagas = dpr?.realtimeSagas;
  const provider = chain(
    dp ? chain(dp, backEndDataProvider) : backEndDataProvider,
    modelDataProvider
  );
  return [provider, realtimeSagas?.map((s) => s(provider)) ?? []];
});

async function getDataProvider(info: Info): Promise<DataProvider | undefined> {
  let dataProvider: DataProvider | undefined = undefined;
  if (info.annotations?.implementation?.source?.startsWith("resolve"))
    dataProvider = await resolve<DataProvider>(
      parseRefWithProtocolInsure(info.annotations?.implementation?.source).path
    );
  else if (info.annotations?.implementation?.source === "storage") {
    if (info.scope === "local" || info.scope === "config") {
      dataProvider =await localStorageDp(info)
    } else if (info.scope === "session") {
      dataProvider = await sessionStorageDp(info)
    }
  }
  if (!dataProvider) return undefined;
  return forResource(info.resources!, dataProvider!);
}
