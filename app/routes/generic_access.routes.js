const controller = require("../controllers/generic_access.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/access/create", controller.add);
  app.get("/api/access/getall/:portalId", controller.getall);
};
