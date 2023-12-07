//import mongoose from 'mongoose';
const mongoose = require("mongoose");

const config = require("../config/auth.config");

const Validate = require('../common/validation');
const MSG = require('../common/message');

const User = require("../models/generic_user.model");
const Admin = require("../models/generic_admin.model");
const Portal = require("../models/generic_portal.model");
const Log = require("../models/la_log.model");
const Permission = require("../models/generic_permission.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!emailReg.test(req.body.email)) {
    res.status(400).send({ message: "Enter valid email!" });
    return;
  }

  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role
  });

  admin.save((err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Portal.find({ name: { $in: req.body.portal } }, (err, portals) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      admin.portals = portals.map(portal => portal._id);
      admin.save(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.send({ message: "Admin added successfully!" });
      });
    }
    );
  });
};

exports.signin = (req, res) => {
  const email = Validate.email(req.body.email);
  if (email) return res.status(200).send({ status: 400, param: 'email', message: email });

  const password = Validate.password(req.body.password);
  if (password) return res.status(200).send({ status: 400, param: 'password', message: password });

  const portal = Validate.portal(req.body.portal);
  if (portal) return res.status(200).send({ status: 400, param: 'portal', message: portal });

  User.findOne({ email: req.body.email, type: req.body.type, isDeleted: false })
    .populate("portals")
    .exec(async (err, user) => {
      if (err) return res.status(500).send({ status: 500, message: MSG.somethingWrong });
      if (!user) return res.status(200).send({ status: 400, message: MSG.noUser });

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(200).send({ status: 400, message: MSG.invalidEmailPassword });
      if (!user.isActive) return res.status(200).send({ status: 400, message: MSG.accountInactive });

      // CHECK ADMIN HAS PERMISSION TO ACCESS THE PORTAL OR NOT
      var isAuthorize = false;
      var portalId = '';
      if (user.portals && user.portals.length) {
        for (let i = 0; i < user.portals.length; i++) {
          if (user.portals[i].slug === req.body.portal) {
            isAuthorize = true;
            portalId = user.portals[i]._id;
          }
        }
      }
      if (!isAuthorize) return res.status(200).send({ status: 400, message: MSG.noAccess });

      var token = jwt.sign({ id: user.id }, config.secret, {
        //expiresIn: 86400 // 24 hours
        expiresIn: 120 // 2 minutes
      });

      // If user has permission for portal access, get how much access they have
      const permissions = await getPermission(user._id, portalId);
      
      const data = {
        id:           user._id,
        name:         user.name,
        type:         user.type, 
        email:        user.email,
        image:        user.image,
        portal:       portalId,
        stockiest:    user.stockiest,
        permissions:  permissions
      }

      res.status(200).send({ auth: true, status: 200, message: 'Successfully logged.', token: token, data: data });
    });
};

exports.changePassword = (req, res) => {
  User.findOne({ _id: req.body.userId }).exec(async (err, user) => {
      if (err) return res.status(500).send({ status: 500, message: MSG.somethingWrong });
      if (!user) return res.status(200).send({ status: 400, message: MSG.noUser });

      console.log('USER___', user);
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(200).send({ status: 400, message: MSG.invalidEmailPassword });
      if (!user.isActive) return res.status(200).send({ status: 400, message: MSG.accountInactive });
    });
}

const getPermission = (userId, portalId) => {
  return new Promise(resolve => {
    Permission.findOne({ userId: userId, portalId: portalId }).exec((err, res) => {
      console.log('res---', res);
      if (res && res.permissions.length) {
        resolve(res.permissions);
      } else {
        resolve([]);
      }
    });
  });
};

