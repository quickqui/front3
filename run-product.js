const process = require("process");
console.log(`starting product server for front3`);

const express = require("express");
const app = express();
//from env?
const port = process.env.PORT ? 0 + process.env.PORT : 3000;
const builtPath = process.env.BUILT_PATH;
console.log("port :>> ", port);
console.log(`builtPath`, builtPath);
app.use(express.static(builtPath));
app.get("/runtimeEnv", (req, res) => {
  res.status(200).json(process.env);
});
const setP = require("./src/setupProxy");
setP(app);
app.listen(port, () => {
  console.log(`server started, listening at http://localhost:${port}`);
});
