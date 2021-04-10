import React from "react";
import { Show, SimpleShowLayout } from "react-admin";

import { showingFields } from "./ShowingFields";
import * as R from "ramda";

import { connectForEventListen } from "../event/events";

import {evaluateInObject} from '@quick-qui/model-defines'

const _FunctionShow = (props) => {
  const { functionModel, model, presentation ,...passingProps} = props;
  const resource = functionModel.resource;
  const basePath = "/" + resource;
  const entity = (model.entities ?? []).find(R.propEq("name", resource));
  const parameters = functionModel.parameters;

  function normalizedParameters(parameters) {
    return evaluateInObject(parameters, {
      event: props.event?.payload,
      model: model.original,
    });
  }
  const id =
    props.location?.state?.id ??
    (parameters && normalizedParameters(parameters))?.["id"];
  if (!id) return null;
  return (
    <Show basePath={basePath} resource={resource} id={id} {...passingProps}>
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
