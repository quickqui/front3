import React from "react";
import {
  Page,
  Function,
  getNameWithCategory,
  StringKeyObject,
  Presentation,
  REF_RESOLVE,
  parseRef
} from "@quick-qui/model-defines";
import { ModelWrapped } from "../Model";

import { FunctionList } from "../View/FunctionList";
import { FunctionEdit } from "../View/FunctionEdit";
import { FunctionCreate } from "../View/FunctionCreate";
import { FunctionCommand } from "../View/FunctionCommand";
import { FunctionShow } from "../View/FunctionShow";
import { IconCardView } from "../View/IconCardView";
import {FunctionContinuousEdit} from "../View/FunctionContinuousEdit";
import { findPresentation } from "../View/PresentationUtil";
import { resolveWithOutDefault } from "../Resolve";

export function getPage(page: Page, model: ModelWrapped, props: any) {
  //TODO 目前只考虑支持流式布局
  /*
  pages:
  - menuPath: Dashboard
    layout:
      gride: 3
    places:
      - function: ListProduct
        layout: 
          size: 2
        presentation: compactList
 */

  const grid = +page?.layout?.["grid"] ?? 3;
  const gridStyle = {
    container: {
      display: "grid",
      "grid-template-columns": "auto ".repeat(grid).trim()
    },
    item: {
      marginTop: "2em",
      marginRight: "2em"
    }
  };

  return (
    <>
      <div style={gridStyle.container}>
        {page.places.map(place => {
          const functionName = place.function;
          const fn = model.functions.find(
            (fun: Function) => functionName === fun.name
          );
          if (fn) {
            const size = place.layout?.size ?? 1;
            const itemStyle = {
              gridColumn: `span ${size}`
            };
            const presentation = findPresentation(
              model,
              place.presentation,
              fn.resource
            );

            return (
              <div
                key={fn.name}
                style={{
                  ...gridStyle.item,
                  ...itemStyle
                }}
              >
                {" "}
                <React.Suspense fallback={<div>Loading...</div>}>
                  {getByFunction(fn, model, presentation, props)}
                </React.Suspense>
              </div>
            );
          } else {
            return undefined;
          }
        })}
        {/* <OverrideTitle title={page.name}></OverrideTitle> */}
      </div>
    </>
  );
}
function getByFunction(
  fun: Function,
  model: ModelWrapped,
  presentation: Presentation | undefined,
  props: any
) {
  const baseFunction = fun.annotations?.["implementation"];
  if (baseFunction) {
    let type: any;
    const { protocol, path } = parseRef(baseFunction);
    if (protocol === REF_RESOLVE) {
      type = React.lazy(() => resolveWithOutDefault(path));
    } else {
      const { category, name } = getNameWithCategory(baseFunction);
      if (category === "provided") {
        const mapToType: StringKeyObject = {
          command: FunctionCommand,
          create: FunctionCreate,
          edit: FunctionEdit,
          list: FunctionList,
          show: FunctionShow,
          view: FunctionShow,
          iconCard: IconCardView,
          continuousEdit: FunctionContinuousEdit
        };
        type = mapToType[name];
        if (!type) {
          throw new Error(`not supported function - ${name}`);
        }
      }
    }
    if (type) {
      return React.createElement(type, {
        key: fun.name,
        functionModel: fun,
        model,
        presentation,
        // title,
        ...props
      });
    } else {
      throw new Error("can not find implementation type");
    }
  }
  throw new Error(`not provided function`);
}
