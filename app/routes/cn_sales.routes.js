/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 03/08/2023 - 14:08:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 03/08/2023
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const controller = require("../controllers/cn_sales.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/sales/ho/invoice", controller.hoInvoice);
  app.post("/api/sales/hoSalesImport", controller.importHoSales);
  app.post("/api/sales/distSalesImport", controller.importDistSales);
  app.post("/api/sales/remainingQuantity", controller.remainingQuantity);
  app.post("/api/sales/allocateQuantity", controller.allocateQuantity);
  app.post("/api/sales/allocatedQuantity", controller.allocatedQuantity);
  
  app.post("/api/remaining/findUpdateRemaining", controller.findUpdateRemaining);
  app.post("/api/remaining/updateRemainingLog", controller.updateRemainingLog);
};