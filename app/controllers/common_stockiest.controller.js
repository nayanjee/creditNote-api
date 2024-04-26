const xlsx = require('xlsx');

const uploadFile = require("../middlewares/uploadStockiest");

const db = require("../models");
const mongoose = require("mongoose");
const Stockiest = db.com_stockiest;

exports.getAll = function (req, res) {
  Stockiest.find({ isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};

exports.stockiestByIds = function (req, res) {
  Stockiest.find({ customerId: { $in: req.body } }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
}

exports.importStockiest = async (req, res) => {
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
    const filePath = './public/uploads/stockiest/' + fileName;
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
          plant: item['Plant'],
          customerId: item['Customer Code'],
          organization: item['Customer Name'],
          city: item['City'],
          district: item['District'],
          state: item['State'],
          zipcode: item['Postal Code']
        };
      });

      const uniqueItems = [...new Map(newArray.map(item => [item['customerId'], item])).values()];

      (async function () {
        const removeAll = await Stockiest.deleteMany({});   // Remove all documents before insert.

        const insertMany = await Stockiest.insertMany(uniqueItems);
        resolve({ status: 200, message: "Success" });
      })();
    } else {
      return res.status(200).send({ status: 400, message: "This file has more than 1 lakh rows, please upload it by reducing it." });
    }
  });
};

exports.distributorStockiest = function (req, res) {
  Stockiest.find({ plant: req.body.plant, isActive: true, isDeleted: false }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  }).sort({ organization: 1 });
};

exports.add = (req, res) => {
  Stockiest.findOne({ customerId: req.body.customerid }, (error, result) => {
    if (error) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
    if (result) return res.status(200).send({ status: 400, message: 'Customer ID already exist, please enter valid number.' });
    const reqData = {
      plant: req.body.plant,
      customerId: req.body.customerid,
      organization: req.body.organization,
      isActive: req.body.status,
      createdBy: mongoose.Types.ObjectId(req.body.loggedUserId)
    };

    Stockiest.create(reqData, (err, suc) => {
      if (err) return res.status(200).send({ status: 400, message: 'somethingWrong' });
      res.status(200).send({ status: 200, message: 'added', data: suc });
    });
  });

};

exports.getStockiestById = function (req, res) {
  Stockiest.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};



// exports.edit = function (req, res) {
//   const newplantcode = Number(req.body.plant);
//   const oldplantcode = Number(req.body.oldplantcode);
//   const newcustomerId = Number(req.body.customerid);
//   const oldcustomerId = Number(req.body.oldcustomerId);
//   const reqData = {
//     plant: newplantcode,
//     customerId: newcustomerId,
//     organization: req.body.organization,
//     isActive: req.body.status,
//     updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
//   }
//   if (newplantcode != oldplantcode) {
//     Stockiest.findOne({ plant: newplantcode }, (error, result) => {
//       // console.log('plant===========>', req.body);
//       // console.log('plant error', error);
//       // console.log('plant result', result);
//       if (error) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
//       if (result) return res.status(200).send({ status: 400, message: 'Plant code already exist, please enter valid number.' });

//       Stockiest.findByIdAndUpdate(req.body._id, reqData).exec((errsuc, success) => {
//         if (errsuc) {
//           return res.status(200).send({ status: 400, message: "somethingWrong" });
//         } else {
//           res.status(200).send({ status: 200, message: "success", data: [] });
//         }
//       });
//     });
//   }
//   else if (newcustomerId != oldcustomerId) {
//     Stockiest.findOne({ customerId: newcustomerId }, (errcus, rescus) => {
//       // console.log('customer===========>', req.body);
//       // console.log('customer error', errcus);
//       // console.log('customer result', rescus);
//       if (errcus) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
//       if (rescus) return res.status(200).send({ status: 400, message: 'Customer ID already exist, please enter valid number.' });
//       Stockiest.findByIdAndUpdate(req.body._id, reqData).exec((errsuc, success) => {
//         if (errsuc) {
//           return res.status(200).send({ status: 400, message: "somethingWrong" });
//         } else {
//           res.status(200).send({ status: 200, message: "success", data: [] });
//         }
//       });
//     });
//   } else {
//     console.log('else====>', req.body);
//     Stockiest.findByIdAndUpdate(req.body._id, reqData).exec((errsuc, success) => {
//       if (errsuc) {
//         return res.status(200).send({ status: 400, message: "somethingWrong" });
//       } else {
//         res.status(200).send({ status: 200, message: "success", data: [] });
//       }
//     });
//   }
// };

exports.edit = function (req, res) {
  const newplantcode = Number(req.body.plant);
  const oldplantcode = Number(req.body.oldplantcode);
  const newcustomerId = Number(req.body.customerid);
  const oldcustomerId = Number(req.body.oldcustomerId);

  const reqData = {
    plant: newplantcode,
    customerId: newcustomerId,
    organization: req.body.organization,
    isActive: req.body.status,
    updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
  }

  if (newcustomerId != oldcustomerId) {
    Stockiest.findOne({ customerId: newcustomerId }, (errcus, rescus) => {
      // console.log('customer===========>', req.body);
      // console.log('customer error', errcus);
      // console.log('customer result', rescus);
      if (errcus) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
      if (rescus) return res.status(200).send({ status: 400, message: 'Customer ID already exist, please enter valid number.' });
      Stockiest.findByIdAndUpdate(req.body._id, reqData).exec((errsuc, success) => {
        if (errsuc) {
          return res.status(200).send({ status: 400, message: "somethingWrong" });
        } else {
          res.status(200).send({ status: 200, message: "success", data: [] });
        }
      });

    });
  } else {
    Stockiest.findByIdAndUpdate(req.body._id, reqData).exec((errsuc, success) => {
      if (errsuc) {
        return res.status(200).send({ status: 400, message: "somethingWrong" });
      } else {
        res.status(200).send({ status: 200, message: "success", data: [] });
      }
    });
  }
};

exports.getdistinctplan = function (req, res, next) {
  Stockiest.distinct('plant', (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });
    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};
