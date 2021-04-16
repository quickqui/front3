import React, { useState, useEffect } from "react";
import { Show, SimpleShowLayout } from "react-admin";

import { showingFields } from "./ShowingFields";
import * as R from "ramda";

import { connectForEventListen } from "../event/events";

import { evaluateInObject } from "@quick-qui/model-defines";

const _FunctionShow = (props) => {
  const { functionModel, model, presentation, ...passingProps } = props;
  const resource = functionModel.resource;
  const basePath = "/" + resource;
  const entity = (model.entities ?? []).find(R.propEq("name", resource));
  const parameters = functionModel.parameters;

  function normalizedParameters(parameters) {
    const re=
    evaluateInObject(parameters, {
      event: props.event?.payload,
      model: model.original,
    });
    return re
  }
  const [idState, setIdState] = useState(props.location?.state?.id);
  useEffect(() => {
    if (parameters) {
      const __ = normalizedParameters(parameters)?.then(([ps]) =>
        setIdState(ps.id)
      );
    }
  });
  if (!idState) {
    return <div>no id find</div>;
  } else
    return (
      <Show
        basePath={basePath}
        resource={resource}
        id={idState}
        {...passingProps}
      >
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
