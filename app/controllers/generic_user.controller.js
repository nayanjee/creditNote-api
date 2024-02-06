const db = require("../models");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const User = db.gen_user;
const Permission = db.gen_permission

exports.getUserById = (req, res) => {
  User.find({ _id: req.params.userId, isActive: true, isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  }).sort({ name: 1 });
};


exports.createuser = (req, res) => {

  User.findOne({ email: req.body.email }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (result) return res.status(400).send({ status: 400, message: 'Email already exist, please user another email for user creation.' });
    const reqData = {
      name: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync('123456', 8),
      type: 1,
      isOfficer: true,
      portals: mongoose.Types.ObjectId(req.body.portalId),
      divisions: req.body.division,
      distributors: req.body.distributor,
      stockiest: req.body.stockiest,
      isActive: true,
      isDeleted: false,
      createdBy: mongoose.Types.ObjectId(req.body.loggedUserId),
      //updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId),
    };

    User.create(reqData, (err, suc) => {
      if (err) return res.status(500).send({ status: 400, message: 'somethingWrong' });

      if (suc) {
        Permission.create({
          userId: suc._id,
          portalId: mongoose.Types.ObjectId(req.body.portalId),
          permissions: req.body.permission,
          createdBy: mongoose.Types.ObjectId(req.body.loggedUserId),
        }, (perr, psuc) => {
          if (err) return res.status(500).send({ status: 400, message: 'somethingWrong' });
          //res.status(200).send({ status: 200, message: 'Success', data: result });
          res.status(200).send({ status: 200, message: 'added', data: suc });
        });
      }
      //res.status(200).send({ status: 200, message: 'added', data: suc });
    });

  });


};
