import React, { PureComponent, createElement } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import MoreHoriz from "@material-ui/icons/MoreHoriz";

import * as icons from "@material-ui/icons";

import { withRouter } from "react-router-dom";
import {
  MenuItemLink,
  getResources,
  translate
} from "react-admin";

import SubMenu from "../Component/SubMenu";
import { filesToTreeNodes } from "../Util";
import * as _ from "lodash";

class Menu extends PureComponent {
  state = {
    // menuCatalog: false,
    // menuSales: false,
    // menuCustomers: false,
  };

  handleToggle = menu => {
    this.setState(state => ({ [menu]: !state[menu] }));
  };

  toTree = model => {
    const withPath = _.compact(
      model.pageModel?.pages?.map(page => {
        if (page.menuPath) {
          return {
            path: page.menuPath,
            object: page
          };
        } else return undefined;
      })
    );
    const tree = filesToTreeNodes(withPath);
    return tree;
  };

  toElement = (treeNode, open, onMenuClick) => {
    if (treeNode.isDirectory) {
      return (
        <SubMenu
          handleToggle={() => this.handleToggle(treeNode.pathString)}
          isOpen={this.state[treeNode.pathString]}
          sidebarIsOpen={open}
          name={treeNode.name}
          icon={<MoreHoriz />}
          key={treeNode.path}
        >
          {treeNode.children.map(ch => this.toElement(ch, open, onMenuClick))}
        </SubMenu>
      );
    } else {
      return (
        <MenuItemLink
          to={"/" + treeNode.object.name}
          primaryText={treeNode.name}
          leftIcon={createElement(
            icons[treeNode.object?.icon ?? "ArrowRightAlt"] ??
              icons["ArrowRightAlt"]
          )}
          onClick={onMenuClick}
          key={treeNode.path}
        />
      );
    }
  };

  render() {
    const { onMenuClick, resources, open } = this.props;
    if (!resources) {
      return <div></div>;
    }
    const model = resources[0].options.model;

    const functionTree = this.toTree(model);

    return (
      <div>
        {functionTree.map(_ => this.toElement(_, open, onMenuClick))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  open: state.admin.ui.sidebarOpen,
  theme: state.theme,
  locale: state.i18n.locale,
  resources: getResources(state)
});

const enhance = compose(withRouter, connect(mapStateToProps, {}), translate);

export default enhance(Menu);
