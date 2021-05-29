const distPath = process.env.DIST_PATH
const { execSync } = require("child_process");
execSync("npm build");
execSync('mv build '+distPath)
