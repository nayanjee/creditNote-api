const { authJwt } = require("../middlewares");
const controller = require("../controllers/generic_user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /* app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  ); */

  app.get("/api/user/:userId", controller.getUserById);
  app.get("/api/userSupervisor/:userType", controller.getUserSupervisor);
  app.get("/api/user/getDistStockistDivision/:userId", controller.getDistStockistDivision);
  app.get("/api/user/getStockistDistDivision/:userId", controller.getStockistDistDivision);

  app.post("/api/user/createuser", controller.createuser);
};
