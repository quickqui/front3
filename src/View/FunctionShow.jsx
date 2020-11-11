import React from "react";
import { Show, SimpleShowLayout } from "react-admin";

import { showingFields } from "./ShowingFields";
import * as R from "ramda";

import { replaceInObject } from "@quick-qui/util";
import { evaluate } from "../Util";
import { connectForEventListen } from "../event/events";

const _FunctionShow = (props) => {
  const { functionModel, model, presentation } = props;
  const resource = functionModel.resource;
  const basePath = "/" + resource;
  const entity = (model.entities ?? []).find(R.propEq("name", resource));
  const parameters = functionModel.parameters;

  function normalizedParameters(parameters) {
    return replaceInObject(parameters, /\$\{(.*)\}/, (result) =>
      evaluate(model.original, { event: props.event?.payload }, result)
    );
  }
  const id =
    props.location?.state?.id ??
    (parameters && normalizedParameters(parameters))?.["id"];
  if (!id) return null;
  return (
    <Show basePath={basePath} resource={resource} id={id} {...props}>
      <SimpleShowLayout>
        {showingFields(entity, model, presentation)}
      </SimpleShowLayout>
    </Show>
  );
};

export const FunctionShow = connectForEventListen(
  "selectedChanged",
  _FunctionShow
);
