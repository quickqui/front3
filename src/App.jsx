// in App.js
import React, { Component } from "react";
import { Admin, Resource } from "react-admin";

import _ from "lodash";

import { ModelWrapped } from "./Model/Model";
import Menu from "./View/Menu";
import { onInit } from "./life/frontLife";

import customRoutes from "./customRoutes";
import authProvider from "./authProvider";
import { withoutAbstract } from "@quick-qui/model-defines";
import dp3 from "./data/dp3";

import { model } from "./Model/Model";

import { dataProvider as dp } from "./data/dataProvider";

class App extends Component {
  constructor() {
    super();
    this.state = { dataProvider: null, model: null };
  }
  componentDidMount() {
    onInit().then(() => {
      //TODO 处理404，也就是model没有，但有logs。，包括要从其他错误中区分出来。
      dp.then((dataProvider) =>
        this.setState({ ...this.state, dataProvider: dataProvider })
      );
      model.then((data) => {
        //TODO inject implementationGlobals
        const model =  new ModelWrapped(data)
        const functions = withoutAbstract(model.functionModel?.functions) ?? [];
        const entityNames = (model.domainModel?.entities ?? []).map(
          (entity) => entity.name
        );

        const resources = _(functions.map((fun) => fun.resource))
          .concat(entityNames)
          .compact()
          .uniq()
          .value();

        this.setState({
          ...this.state,
          model,
          resources,
        });
      });
    });
  }

  render() {
    const { dataProvider, model, resources } = this.state;

    // if (!dataProvider || !model || !resources || resources.length===0) {
    if (!dataProvider || !model || !resources ) {
      return <div>Loading</div>;
    }
   

    return (
      <Admin
        customRoutes={customRoutes(model)}
        menu={Menu}
        dataProvider={dp3(dataProvider[0])}
        // customSagas={dataProvider[1]}

        // authProvider={authProvider}
      >
        {resources.map((resource) => {
          return (
            <Resource options={{ model }} name={resource} key={resource} />
          );
        })}
      </Admin>
    );
  }
}

export default App;
