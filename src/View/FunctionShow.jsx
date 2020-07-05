import React from "react";
import { Show, SimpleShowLayout } from "react-admin";

import { showingFields } from "./ShowingFields";
import * as R from "ramda";

export const FunctionShow = props => {
  const { functionModel, model, presentation } = props;
  const resource = functionModel.resource;
  const basePath = "/" + resource;
  const entity = (model.entities ?? []).find(R.propEq("name", resource));
  const id = props.location?.state?.id ?? functionModel.parameters?.["id"];

  return (
    <Show basePath={basePath} resource={resource} id={id} {...props}>
              <SimpleShowLayout>

      {showingFields(entity, model, presentation)}
      </SimpleShowLayout>
    </Show>
  );
};
