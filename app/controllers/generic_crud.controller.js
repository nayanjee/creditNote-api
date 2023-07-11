const db = require("../models");
const Crud = db.crud;

exports.add = (req, res) => {
  Crud.find({stateId: req.params.stateId, is_active: true, is_deleted: false}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name : 1});
};