const db = require("../models");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const User = db.gen_user;
const Permission = db.gen_permission;
const StockistDivision = db.cn_stockist_division;
const DistributorDivision = db.cn_distributor_division;
const EmpDistStockistDivision = db.cn_emp_dist_stockist_division;

exports.getUserById = (req, res) => {
  console.log('userid---', mongoose.Types.ObjectId(req.params.userId));
  User.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.userId) }
    }, {
      $lookup: {
        from: "cn_stockist_divisions",
        localField: "_id",
        foreignField: "userId",
        as: "cn_stockist_divisions"
      }
    }, {
      $lookup: {
        from: "cn_distributor_divisions",
        localField: "_id",
        foreignField: "userId",
        as: "cn_distributor_divisions"
      }
    }, {
      $lookup: {
        from: "cn_emp_dist_stockist_divisions",
        localField: "_id",
        foreignField: "userId",
        as: "cn_emp_dist_stockist_divisions"
      }
    }, {
      $lookup: {
        from: "gen_permissions",
        localField: "_id",
        foreignField: "userId",
        as: "gen_permissions"
      }
    }
  ]).exec((error, result) => {

    console.log(error);
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};

exports.getUserByCodes = (req, res) => {
  User.find({ code: { $in: req.body.codes }, isActive: true, isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  }).sort({ name: 1 });
};

exports.getUserSupervisor = (req, res) => {
  if (req.params.userType === 'ho') {
    const reqData = { $or: [{ userType: "ho" }], isSupervisor: true, isActive: true, isDeleted: false };
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

exports.edituser = (req, res) => {
  User.findOne({ _id: mongoose.Types.ObjectId(req.body._id) }, (error, result) => {
    if (error) return res.status(200).send({ status: 400, message: 'Problem finding record' });
    if (result.length > 0) return res.status(200).send({ status: 400, message: 'Email already exists.' });

    const reqData = {
      name: req.body.username,
      email: req.body.email,
      code: req.body.code,
      userType: req.body.userType,
      portals: mongoose.Types.ObjectId(req.body.portalId),
      updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
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

    User.findByIdAndUpdate(req.body._id, reqData).exec((err, suc) => {
      if (err) {
        return res.status(200).send({ status: 400, message: "somethingWrong" });
      } else {
        const perData = {
          permissions: req.body.permission,
          updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
        };
        Permission.findByIdAndUpdate(req.body.permission_id, perData).exec((perr, psuc) => {
          if (perr) return res.status(200).send({ status: 400, message: 'Something went wrong, Please try again later.' });
          if (psuc) {
            if (req.body.userType === 'distributor') {
              const dicdivData = {
                plant: req.body.code,
                divisions: req.body.divisions,
                updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
              };
              DistributorDivision.findByIdAndUpdate(req.body.distributor_divisions_id, dicdivData).exec((perr, psuc) => {
                if (perr) return res.status(500).send({ status: 400, message: 'somethingWrong' });
                res.status(200).send({ status: 200, message: 'updated', data: psuc });
              });
            } else if (req.body.userType === 'stockist') {
              const stckdicData = {
                plant: req.body.plant,
                customerId: req.body.code,
                divisions: req.body.divisions,
                updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
              };
              StockistDivision.findByIdAndUpdate(req.body.stockist_divisions_id, stckdicData).exec((perr, psuc) => {
                if (perr) return res.status(500).send({ status: 400, message: 'somethingWrong' });
                res.status(200).send({ status: 200, message: 'updated', data: psuc });
              });
            } else if (req.body.userType === 'ho' || req.body.userType === 'field') {
              EmpDistStockistDivision.deleteMany({ userId: req.body._id }).then(function (derr, dres) {
                console.log("DistStockDivi deleted"); // Success
              });
              req.body.distributors.forEach((element, index) => {

                EmpDistStockistDivision.create({
                  userId: req.body._id,
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

exports.getallusers = (req, res) => {
  User.find({ isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  }).sort({ name: 1 });
};

exports.getDivisionCustomerIds = function (req, res) {
  User.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.userId) }
    }, {
      $lookup: {
        from: "com_distributors",
        localField: "code",
        foreignField: "plant",
        as: "distCustomerIds"
      }
    }, {
      $lookup: {
        from: "cn_distributor_divisions",
        localField: "code",
        foreignField: "plant",
        as: "divisions"
      }
    }, {
      $sort: { code: 1 }
    }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};
