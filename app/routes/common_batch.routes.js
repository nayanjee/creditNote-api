/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 15/06/2023 - 14:08:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 15/06/2023
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const controller = require("../controllers/common_batch.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/batch/all", controller.getAll);
  app.get("/api/batch/allBatch", controller.allBatch);
  app.get("/api/batchByMaterial/:material", controller.getBatchByMaterial);

  app.post("/api/batchImport", controller.importBatch);
  app.post("/api/batch/condition", controller.conditionalBatch);
  //app.post("/api/batch/count", controller.batchCount);
  //app.post("/api/batch/limitedData", controller.limitedData);
};
