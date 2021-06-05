function _interopRequireDefault(obj: any) {
  // return obj?.__esModule && obj?.default ? obj : { default: obj };
  return  obj?.default ? obj : { default: obj };

}
//TODO 这里是否应该有repository path，向其他地方一样？
//不是model机制级别问题，是web对resolve机制的实现能力问题。

//TODO 如何resolve node_modules里面的？
export const resolve = <T extends unknown>(path: string): Promise<any> => {
  return resolveWithOutDefault(path).then(
    (obj) => {
      console.log(obj);
      const re = _interopRequireDefault(obj).default;
      console.log(re)
      return re as T;
      // return (obj as any).default as T
      // return obj as any as T;
    },(e)=>{console.log(e)}
  );
};

export const resolveWithOutDefault = <T extends unknown>(
  path: string
): Promise<T> => {
  // if (path.startsWith("@quick-qui/")) {
  //   return import(`@@/node_modules/${path}`);
  // }
  //FIXME 从develop server启动到可用非常慢，可能webpack在搜集依赖。需要解决。
  //TODO webpack的前后似乎有点行为不同，表现出来是product打包以后，dp是resolve的似乎都失败了。可能拿到了undefine。需要进一步研究。
  console.log(path);
  return import(`@@/dist/${path}`);
  // throw new Error("Only can resolve an known path");
};
