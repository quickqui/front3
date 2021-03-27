import React, { useState } from "react";
import { List, Datagrid } from "react-admin";
import { listingFields } from "./ListingFields";

import _ from "lodash";
import * as R from "ramda";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { selectedChangedAction } from "../event/events";
import {getEventName} from '../Util'
const FunctionButton = ({ record, page, text }) => {
  return (
    <Button
      color="primary"
      component={Link}
      to={{
        pathname: "/" + page.name,
        //TODO id是否不应该特殊化。
        //TODO page如果有参数从这里传入。

        state: { id: record.id },
        // hash:JSON.stringify({id:record.id})
      }}
    >
      {text}
    </Button>
  );
};

const FunctionListIn = (props) => {
  const { model, functionModel, presentation } = props;
  const resource = functionModel.resource;
  const location = { pathname: resource };

  const basePath = "/" + resource;
  const filter = functionModel.query?.filter;
  const sort =
    functionModel.sort &&
    _(functionModel.sort)
      .map((value, key) => {
        return { field: key, order: value };
      })
      .value()[0];

  const entity = model.entities.find(R.propEq("name", resource));

  const theme = useTheme();
  const [selectedId, setSelectedId] = useState(props.selectedId);
  return (
    <List
      location={location}
      basePath={basePath}
      resource={resource}
      hasCreate={false}
      hasEdit={false}
      hasList={false}
      hasShow={false}
      filter={filter}
      //TODO filters没那么紧急，filter比较紧急，filter用来functions之间传递协作，filters用来用户输入。
      // https://marmelab.com/react-admin/List.html#filters-filter-inputs
      // functionModel里面没有filters，只有filter，原因如上所述。用户输入属于function实现的一部分，而filter属于参数。
      // filters={}
      sort={sort}
      {...props}
    >
      <Datagrid
        rowClick={(id) => {
          // eslint-disable-next-line no-unused-expressions
          const infoE = functionModel?.parameters?.out?.selectedChanged;
          //TODO 支持更多的事件。
          //TODO 如何综合到submit事件？ 等。
          if (infoE) {
            const eventName = getEventName(
              model.original,
              /\$\{(.*)\}/.exec(infoE)
            );
            const _ = props?.dispatch?.(
              selectedChangedAction(id, "selectedChanged", eventName)
            );
          }
          setSelectedId(id);
          return;
        }}
        rowStyle={(record) => {
          return record.id === selectedId
            ? { backgroundColor: theme.palette.action.selected }
            : undefined;
        }}
      >
        {listingFields(entity, model, presentation)}
        {functionModel.links
          ?.filter((link) => link.type === "entity")
          ?.map((link) => {
            const page = model.pageModel.pages.find(
              (page) =>
                page.name === link.page ||
                page.name === `oneFunctionPage${link.page}`
            );
            if (page) {
              return (
                <FunctionButton key={page.name} page={page} text={link.label} />
              );
            } else {
              return undefined;
            }
          })}
      </Datagrid>
    </List>
  );
};

export const FunctionList = connect()(FunctionListIn);
