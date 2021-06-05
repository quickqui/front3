import { resolve } from "../Resolve";
import { model } from "../Model/Model";
import {
  withImplementationModel,
  Implementation,
  parseRefWithProtocolInsure,
} from "@quick-qui/model-defines/";
import { env } from "../Env";

export const onInit = async () => {
  const e = await env;
  console.log("env in did init -");
  console.log(e);
  const onInitName: any | undefined = withImplementationModel(
    await model
  )?.implementationModel?.implementations?.find(
    (implementation: Implementation) =>
      implementation.name === e.implementationName
  )?.lifeCycle?.["init"];
  if (onInitName) {
    const initFu = await resolve<() => void>(
      parseRefWithProtocolInsure(onInitName).path
    );
    initFu();
  } else {
    //! don nothing here.
  }
};
