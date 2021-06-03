const distPath = process.env.DIST_PATH;
const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");
const cwd = path.resolve(__dirname);
console.log(`cwd`, cwd);
execS("npm", ["run", "build"], cwd);
console.log("distPath  - " + distPath);
fs.rmdirSync(path.resolve(distPath, "build"), { recursive: true });
execS("mv", ["build", distPath], cwd);

function execS(command, args, cwd) {
  spawnSync(command, args, {
    cwd: cwd ? cwd : path.resolve(process.cwd()),
    stdio: "inherit",
    // env: { ...process.env, ...env },
  });
}
