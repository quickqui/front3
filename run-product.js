console.log(`starting product server for front3`);

const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("build"));
const setP = require("src/setupProxy");
setP(app);
app.listen(port, () => {
  console.log(`server started, listening at http://localhost:${port}`);
});
