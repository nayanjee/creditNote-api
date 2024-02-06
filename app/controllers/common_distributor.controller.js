const xlsx = require('xlsx');
const mongoose = require("mongoose");
const moment = require("moment");

const uploadFile = require("../middlewares/uploadDistributor");

const db = require("../models");
const Distributor = db.com_distributor;

exports.getCustomerByPlant = function (req, res) {
	if (!req.params.plant) return res.status(200).send({ status: 400, param: 'plant', message: 'plant is required.' });

	Distributor.find({plant: req.params.plant}, (error, result) => {
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
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    // Insert records in database
    const finalResult = await convertExcelToJson(req.file.originalname);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
};

let convertExcelToJson  = (fileName) => {
  return new Promise(resolve => {
    const filePath = './public/uploads/distributor/' + fileName;
    if (!filePath) {
      resolve({status:400, message: 'FilePath is null!'});
    }

    // Read the file using pathname
    const file = xlsx.readFile(filePath, { type: 'binary' , cellDates: true });
    if (!file.SheetNames) {
      resolve({status:400, message: "Worksheet's name or ressource was not found."});
    }

    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;

    // Variable to store our data 
    let parsedData = [];

    // Convert to json using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
    if (tempData.length == 0) {
      resolve({status:400, message: 'File content is empty.'});
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

      (async function(){
        const removeAll = await Distributor.deleteMany({});   // Remove all documents before insert.
        
        const insertMany = await Distributor.insertMany(newArray);
        resolve({status:200, message: "Success"});
      })();
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};

exports.getAll = function(req, res) {
  Distributor.find({ isActive:true, isDeleted:false }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};

exports.getDistributor9000 = function(req, res) {
  Distributor.find({ plant:{ $gt: 9000, $lte: 9999 },isActive:true, isDeleted:false }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};