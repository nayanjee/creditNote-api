const db = require("../models");
const Portal = db.portal;

exports.getAll = function(req, res) {
  Portal.find({isActive:true, isDeleted:false}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name : 1});
};