import React, { useState, useEffect } from "react";
import { List, Datagrid, useRefresh } from "react-admin";
import { listingFields } from "./ListingFields";
import { connectForEventListen } from "../event/events";

import _ from "lodash";
import * as R from "ramda";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { evaluateInObject } from "@quick-qui/model-defines";
import { findInfos, getEventNames } from "@quick-qui/model-defines";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { uiEventEmitAction } from "../event/events";
import { getEventName } from "../Util";

import { EVENT_NAME_SELECTED_CHANGED } from "../Model";

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

const FunctionListIn = (functionModel, model, presentation) => {
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

  const entity = model.getEntityFromResource(resource);
  const parameters = functionModel.parameters;

  const FL = (props) => {
    function normalizedParameters(parameters) {
      const re = evaluateInObject(parameters, {
        event: props.event,
        model: model.original,
      });
      return re;
    }
    const theme = useTheme();

    const refresh = useRefresh();
    const [selectedId, setSelectedId] = useState(props.selectedId);
    const [versionState, setVersion] = useState(0);
    useEffect(() => {
      if (parameters) {
        const __ = normalizedParameters(parameters)?.then(([ps]) => {
          const version = ps?.version ?? 0;
          if (version !== versionState) {
            refresh();
            setVersion(version);
          }
        });
      }
    });
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
        //
        //有点问题啊，filter不是应该用parameters？
        //从prototype来看，list用的是filter，edit、show用的是parameters[id]

        // filters={filters}
        sort={sort}
        {...props}
      >
        <Datagrid
          rowClick={(selectedId) => {
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
                uiEventEmitAction(
                  { selectedId },
                  EVENT_NAME_SELECTED_CHANGED,
                  eventName
                )
              );
            }
            setSelectedId(selectedId);
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
                  <FunctionButton
                    key={page.name}
                    page={page}
                    text={link.label}
                  />
                );
              } else {
                return undefined;
              }
            })}
        </Datagrid>
      </List>
    );
  };
  return FL;
};
export const FunctionList = (functionModel, model, presentation) => {
  const infos = getEventNames(
    model.original,
    findInfos(functionModel.parameters)
  );
  return connectForEventListen(
    (event) => infos.includes(event.name),
    FunctionListIn(functionModel, model, presentation)
  );
};
