/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 21/06/2023 - 14:08:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/06/2023
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const controller = require("../controllers/cn_claim.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/getClaim", controller.getClaim);
  app.post("/api/claim/create", controller.create);
  app.post("/api/claim/update", controller.update);
  app.post("/api/claim/submit", controller.submitClaim);
  app.post("/api/claim/fileUpload", controller.fileUpload);
  app.post("/api/claim/updateClaim", controller.updateClaim);
  app.post("/api/claimForApproval", controller.claimForApproval);
  app.post("/api/getApprovedClaim", controller.getApprovedClaim);
  app.post("/api/claim/checkDuplicacy", controller.checkDuplicacy);
  app.post("/api/getClaimForApproval", controller.getClaimForApproval);
  app.post("/api/claim/saveCategory", controller.saveClaimCategory);
  app.post("/api/claim/saveParticulars", controller.saveClaimParticulars);
  app.post("/api/claim/saveSupplyProof", controller.saveClaimSupplyProof);
  app.post("/api/claim/savePurchaseOrder", controller.saveClaimPurchaseOrder);


  app.put("/api/claim/delete", controller.delete);
  app.put("/api/claim/deleteFile", controller.deleteFile);

  app.get("/api/getClaim/:claimId", controller.getClaimById);
};
