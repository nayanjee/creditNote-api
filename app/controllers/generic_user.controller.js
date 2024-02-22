const db = require("../models");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const User = db.gen_user;
const Permission = db.gen_permission;
const StockistDivision = db.cn_stockist_division;
const DistributorDivision = db.cn_distributor_division;
const EmpDistStockistDivision = db.cn_emp_dist_stockist_division;

exports.getUserById = (req, res) => {
  User.find({ _id: req.params.userId, isActive: true, isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  }).sort({ name: 1 });
};

exports.getUserSupervisor = (req, res) => {
  if (req.params.userType === 'ho') {
    const reqData = { $or: [{userType: "head"}, {userType: "ho"}], isSupervisor: true, isActive: true, isDeleted: false };
    User.find(reqData, (error, result) => {
      if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
      if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

      res.status(200).send({ status: 200, message: 'Success', data: result });
    }).sort({ name: 1 });
  } else if (req.params.userType === 'hos') {
    const reqData = { userType: "head", isSupervisor: true, isActive: true, isDeleted: false };
    User.find(reqData, (error, result) => {
      if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
      if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

      res.status(200).send({ status: 200, message: 'Success', data: result });
    }).sort({ name: 1 });
  } else if (req.params.userType === 'suh') {
    const reqData = { userType: "field", workType: "hos", isSupervisor: true, isActive: true, isDeleted: false };
    User.find(reqData, (error, result) => {
      if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
      if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

      res.status(200).send({ status: 200, message: 'Success', data: result });
    }).sort({ name: 1 });
  } else if (req.params.userType === 'field') {
    const reqData = { userType: "field", workType: "suh", isSupervisor: true, isActive: true, isDeleted: false };
    User.find(reqData, (error, result) => {
      if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
      if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

      res.status(200).send({ status: 200, message: 'Success', data: result });
    }).sort({ name: 1 });
  }
}

exports.getDistStockistDivision = (req, res) => {
  const reqData = { userId: req.params.userId }
  EmpDistStockistDivision.find(reqData, (error, result) => {
      if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
      if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

      res.status(200).send({ status: 200, message: 'Success', data: result });
    });
}

exports.getStockistDistDivision = (req, res) => {
  const reqData = { userId: req.params.userId }
  StockistDivision.find(reqData, (error, result) => {
      if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
      if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

      res.status(200).send({ status: 200, message: 'Success', data: result });
    });
}

exports.createuser = (req, res) => {
  User.find({ email: req.body.email }, (error, result) => {
    if (error) return res.status(200).send({ status: 400, message: 'Problem finding record' });
    if (result.length > 0) return res.status(200).send({ status: 400, message: 'Email already exists.' });

    const reqData = {
      name: req.body.username,
      email: req.body.email,
      code: req.body.code,
      password: bcrypt.hashSync('123456', 8),
      userType: req.body.userType,
      portals: mongoose.Types.ObjectId(req.body.portalId),
      createdBy: mongoose.Types.ObjectId(req.body.loggedUserId)
    };

    if (req.body.userType === 'ho') {
      reqData['supervisor'] = req.body.supervisor;
    }

    if (req.body.userType === 'field') {
      reqData['supervisor'] = req.body.supervisor;
      reqData['workType'] = req.body.workType;
      if (req.body.workType === 'hos' || req.body.workType === 'suh') {
        reqData['isSupervisor'] = true;
      }
    }

    User.create(reqData, (err, suc) => {
      if (err) return res.status(200).send({ status: 400, message: 'Something went wrong, Please try again later.' });

      if (suc) {
        Permission.create({
          userId: suc._id,
          portalId: mongoose.Types.ObjectId(req.body.portalId),
          permissions: req.body.permission,
          createdBy: mongoose.Types.ObjectId(req.body.loggedUserId),
        }, (perr, psuc) => {
          if (perr) return res.status(200).send({ status: 400, message: 'Something went wrong, Please try again later.' });
          
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
            } else if (req.body.userType === 'stockist') {
              StockistDivision.create({
                userId: suc._id,
                plant: req.body.plant,
                customerId: req.body.code,
                divisions: req.body.divisions,
                createdBy: mongoose.Types.ObjectId(req.body.loggedUserId)
              }, (derr, dsuc) => {
                if (derr) return res.status(500).send({ status: 400, message: 'somethingWrong' });
                res.status(200).send({ status: 200, message: 'added', data: suc });
              });
            } else if (req.body.userType === 'ho' || req.body.userType === 'field') {
              req.body.distributors.forEach((element, index) => {
                EmpDistStockistDivision.create({
                  userId: suc._id,
                  empCode: req.body.code,
                  plant: element,
                  divisions: req.body.divisions[index],
                  stockists: req.body.stockists[index],
                  createdBy: mongoose.Types.ObjectId(req.body.loggedUserId)
                }, (derr, dsuc) => { });
              });
              res.status(200).send({ status: 200, message: 'added', data: suc });
            } else {
              res.status(200).send({ status: 200, message: 'added', data: suc });
            }
          }
        });
      }
    });

  });
};
