/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 02/08/2023 - 14:08:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 02/08/2023
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const controller = require("../controllers/common_distributor.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/distributor/all", controller.getAll);
  app.get("/api/distributor/getDistributor9000", controller.getDistributor9000);
  app.get("/api/getCustomer/:plant", controller.getCustomerByPlant);
  app.get("/api/distributor/:id", controller.getDistributorById);

  app.post("/api/distributor/add", controller.add);
  app.post("/api/distributor/edit", controller.edit);
  app.post("/api/distributorImport", controller.importDistributor);
  app.post("/api/distributor/distributorDivison", controller.distributorDivison);
};
