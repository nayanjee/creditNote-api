/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 14/06/2023 - 14:08:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 14/06/2023
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const controller = require("../controllers/common_stockiest.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/stockiest/all", controller.getAll);
  app.get("/api/stockiest/getdistinctplan", controller.getdistinctplan);
  //app.get("/api/stockiest/:stockiests", controller.getStockiests);
  app.post("/api/stockiest/distributorStockiest", controller.distributorStockiest);
  app.post("/api/getStockiest", controller.stockiestByIds);
  app.post("/api/stockiestImport", controller.importStockiest);
  app.post("/api/stockiest/add", controller.add);
  app.get("/api/stockiest/:id", controller.getStockiestById);
  app.post("/api/stockiest/edit", controller.edit);

};
