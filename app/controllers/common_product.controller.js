const xlsx = require('xlsx');

const uploadFile = require("../middlewares/uploadProduct");

const db = require("../models");
const Product = db.com_product;

exports.getAll = function (req, res) {
	const condition = {
		isActive: true, 
		isDeleted: false
	};

	Product.find(condition, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	}).sort({ materialName: 1 });
};

exports.getProductById = function (req, res) {
	Product.findOne({ material: req.params.material }, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
};

exports.getProductByDivision = function (req, res) {
  Product.find({ division: req.params.division }, (error, result) => {
    if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
    if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

    res.status(200).send({ status: 200, message: 'Success', data: result });
  });
};

exports.importProduct = async (req, res) => {
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
    const filePath = './public/uploads/product/' + fileName;
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
        	material: item['Material'],
          plant: item['Plant'],
        	materialName: item['Material Description'],
          materialType: item['Material Type'],
          materialGroup: item['Material Group'],
          baseUnitMeasure: item['Base Unit of Measure'],
          purchaseGroup: item['Purchasing Group'],
          mrpType: item['MRP Type'],
        	division: item['Division'],
        	mrp: item['MRP'],
        	ptd: item['PTD'],
        	ptr: item['PTR'],
        	pts: item['PTS']
        };
      });

      (async function(){
        const removeAll = await Product.deleteMany({});   // Remove all documents before insert.
        
        const insertMany = await Product.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};
