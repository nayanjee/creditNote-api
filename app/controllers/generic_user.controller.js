const db = require("../models");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const User = db.gen_user;
const Permission = db.gen_permission;
const DistributorDivision = db.cn_distributor_division;

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
      code: req.body.code,
      password: bcrypt.hashSync('123456', 8),
      userType: req.body.userType,
      portals: mongoose.Types.ObjectId(req.body.portalId),
      createdBy: mongoose.Types.ObjectId(req.body.loggedUserId)
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
          if (perr) return res.status(500).send({ status: 400, message: 'somethingWrong' });
          
          if (psuc) {
            if (req.body.userType === 'distributor') {
              DistributorDivision.create({
                userId: suc._id,
                plant: req.body.code,
                divisions: req.body.divisions,
                createdBy: mongoose.Types.ObjectId(req.body.loggedUserId)
              }, (derr, dsuc) => {
                if (derr) return res.status(500).send({ status: 400, message: 'somethingWrong' });
                res.status(200).send({ status: 200, message: 'added', data: suc });
              });
            } else {
              res.status(200).send({ status: 200, message: 'added', data: suc });
            }
          }
        });
      }
    });

  });


};
