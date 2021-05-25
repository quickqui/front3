import React from "react";
import * as R from "ramda";

import { Create, SimpleForm, Toolbar, SaveButton } from "react-admin";
import { FormPrefill } from "../Component/FormPrefill";
import { withoutAbstract ,validation} from "@quick-qui/model-defines";
import { editingFields } from "./EditingFields";

const CommandToolbar = (props) => {
  const { functionModel, model } = props;
  const redirectFunction = withoutAbstract(model.functionModel.functions).find(
    (f) => f.name === functionModel.command.redirect
  );
  return (
    <Toolbar {...props}>
      <SaveButton
        label={functionModel.name}
        redirect={redirectFunction ? "/" + redirectFunction.name : false}
      ></SaveButton>
    </Toolbar>
  );
};
export const FunctionCommand = (props) => {
  const { functionModel, model, presentation } = props;
  const resource = functionModel.resource;
  const basePath = "/" + resource;
  const entity = (model.entities ?? []).find(R.propEq("name", resource));
  
  function copyArgsToPrefill() {
    const prefill = functionModel.command?.prefill ?? {};

    const re = { ...prefill };
    return re;
  }
  const validate=entity?validation(entity):(values)=>{}
  return (
    <Create basePath={basePath} resource={resource} {...props}>
      <FormPrefill
        prefill={{
          ...copyArgsToPrefill(),
        }}
      >
        {
          //TODO bug？ redirect之后没有刷新。至少是realtime 自动刷新没有起作用。
        }
        <SimpleForm
          toolbar={<CommandToolbar {...props}></CommandToolbar>}
          validate={validate}
        >
          {/* 这里先暂时用跟create完全一样的东西，要如何区别或者没有区别，需要进一步考虑 */}
          {editingFields(entity, model, presentation)}
        </SimpleForm>
      </FormPrefill>
    </Create>
  );
};
