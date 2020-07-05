// in src/customRoutes.js
import React from "react";
import { Route } from "react-router-dom";

import { getPage } from "./page/Page";

export default function(model) {
  return (model.pageModel?.pages ?? [])
    .map(page => {
      return getRoute(page, model);
    })
    .flat();
}
function getRoute(page, model) {
  return (
    <Route
      exact
      path={"/" + page.name}
      key={page.name}
      render={props => getPage(page, model, props)}
    />
  );
}
