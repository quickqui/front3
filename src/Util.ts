import * as R from "ramda";
import { Model } from "@quick-qui/model-core";
import { withInfoModel, parseExpr, findInfo } from "@quick-qui/model-defines";
import _ from "lodash";
export interface TreeNode<T> {
  isDirectory: boolean;
  children: TreeNode<T>[];
  name: string;
  path: string | string[];
  pathString: string;
  object: T;
}
export interface WithPath<T> {
  path: string | string[];
  object: T;
}

//NOTE directory节点的path和pathString有问题。但似乎不影响？
export function filesToTreeNodes<T>(arr: WithPath<T>[]): TreeNode<T>[] {
  var tree = {};
  function addNode(obj: WithPath<T>) {
    var splitPath: string[] =
      R.type(obj.path) === "String"
        ? (obj.path as string).replace(/^\/|\/$/g, "").split("/")
        : (obj.path as string[]);
    var ptr: any = tree;
    for (let i = 0; i < splitPath.length; i++) {
      let node: TreeNode<T> = {
        name: splitPath[i],
        children: [],
        isDirectory: true,
        path: obj.path,
        object: obj.object,
        pathString:
          R.type(obj.path) === "String"
            ? (obj.path as string)
            : (obj.path as string[]).join("/"),
      };
      if (i === splitPath.length - 1) {
        node.isDirectory = false;
      }
      ptr[splitPath[i]] = ptr[splitPath[i]] || node;
      ptr[splitPath[i]].children = ptr[splitPath[i]].children || {};
      ptr = ptr[splitPath[i]].children;
    }
  }
  function objectToArr(node: any) {
    Object.keys(node || {}).map((k) => {
      if (node[k] && node[k].children) {
        objectToArr(node[k]);
      }
    });
    if (node.children) {
      node.children = Object.values(node.children);
      node.children.forEach(objectToArr);
    }
  }
  arr.map(addNode);
  objectToArr(tree);
  return Object.values(tree);
}

export function evaluate(
  model: Model,
  context: object,
  matchedResult: string[]
): any {
  const { scope, name, paths } = parseExpr(matchedResult[1]);
  const withInfo = withInfoModel(model);
  if (withInfo) {
    const info = findInfo(withInfo, scope, name);
    if (info?.type === "event") {
      const obj = (context as any).event; //?.[name];
      return _.get(obj, paths ?? []);
    }
  }
  return undefined;
}

export function getEventName(
  model: Model,
  matchedResult: string[]
): string | undefined {
  const { scope, name, paths } = parseExpr(matchedResult[1]);
  const withInfo = withInfoModel(model);
  if (withInfo) {
    const info = findInfo(withInfo, scope, name);
    console.log('info',info)
    if (info?.type === "event") {
      return info.name;
    }
  }
  return undefined;
}
