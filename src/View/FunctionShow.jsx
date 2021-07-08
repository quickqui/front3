import React, { useState, useEffect } from "react";
import { Show, SimpleShowLayout, useRefresh } from "react-admin";

import { showingFields } from "./ShowingFields";
import * as R from "ramda";

import { connectForEventListen } from "../event/events";

import { evaluateInObject } from "@quick-qui/model-defines";
import { findInfos, getEventNames } from "@quick-qui/model-defines";
const _FunctionShow = (functionModel, model, presentation) => {
  const resource = functionModel.resource;
  const basePath = "/" + resource;
  const entity = model.getEntityFromResource(resource);
  const parameters = functionModel.parameters;
  const FS = (props) => {
    function normalizedParameters(parameters) {
      const re = evaluateInObject(parameters, {
        event: props.event,
        model: model.original,
      });
      return re;
    }
    const refresh = useRefresh();
    const [idState, setIdState] = useState(props.location?.state?.id);
    const [versionState, setVersion] = useState(0);
    useEffect(() => {
      if (parameters) {
        const __ = normalizedParameters(parameters)?.then(([ps]) => {
          setIdState(ps?.id);
          const version = ps?.version ?? 0;
          if (version !== versionState) {
            refresh();
            setVersion(version);
          }
        });
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
          version={versionState}
          {...props}
        >
          <SimpleShowLayout>
            {showingFields(entity, model, presentation)}
          </SimpleShowLayout>
        </Show>
      );
  };
  return FS;
};

export const FunctionShow = (functionModel, model, presentation) => {
  const infos = getEventNames(
    model.original,
    findInfos(functionModel.parameters)
  );
  return connectForEventListen(
    (event) => infos.includes(event.name),
    _FunctionShow(functionModel, model, presentation)
  );
};
