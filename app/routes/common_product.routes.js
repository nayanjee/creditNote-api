/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 17/06/2023 - 14:08:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 17/06/2023
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const controller = require("../controllers/common_product.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/product/all", controller.getAll);
  app.get("/api/product/:material", controller.getProductById);
  app.get("/api/productByDivision/:division", controller.getProductByDivision);

  app.post("/api/productImport", controller.importProduct);
};
