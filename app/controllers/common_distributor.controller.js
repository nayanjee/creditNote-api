const xlsx = require('xlsx');
const mongoose = require("mongoose");
const moment = require("moment");

const uploadFile = require("../middlewares/uploadDistributor");

const db = require("../models");
const Distributor = db.com_distributor;
const DistributorDivision = db.cn_distributor_division;

exports.getCustomerByPlant = function (req, res) {
  if (!req.params.plant) return res.status(200).send({ status: 400, param: 'plant', message: 'plant is required.' });

  Distributor.find({ plant: req.params.plant }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
}


exports.importDistributor = async (req, res) => {
  try {
    // To upload file
    await uploadFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({ status: 400, message: "Please upload a file!" });
    }

    // Insert records in database
    const finalResult = await convertExcelToJson(req.file.originalname);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({ status: 500, message: `Could not upload the file: ${err}` });
  }
};

let convertExcelToJson = (fileName) => {
  return new Promise(resolve => {
    const filePath = './public/uploads/distributor/' + fileName;
    if (!filePath) {
      resolve({ status: 400, message: 'FilePath is null!' });
    }

    // Read the file using pathname
    const file = xlsx.readFile(filePath, { type: 'binary', cellDates: true });
    if (!file.SheetNames) {
      resolve({ status: 400, message: "Worksheet's name or ressource was not found." });
    }

    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;

    // Variable to store our data 
    let parsedData = [];

    // Convert to json using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
    if (tempData.length == 0) {
      resolve({ status: 400, message: 'File content is empty.' });
    }

    if (tempData.length <= 100100) {
      // Add the sheet's json to our data array
      parsedData.push(...tempData);

      // change key name in array of objects
      const newArray = parsedData.map(item => {
        return {
          customerId: item['Customer Code'],
          plant: item['Plant'],
          organization: item['Customer Name']
        };
      });

      (async function () {
        const removeAll = await Distributor.deleteMany({});   // Remove all documents before insert.

        const insertMany = await Distributor.insertMany(newArray);
        resolve({ status: 200, message: "Success" });
      })();
    } else {
      return res.status(200).send({ status: 400, message: "This file has more than 1 lakh rows, please upload it by reducing it." });
    }
  });
};

exports.getAll = function (req, res) {
  Distributor.find({ isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};

exports.getDistributor9000 = function (req, res) {
  Distributor.find({ plant: { $gt: 9000, $lte: 9999 }, isActive: true, isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};

exports.distributorDivison = function (req, res) {
  DistributorDivision.find({ plant: req.body.plant, isActive: true, isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};

exports.add = function (req, res) {
  //console.log('dist form===>', req.body);
  const company = Number(req.body.company);
  const customerId = Number(req.body.customerId);
  const plant = Number(req.body.plant);
  Distributor.findOne({ company: req.body.company, customerId: req.body.customerId, plant: req.body.plant, isDeleted: false }, (error, result) => {
    if (error) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
    if (result) return res.status(200).send({ status: 400, message: 'Record already exist for given Organization, Customer ID & Plant' });
    const reqData = {
      plant: plant,
      customerId: customerId,
      organization: req.body.organization,
      company: company,
      isActive: req.body.status,
      createdBy: mongoose.Types.ObjectId(req.body.loggedUserId)
    };

    Distributor.create(reqData, (err, suc) => {
      if (err) return res.status(200).send({ status: 400, message: 'somethingWrong' });
      res.status(200).send({ status: 200, message: 'added', data: suc });
    });

  });
};

exports.edit = function (req, res) {

  const newplantcode = Number(req.body.plant);
  const oldplantcode = Number(req.body.oldplant);
  const newcustomerId = Number(req.body.customerId);
  const oldcustomerId = Number(req.body.oldcustomerId);
  const newcompany = Number(req.body.company);
  const oldcompany = Number(req.body.oldcompany);
  const reqData = {
    plant: newplantcode,
    customerId: newcustomerId,
    company: newcompany,
    organization: req.body.organization,
    isActive: req.body.status,
    updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
  }
  if (newplantcode != oldplantcode || newcustomerId != oldcustomerId || newcompany != oldcompany) {

    Distributor.findOne({ company: newcompany, customerId: newcustomerId, plant: newplantcode, isDeleted: false }, (errcus, rescus) => {
      // console.log('customer===========>', req.body);
      // console.log('customer error', errcus);
      // console.log('customer result', rescus);
      if (errcus) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
      if (rescus) return res.status(200).send({ status: 400, message: 'Record already exist for given Organization, Customer ID & Plant.' });
      Distributor.findByIdAndUpdate(req.body._id, reqData).exec((errsuc, success) => {
        if (errsuc) {
          return res.status(200).send({ status: 400, message: "somethingWrong" });
        } else {
          res.status(200).send({ status: 200, message: "success", data: [] });
        }
      });

    });
  }
  else {
    //console.log('else====>', req.body);
    Distributor.findByIdAndUpdate(req.body._id, reqData).exec((errsuc, success) => {
      if (errsuc) {
        return res.status(200).send({ status: 400, message: "somethingWrong" });
      } else {
        res.status(200).send({ status: 200, message: "success", data: [] });
      }
    });
  }


};




exports.getDistributorById = function (req, res) {
  Distributor.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};
