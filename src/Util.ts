import * as R from "ramda";

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
            : (obj.path as string[]).join("/")
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
    Object.keys(node || {}).map(k => {
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


export function filterObject(obj: any) {
  const ret: any = {};
  Object.keys(obj)
    .filter(key => obj[key] !== undefined)
    .forEach(key => (ret[key] = obj[key]));
  return ret;
}

export function no(name: string) {
  throw new Error(`env not found - ${name}`);
}