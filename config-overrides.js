const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");
const process = require("process");

function alias() {
  //FIXME 从develop server启动到可用非常慢，可能webpack在搜集依赖。需要解决。
  //MARK 分析cra的打包到生产模式的过程，看在什么阶段打包，主要考虑是根据部署形态的不一样，哪些是直接运行dev server，哪些是运行生产模式。
  return addWebpackAlias({
    "@@": path.resolve(
      process.cwd(),
      process.env["EXTEND_PATH"] || process.env["MODEL_PATH"] || "."
    ),
  });
}
module.exports = {
  webpack: override(alias()),
};
