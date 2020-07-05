import React from "react";
import { Create, SimpleForm } from "react-admin";
import { FormPrefill } from "../Component/FormPrefill";

import { editingFields } from "./EditingFields";
import * as R from "ramda";
import { withoutAbstract } from "@quick-qui/model-defines";


export const FunctionCreate = props => {
  const { functionModel, model ,presentation} = props;
  const resource = functionModel.resource;
  const basePath = "/" + resource;
  const entity = (model.entities ?? []).find(R.propEq("name", resource));
  const redirectFunction = functionModel.redirect
    ? withoutAbstract(model.functionModel.functions).find(
        f => f.name === functionModel.redirect
      )
    : undefined;

  function copyArgsToPrefill() {
    const prefill = functionModel.command?.prefill ?? {};
    const re = { ...prefill };
    return re;
  }
  return (
    <Create basePath={basePath} resource={resource} {...props}>
      <FormPrefill
        prefill={{
          ...copyArgsToPrefill(),
          createdAt: undefined,
          updatedAt: undefined
        }}
      >
        {
          //TODO bug？ redirect之后没有刷新。至少是realtime 自动刷新没有起作用。
        }
        <SimpleForm
          redirect={redirectFunction ? "/" + redirectFunction.name : false}
        >
          {editingFields(entity, model,presentation)}
        </SimpleForm>
      </FormPrefill>
    </Create>
  );
};
