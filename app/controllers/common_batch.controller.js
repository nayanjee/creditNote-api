const xlsx = require('xlsx');
const moment = require('moment');

const uploadFile = require("../middlewares/uploadBatch");

const db = require("../models");
const Batch = db.com_batch;
const Product = db.com_product;
const Setting = db.cn_setting;

exports.getAll = async function (req, res) {
	const settings = await getSetting();

	const condition = {
		isActive: true, 
		isDeleted: false,
		expireOn: { $gt: new Date(settings[0].batchDate) }		// show batch by date
	};

	Batch.find(condition, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	}).sort({ batch: 1 });
};


const getSetting = () => {
  return new Promise(resolve => {
    Setting.find({ }).exec((err, res) => {
      if (res.length) {
        resolve(res);
      } else {
        resolve([]);
      }
    });
  });
};


exports.importBatch = async (req, res) => {
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
    const filePath = './public/uploads/batch/' + fileName;
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
    	console.log(tempData.length);
    	let countExecuted = 0;
    	tempData.forEach(async(element, index) => {
    		countExecuted = countExecuted+1;
    		//console.log(element);
    		if (element.Material) {
    			const batchUpsert = await upsertBatch(element);
    			console.log('batchUpsert---', batchUpsert);

    			//const productUpdate = await updateProduct(element);
    			//console.log('productUpdate---', productUpdate);

    			if (tempData.length === countExecuted) {
    				resolve({status:200, message: "Success"});
    			}
    		}
    	});
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};

let upsertBatch = (item) => {
	return new Promise(resolve => {
		const expireOn = item['SLED/BBD'] ? moment(new Date(item['SLED/BBD'])).add(1,'days').format("YYYY-MM-DD") : '';
		const manufacturedOn = item['Date of Manufacture'] ? moment(new Date(item['Date of Manufacture'])).add(1,'days').format("YYYY-MM-DD") : '';
		const batchData = {
			material: item.Material,
			plant: item.Plant,
			division: item.Division,
	    batch: item.Batch,
	    manufacturedOn: manufacturedOn,
	    expireOn: expireOn,
	    mrp: item.YMRP,
	    ptd: item.YPTD,
	    ptr: item.YPTR,
	    pts: item.YPTS
		};

		Batch.findOne({ batch: item.Batch }, (error, result) => {
			if (result) {
				Batch.updateOne({batch: item.Batch}, batchData, async function (err, res) {
    			//resolve({status: 200, message: 'Updated'});
    			const productUpdate = await updateProduct(item);
    			resolve({status: 200, message: 'Batch Updated', data: productUpdate});
    		});
			} else if (!error) {
				Batch.create(batchData, async function (err, res) {
					//resolve({status: 200, message: 'Updated'});
					const productUpdate = await updateProduct(item);
    			resolve({status: 200, message: 'Batch Inserted', data: productUpdate});
    		});
			} else {
				resolve({status: 400});
			}
		});
	});
}

let updateProduct = (item) => {
	return new Promise(resolve => {
		Product.findOne({ material: item.Material }, (error, result) => {
			if (result) {
				const productData = {
					mrp: item.YMRP, 
					ptd: item.YPTD, 
					ptr: item.YPTR, 
					pts: item.YPTS
				};
				Product.updateOne({_id: result._id}, productData, function (err, res) {
    			resolve({status: 200, message: 'Product Updated'});
    		});
			}else {
				resolve({status: 400, message: 'Product not found'});
			}
		});
	});
}
