import React from "react";
import { Create, SimpleForm, Toolbar, SaveButton } from "react-admin";
import { FormPrefill } from "../Component/FormPrefill";
import {withoutAbstract} from '@quick-qui/model-defines'
import { editingFieldsForCommand } from "./EditingFields";
const CommandToolbar = props => {
  const { functionModel, model } = props;
  const redirectFunction = functionModel.redirect
    ? withoutAbstract( model.functionModel.functions).find(f => f.name === functionModel.redirect)
    : undefined;
  return (
    <Toolbar {...props}>
      <SaveButton
        label={functionModel.name}
        redirect={redirectFunction ? "/" + redirectFunction.name : false}
      ></SaveButton>
    </Toolbar>
  );
};
export const FunctionCommand = props => {
  const { functionModel, model, presentation } = props;
  const resource = functionModel.resource;
  const basePath = "/" + resource;

  function copyArgsToPrefill() {
    const prefill = functionModel.command?.prefill ?? {};

    const re = { ...prefill };
    return re;
  }
  return (
    <Create basePath={basePath} resource={resource} {...props}>
      <FormPrefill
        prefill={{
          ...copyArgsToPrefill()
        }}
      >
        {
          //TODO bug？ redirect之后没有刷新。至少是realtime 自动刷新没有起作用。
        }
        <SimpleForm toolbar={<CommandToolbar {...props}></CommandToolbar>}>
          {editingFieldsForCommand(functionModel, model, presentation)}
        </SimpleForm>
      </FormPrefill>
    </Create>
  );
};
