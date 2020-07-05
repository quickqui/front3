const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
      proxy("/model-server", {
        target: process.env.MODEL_URL || "http://localhost:1111",
        pathRewrite: {
          "^/model-server": "/"
        }
      })
    );
   
    app.use(
      proxy("/app-server", {
        target: process.env.APP_SERVER_URL||"http://localhost:4000",
        pathRewrite: {
          "^/app-server": "/"
        }
      })
    );
  
 
};
