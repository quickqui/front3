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
import {
  withExchangeModel,
  parseRefWithProtocolInsure,
} from "@quick-qui/model-defines";

import _ from "lodash";

const backEndDataProvider: DataProvider = (
  type: string,
  resource: string,
  params: DataProviderParams<any>
) => {
  const json = { type, resource, params };
  return axios.post(`/app-server/dataProvider`, json).then((r) => r.data);
};
const thisEndDataProvider: Promise<
  { dataProvider: DataProvider; realtimeSagas: any[] } | undefined
> = (async () => {
  const exchangeModel = withExchangeModel(await model)?.exchangeModel;
  const exchanges =
    exchangeModel?.exchanges?.filter((exchange) => {
      //TODO exchange to ==back的时候如何使用realtime？ 应该也可以realtime才对呀。
      return exchange.to === "front"; //&& exchange.from !== "fake";
      // return exchange.to === "back" //&& exchange.from !== "fake";
    }) ?? [];
  if (_.isEmpty(exchanges)) return undefined;
  const realtimeSagas = exchanges
    .map((exchange) => {
      const realtime = exchange.parameters?.["realtime"];
      if (realtime) {
        //TODO 支持多resource的exchange的realtime
        //TODO realtimeSaga 好像被从ra3.0撤出了，看看之后怎么支持realtime
        return [createRealtimeSaga(exchange.resources[0], realtime)];
      } else {
        return [];
      }
    })
    .flat();
  const providers = exchanges.map(async (exchange) => {
    //TODO 支持extension以外的方式
    const dataProvider = await resolve<DataProvider>(
      parseRefWithProtocolInsure(exchange.annotations?.["implementation"]!).path
    );
    return forResource(exchange.resources, dataProvider);
  });

  return Promise.all(providers)
    .then((dataPS) => dataPS.reduce(chain))
    .then((ps) => {
      return { dataProvider: ps, realtimeSagas: realtimeSagas };
    });
})();

export const dataProvider: Promise<[
  DataProvider,
  any[]
]> = thisEndDataProvider.then((dpr) => {
  const dp = dpr?.dataProvider;
  const realtimeSagas = dpr?.realtimeSagas;
  const provider = dp ? chain(dp, backEndDataProvider) : backEndDataProvider;
  return [provider, realtimeSagas?.map((s) => s(provider)) ?? []];
});
