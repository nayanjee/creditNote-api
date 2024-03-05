const xlsx = require('xlsx');
const mongoose = require("mongoose");
const moment = require("moment");

const uploadFile = require("../middlewares/uploadDistSales");
const uploadHoFile = require("../middlewares/uploadHoSales");

const db = require("../models");
const Sales = db.cn_sales;
const SalesHo = db.cn_sales_ho;
const SalesRemaining = db.cn_sales_remaining_quantity;
const AllocatedQuantity = db.cn_sales_allocated_quantity;

exports.findRemainingUpsert = (req, res) => {
	const condition = {
		billDocNumber: parseInt(req.body.billDocNumber),
		billToParty: parseInt(req.body.customerId),
		batch: req.body.batch,
	};

	AllocatedQuantity.findOne(condition, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) {
			// insert new record

		} else {
			// Update quantity in 'cn_sales_remaining_quantity' or insert new record
			// delete previous related records
		}

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.allocateQuantity = (req, res) => {
	req.body.forEach((element, index) => {
  	SalesRemaining.findOne({
  		billDocNumber: element.stkInvoice,
  		billToParty: element.customerId,
  		batch: element.batch
  	}, (error, result) => {
  		if (result) {
  			const updatedQty = result.quantity - element.saleQuantity;
  			SalesRemaining.updateOne({_id: result._id}, {quantity: updatedQty}, async function (err, res) {
    			if (res) {
    				const reqData = {
				  		claimId: element.claimId,
				  		distInvoiceNo: element.distInvoice,
				  		distInvoiceQty: element.distInvQty,
				  		stkInvoiceNo: element.stkInvoice,
				  		stkInvoiceQty: element.stkInvoiceQty,
				  		allocatedQty: element.saleQuantity
				  	}
				  	AllocatedQuantity.create(reqData);
    			}
    		});
			} else {
				const quantity = element.stkInvoiceQty - element.saleQuantity;
				SalesRemaining.create({
					billDocNumber: element.stkInvoice,
					billToParty: element.customerId,
					batch: element.batch,
					quantity: quantity
				}, async function (err, res) {
					if (res) {
    				const reqData = {
				  		claimId: element.claimId,
				  		distInvoiceNo: element.distInvoice,
				  		distInvoiceQty: element.distInvQty,
				  		stkInvoiceNo: element.stkInvoice,
				  		stkInvoiceQty: element.stkInvoiceQty,
				  		allocatedQty: element.saleQuantity
				  	}
				  	AllocatedQuantity.create(reqData);
    			}
				});
			}
  	});
  });
  res.status(200).send({ status: 200, message: 'Success', data: [] });
}

exports.allocatedQuantity = (req, res) => {
	AllocatedQuantity.find({claimId: req.body._id}, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) {
			res.status(200).send({ status: 200, message: 'Success', data: [] });

		} else {
			res.status(200).send({ status: 200, message: 'Success', data: result });
		}
	});
}

exports.remainingQuantity = (req, res) => {
	const condition = {
		billToParty: parseInt(req.body.customerId),
		batch: req.body.batch,
		billDocType: 'ZDLF'
	};

	Sales.aggregate([
		{
			$match: condition
		}, {
			$lookup: {
				from: "cn_sales_remaining_quantities",
				localField: "billDocNumber",
				foreignField: "billDocNumber",
				as: "remainingData"
			} 
		}, {
			$lookup: {
				from: "com_distributors",
				localField: "plant",
				foreignField: "plant",
				as: "distCustomerIds"
			}
	 	}, {
			$sort: { billDocDate: 1 }
	 	}
	]).exec((error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.hoInvoice = (req, res) => {
	const today = moment().format("YYYY-MM-DDT00:00:00.000[Z]");
	const backDate = moment(today).subtract(12, 'months').format("YYYY-MM-DDT00:00:00.000[Z]");

	const condition = {
		batch: req.body.batch,
		billToParty: req.body.customerId,
		billDocType: { $in: ['ZDSF', 'ZDBS'] },
		billDocDate: {
			$gte: new Date(backDate), 
			$lt: new Date(today)
		}
	};
	console.log('hoInvoice condition---', condition);

	SalesHo.findOne(condition, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.updateRemainingLog = (req, res) => {
	//console.log(req.body);
	const condition = {
		billDocNumber: req.body.billDocNumber,
		billToParty: req.body.billToParty,
		division: req.body.division,
		batch: req.body.batch
	};
	SalesRemaining.findOne(condition, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (result) {
			//console.log(req.body.billDocNumber, result);
			const reqData = {
				tempQuantity: req.body.currentQuantity
			}
			SalesRemaining.updateOne({_id: result._id}, reqData, async function (err, res) {
  			res.status(200).send({ status: 200, message: 'Success', data: result });
  		});
		} else {
			console.log(req.body.billDocNumber, 'No record found');
		}

		//res.status(200).send({ status: 200, message: 'Success', data: result });
	});
};

exports.findUpdateRemaining = (req, res) => {
	const condition = {
		billDocNumber: req.body.billDocNumber,
		billToParty: req.body.billToParty,
		batch: req.body.batch
	}
	
	SalesRemaining.findOne(condition, (error, result) => {
		if (result) {
			const quantity = result['quantity'] + req.body['allocatedQty'];
			const reqData = {
				quantity: quantity
			}
			SalesRemaining.updateOne({_id: result._id}, reqData, async function (err, res) {
				AllocatedQuantity.deleteMany({ claimId: req.body.claimId }).then(function(derr, dres){
    			console.log("Allocated quantity deleted"); // Success
				});
				
  			res.status(200).send({ status: 200, message: 'Success', data: [] });
  		});
		}
	});
};

exports.importDistSales = async (req, res) => {
	console.log('importDistSales');
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
    const filePath = './public/uploads/sales/distributor/' + fileName;
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

      const year = moment().format('YYYY');
	    const month = moment().format('MM');
	    const monthYear = moment().format('YYYY-MM-01');
	    console.log('monthYear---', year, month, monthYear);

      // change key name in array of objects
      const newArray = [];
      parsedData.forEach(item => {
      	if (item['Bill Doc Type'] === 'ZDLF') {
	      	const expireOn = item['Product Expiry Date'] ? moment(new Date(item['Product Expiry Date'])).add(1,'days').format("YYYY-MM-DD") : '';
	      	const billDocDate = item['Bill Doc Date'] ? moment(new Date(item['Bill Doc Date'])).add(1,'days').format("YYYY-MM-DD") : '';

	        const newData =  { 
	        	billDocNumber: item['Bill DocNo'],
	          billDocDate: billDocDate,
	        	itemCategory: item['Item Category'],
	        	billDocType: item['Bill Doc Type'],
	        	division: item['Division'],
	        	divisionName: item['Div Name'],
	        	plant: item['Plant'],
	        	billToParty: item['Bill-To-Party'],
	        	billToPartyName: item['Bill-To-Party Name'],
	        	material: item['Material'],
	        	materialDesc: item['Material Description'],
	        	batch: item['Batch No'],
	        	expireOn: expireOn,
	        	saleUnit: item['Material Qty In Sale Unit'],
	        	mrp: item['MRP Value'],
	        	pts: item['PTS Amount'],
	        	ptr: item['PTR Amount'],
	        	ptd: item['PTD Amount'],
	        	/*billValue: item['Bill Value'],
	        	discount: item['Discount'],
	        	netValue: item['Net Value'],
	        	totalValue: item['TOT Value'],
	        	roundOfValue: item['Rounding Off Value'],*/
	        	month: parseInt(month),
	        	year: parseInt(year),
	        	monthYear: monthYear
	        };

	        newArray.push(newData)
	      }
      });

      /*const newArray = parsedData.map(item => {
      	if (item['Bill Doc Type'] === 'ZDLF') {
	      	const expireOn = item['Product Expiry Date'] ? moment(new Date(item['Product Expiry Date'])).add(1,'days').format("YYYY-MM-DD") : '';
	      	const billDocDate = item['Bill Doc Date'] ? moment(new Date(item['Bill Doc Date'])).add(1,'days').format("YYYY-MM-DD") : '';

	        return { 
	        	billDocNumber: item['Bill DocNo'],
	          billDocDate: billDocDate,
	        	itemCategory: item['Item Category'],
	        	billDocType: item['Bill Doc Type'],
	        	division: item['Division'],
	        	divisionName: item['Div Name'],
	        	plant: item['Plant'],
	        	billToParty: item['Bill-To-Party'],
	        	billToPartyName: item['Bill-To-Party Name'],
	        	material: item['Material'],
	        	materialDesc: item['Material Description'],
	        	batch: item['Batch No'],
	        	expireOn: expireOn,
	        	saleUnit: item['Material Qty In Sale Unit'],
	        	mrp: item['MRP Value'],
	        	pts: item['PTS Amount'],
	        	ptr: item['PTR Amount'],
	        	ptd: item['PTD Amount'],
	        	/*billValue: item['Bill Value'],
	        	discount: item['Discount'],
	        	netValue: item['Net Value'],
	        	totalValue: item['TOT Value'],
	        	roundOfValue: item['Rounding Off Value'],*/
	        	/*month: parseInt(month),
	        	year: parseInt(year),
	        	monthYear: monthYear
	        };
	      }
      }); */

      console.log(newArray);

      (async function(){
        const insertMany = await Sales.insertMany(newArray);
        resolve({status:200, message: "Success"});
      })();
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};

exports.importHoSales = async (req, res) => {
	console.log('importHoSales');
  try {
    // To upload file
    await uploadHoFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    // Insert records in database
    const finalResult = await convertExcelToJsonHo(req.file.originalname);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
};

let convertExcelToJsonHo  = (fileName) => {
  return new Promise(resolve => {
    const filePath = './public/uploads/sales/ho/' + fileName;
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
      const newArray = [];
      parsedData.forEach((item, index) => {
      	if (item['Bill Doc Type'] === 'ZDBS' || item['Bill Doc Type'] === 'ZDSF') {
	      	const expireOn = item['Product Expiry Date'] ? moment(new Date(item['Product Expiry Date'])).add(1,'days').format("YYYY-MM-DD") : '';
	      	const billDocDate = item['Bill Doc Date'] ? moment(new Date(item['Bill Doc Date'])).add(1,'days').format("YYYY-MM-DD") : '';

	        const newData =  {
	        	billDocNumber: item['Bill DocNo'],
	          billDocDate: billDocDate,
	          itemCategory: item['Item Category'],
	          billDocType: item['Bill Doc Type'],
	          division: item['Division'],
	        	divisionName: item['Div Name'],
	        	plant: item['Plant'],
	        	billToParty: item['Bill-To-Party'],
	        	billToPartyName: item['Bill-To-Party Name'],
	          material: item['Material'],
	        	materialDesc: item['Material Description'],
	        	batch: item['Batch No'],
	        	expireOn: expireOn,
	        	saleUnit: item['Material Qty In Sale Unit'],
	        	mrpAmount: item['MRP Value'],
	        	ptdAmount: item['PTD Value'],
	        };

	        newArray.push(newData);
	      }
      });
      
      (async function(){
        const insertMany = await SalesHo.insertMany(newArray);
        // const deleteMany = await SalesHo.deleteMany({billDocType: {$nin: ['ZDSF', 'ZDBS']}});
        resolve({status:200, message: "Success"});
      })();
      
    } else {
      return res.status(200).send({status:400, message: "This file has more than 1 lakh rows, please upload it by reducing it."});
    }
  });
};
