const db = require("../models");
const Access = db.gen_access;

exports.add = (req, res) => {
  const reqData = {
    portalId: req.body.portalId,
    permissionName: req.body.permissionName,
    permissionId: req.body.permissionId,
  };

  Access.create(reqData, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'added', data:suc});
  });
};


exports.getall = function(req, res) {
  console.log(req.body);
  Access.find({ portalId:req.body.portalId, isActive:true, isDeleted:false }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};
