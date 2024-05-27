const mongoose = require("mongoose");
const moment = require("moment");

const db = require("../models");
const Claim = db.cn_claim;
const Sales = db.cn_sales;
const ClaimFile = db.cn_claim_file;

exports.getClaim = function (req, res) {
	if (!req.body.customerId) return res.status(200).send({ status: 400, param: 'customerId', message: 'Stockiest is required.' });

	let condition = { isDraft: true };
	if (req.body.plant) condition.plant = parseInt(req.body.plant);
	if (req.body.month) condition.claimMonth = parseInt(req.body.month);
	if (req.body.year) condition.claimYear = parseInt(req.body.year);
	if (req.body.division) condition.divisionName = req.body.division;
	if (req.body.type) condition.claimType = req.body.type;
	if (req.body.customerId === 'self') {
		condition.customerId = 0;
	} else {
		condition.customerId = parseInt(req.body.customerId);
	}
	console.log('condition--', condition);

	Claim.aggregate([
		{
			$match: condition
		}, {
			$lookup: {
				from: "cn_claim_files",
				localField: "_id",
				foreignField: "claimId",
				as: "files"
			}
		}
	]).exec((error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.getClaimById = function (req, res) {
	if (!req.params.claimId) return res.status(200).send({ status: 400, param: 'claimId', message: 'claimId is required.' });

	Claim.aggregate([
		{
			$match: { _id: mongoose.Types.ObjectId(req.params.claimId) }
		}, {
			$lookup: {
				from: "cn_claim_files",
				localField: "_id",
				foreignField: "claimId",
				as: "files"
			}
		}
	]).exec((error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.create = function (req, res) {
	if (req.body.header) {
		const explodeHeader = req.body.header.split('.::.');
		if (explodeHeader.length === 7) {
			const totRecords = req.body.claims.length + 1;

			// Seperate all the value from header and specify it
			const plant = explodeHeader[0];
			const customerId = explodeHeader[1];
			const claimType = explodeHeader[2];
			const claimMonth = explodeHeader[3];
			const claimYear = explodeHeader[4];
			const userId = explodeHeader[5];
			const userType = explodeHeader[6];
			
			for (var i = 0; i < totRecords; i++) {
				let enterData = [];
				let explodeImage = [];
				if (i === 0) { 	// Default fields
					// Keep all data as per database
					const fd = {
						plant: plant,
						customerId: customerId,
						claimType: claimType,
						claimMonth: claimMonth,
						claimYear: claimYear,
						invoice: req.body.def_invoice,
						batch: req.body.def_batch,
						divisionId: req.body.def_divisionId,
						divisionName: req.body.def_division,
						materialName: req.body.def_product,
						material: req.body.def_productId,
						//particulars			:	'',
						mrp: req.body.def_mrp,
						pts: req.body.def_pts,
						ptr: req.body.def_ptr,
						ptd: req.body.def_ptd,
						billingRate: req.body.def_billingRate,
						margin: req.body.def_margin,
						freeQuantity: req.body.def_freeQuantity,
						saleQuantity: req.body.def_saleQuantity,
						difference: req.body.def_difference,
						totalDifference: req.body.def_totalDifference,
						amount: req.body.def_amount,
						createdBy: mongoose.Types.ObjectId(userId)
					}

					if (userType === 'ho') {
						fd['ftStatus'] = 1;
						fd['ftActionOn'] = new Date().toISOString();
						fd['ftActionBy'] = mongoose.Types.ObjectId(userId);

						fd['suhStatus'] = 1;
						fd['suhActionOn'] = new Date().toISOString();
						fd['suhActionBy'] = mongoose.Types.ObjectId(userId);
					} else if (userType === 'field') {
						fd['ftStatus'] = 1;
						fd['ftActionOn'] = new Date().toISOString();
						fd['ftActionBy'] = mongoose.Types.ObjectId(userId);
					}

					enterData.push(fd);

					explodeImage = req.body.def_image.split('.::.');
				} else { // Add more fields
					// Keep all data as per database
					const fd = {
						plant: plant,
						customerId: customerId,
						claimType: claimType,
						claimMonth: claimMonth,
						claimYear: claimYear,
						invoice: req.body.claims[i - 1].invoice,
						batch: req.body.claims[i - 1].batch,
						divisionId: req.body.claims[i - 1].divisionId,
						divisionName: req.body.claims[i - 1].division,
						materialName: req.body.claims[i - 1].product,
						material: req.body.claims[i - 1].productId,
						//particulars:	'',
						mrp: req.body.claims[i - 1].mrp,
						pts: req.body.claims[i - 1].pts,
						ptr: req.body.claims[i - 1].ptr,
						ptd: req.body.claims[i - 1].ptd,
						billingRate: req.body.claims[i - 1].billingRate,
						margin: req.body.claims[i - 1].margin,
						freeQuantity: req.body.claims[i - 1].freeQuantity,
						saleQuantity: req.body.claims[i - 1].saleQuantity,
						difference: req.body.claims[i - 1].difference,
						totalDifference: req.body.claims[i - 1].totalDifference,
						amount: req.body.claims[i - 1].amount,
						createdBy: mongoose.Types.ObjectId(userId)
					}

					if (userType === 'ho') {
						fd['ftStatus'] = 1;
						fd['ftActionOn'] = new Date().toISOString();
						fd['ftActionBy'] = mongoose.Types.ObjectId(userId);

						fd['suhStatus'] = 1;
						fd['suhActionOn'] = new Date().toISOString();
						fd['suhActionBy'] = mongoose.Types.ObjectId(userId);
					} else if (userType === 'field') {
						fd['ftStatus'] = 1;
						fd['ftActionOn'] = new Date().toISOString();
						fd['ftActionBy'] = mongoose.Types.ObjectId(userId);
					}

					enterData.push(fd);

					explodeImage = req.body.claims[i - 1].image.split('.::.');
				}

				if (enterData.length) {
					Claim.create(enterData, (err, rec) => {
						if (err === null && rec.length === 1 && explodeImage.length) {
							let images = [];
							for (var j = 0; j < explodeImage.length - 1; j++) {
								const originalFilename = explodeImage[j].slice(18);
								const img = {
									claimId: rec[0]._id,
									filename: explodeImage[j],
									originalFilename: originalFilename
								}
								images.push(img);
							}

							if (images.length) {
								ClaimFile.insertMany(images, (fileErr, fileRec) => {
									// console.log('Inserted');
								});
							}
						}
					});
				}
			}
			res.status(200).send({ status: 200, message: "success", data: [] });
		}
	}
}

exports.update = function (req, res) {
	if (req.body.header) {
		const explodeHeader = req.body.header.split('.::.');
		if (explodeHeader.length === 6) {
			const totRecords = req.body.claims.length + 1;

			// Seperate all the value from header and specify it
			const plant = explodeHeader[0];
			const customerId = explodeHeader[1];
			const claimType = explodeHeader[2];
			const claimMonth = explodeHeader[3];
			const claimYear = explodeHeader[4];
			const userId = explodeHeader[5];

			for (var i = 0; i < totRecords; i++) {
				let enterData = [];
				let explodeImage = [];
				if (i === 0) { 	// Default fields
					// Keep all data as per database
					const fd = {
						plant: plant,
						customerId: customerId,
						claimType: claimType,
						claimMonth: claimMonth,
						claimYear: claimYear,
						invoice: req.body.def_invoice,
						batch: req.body.def_batch,
						divisionId: req.body.def_divisionId,
						divisionName: req.body.def_division,
						materialName: req.body.def_product,
						material: req.body.def_productId,
						//particulars			:	'',
						mrp: req.body.def_mrp,
						pts: req.body.def_pts,
						ptr: req.body.def_ptr,
						ptd: req.body.def_ptd,
						billingRate: req.body.def_billingRate,
						margin: req.body.def_margin,
						freeQuantity: req.body.def_freeQuantity,
						saleQuantity: req.body.def_saleQuantity,
						difference: req.body.def_difference,
						totalDifference: req.body.def_totalDifference,
						amount: req.body.def_amount,
						createdBy: mongoose.Types.ObjectId(userId)
					}
					enterData.push(fd);

					explodeImage = req.body.def_image.split('.::.');
				} else { // Add more fields
					// Keep all data as per database
					const fd = {
						plant: plant,
						customerId: customerId,
						claimType: claimType,
						claimMonth: claimMonth,
						claimYear: claimYear,
						invoice: req.body.claims[i - 1].invoice,
						batch: req.body.claims[i - 1].batch,
						divisionId: req.body.claims[i - 1].divisionId,
						divisionName: req.body.claims[i - 1].division,
						materialName: req.body.claims[i - 1].product,
						material: req.body.claims[i - 1].productId,
						//particulars			:	'',
						mrp: req.body.claims[i - 1].mrp,
						pts: req.body.claims[i - 1].pts,
						ptr: req.body.claims[i - 1].ptr,
						ptd: req.body.claims[i - 1].ptd,
						billingRate: req.body.claims[i - 1].billingRate,
						margin: req.body.claims[i - 1].margin,
						freeQuantity: req.body.claims[i - 1].freeQuantity,
						saleQuantity: req.body.claims[i - 1].saleQuantity,
						difference: req.body.claims[i - 1].difference,
						totalDifference: req.body.claims[i - 1].totalDifference,
						amount: req.body.claims[i - 1].amount,
						createdBy: mongoose.Types.ObjectId(userId)
					}
					enterData.push(fd);

					explodeImage = req.body.claims[i - 1].image.split('.::.');
				}

				if (enterData.length) {
					Claim.findByIdAndUpdate(req.body.id, enterData[0]).exec((err, success) => {
						if (err === null && explodeImage.length) {
							let images = [];
							for (var j = 0; j < explodeImage.length - 1; j++) {
								const originalFilename = explodeImage[j].slice(18);
								const img = {
									claimId: success._id,
									filename: explodeImage[j],
									originalFilename: originalFilename
								}
								images.push(img);
							}

							if (images.length) {
								ClaimFile.insertMany(images, (fileErr, fileRec) => {
									// console.log('Inserted');
								});
							}
						}
					});
				}
			}
			res.status(200).send({ status: 200, message: "success", data: [] });
		}
	}
}

exports.updateClaim = function (req, res) {
	Claim.findByIdAndUpdate(req.body._id, req.body).exec((err, success) => {
		if (err) {
			return res.status(400).send({ status: 400, message: "somethingWrong" });
		} else {
			res.status(200).send({ status: 200, message: "success", data: [] });
		}
	});
}

exports.delete = (req, res) => {
	Claim.deleteOne({ _id: req.body._id }, function (err, data) {
		if (err) {
			return res.status(400).send({ status: 400, message: "somethingWrong" });
		} else {
			res.status(200).send({ status: 200, message: "successfullyDeleted", data: [] });
		}
	});
};

exports.deleteFile = (req, res) => {
	ClaimFile.deleteOne({ _id: req.body._id }, function (err, data) {
		if (err) {
			return res.status(400).send({ status: 400, message: "somethingWrong" });
		} else {
			res.status(200).send({ status: 200, message: "successfullyDeleted", data: [] });
		}
	});
};

exports.fileUpload = (req, res) => {
	ClaimFile.insertMany(req.body, (fileErr, fileRec) => {
		res.status(200).send({ status: 200, message: "success", data: [] });
	});
};

exports.submitClaim = (req, res) => {
	if (req.body.length) {
		let count = 1;

		req.body.forEach(element => {
			Claim.findByIdAndUpdate(element._id, element).exec((err, success) => {
				if (req.body.length === count) {
					res.status(200).send({ status: 200, message: "success", data: [] });
				}
				count++;
			});
		});
	}
}

/* exports.claimForApproval = (req, res) => {
	if (!req.body.customerId) return res.status(200).send({ status: 400, param: 'customerId', message: 'Stockiest is required.' });

	let condition = { isDraft: false, isSubmit: true };
	if (req.body.customerId) condition.customerId = parseInt(req.body.customerId);
	if (req.body.month) condition.claimMonth = parseInt(req.body.month);
	if (req.body.year) condition.claimYear = parseInt(req.body.year);
	if (req.body.division) condition.divisionName = req.body.division;
	if (req.body.type) condition.claimType = req.body.type;
	console.log(condition)

	Claim.aggregate([
		{
			$match: condition
		}, {
			$lookup: {
				from: "cn_claim_files",
				localField: "_id",
				foreignField: "claimId",
				as: "files"
			}
		}, {
			$lookup: {
				from: "com_batches",
				localField: "batch",
				foreignField: "batch",
				as: "batchDetail"
			}
		}
	]).exec((error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
} */

exports.claimForApproval = (req, res) => {
	if (!req.body.plant) return res.status(200).send({ status: 400, param: 'plant', message: 'Distributor is required.' });
  if (!req.body.customerId) return res.status(200).send({ status: 400, param: 'customerId', message: 'Stockiest is required.' });
  
	let condition = { isDraft: false, isSubmit: true };
			condition.plant = parseInt(req.body.plant);
	if (req.body.customerId) condition.customerId = parseInt(req.body.customerId);

	if (req.body.month) condition.claimMonth = parseInt(req.body.month);
	if (req.body.year) condition.claimYear = parseInt(req.body.year);
	if (req.body.divisions) condition.divisionId = { $in :req.body.divisions};

	Claim.aggregate([
		{
			$match: condition
		}, {
			$lookup: {
				from: "cn_claim_files",
				localField: "_id",
				foreignField: "claimId",
				as: "files"
			}
		}, {
			$lookup: {
				from: "com_batches",
				localField: "batch",
				foreignField: "batch",
				as: "batchDetail"
			}
		}
	]).exec((error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.getClaimForApproval = (req, res) => {
	if (!req.body.customerId) return res.status(200).send({ status: 400, param: 'customerId', message: 'Stockiest is required.' });

	let condition = { isDraft: false, isSubmit: true };
	if (req.body.customerId) condition.customerId = parseInt(req.body.customerId);
	if (req.body.month) condition.claimMonth = parseInt(req.body.month);
	if (req.body.year) condition.claimYear = parseInt(req.body.year);
	if (req.body.invoice) condition.invoice = req.body.invoice;
	if (req.body.type) condition.claimType = req.body.type;

	Claim.aggregate([
		{
			$match: condition
		}, {
			$lookup: {
				from: "cn_claim_files",
				localField: "_id",
				foreignField: "claimId",
				as: "files"
			}
		}
	]).exec((error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.getApprovedClaim = (req, res) => {
	if (!req.body.plant) return res.status(200).send({ status: 400, param: 'plant', message: 'Distributor is required.' });
	if (!req.body.customerId) return res.status(200).send({ status: 400, param: 'customerId', message: 'Stockiest is required.' });
	
	let condition = { 
		isDraft: false, 
		isSubmit: true,
		plant: parseInt(req.body.plant)
	};
	console.log('req.body.customerId--', req.body.customerId);

	if (req.body.customerId === 'self') {
		condition.customerId = 0;
	} else if (req.body.customerId !== 'all') {
		condition.customerId = parseInt(req.body.customerId);
	}

	if (req.body.claimType) condition.claimType = req.body.claimType;
	if (req.body.division) condition.divisionId = parseInt(req.body.division);
	if (req.body.month) condition.claimMonth = parseInt(req.body.month);
	if (req.body.year) condition.claimYear = parseInt(req.body.year);
	if (req.body.status) {
		if (req.body.status === 'approved') {
			condition.ho1Status = 1;
		} else if (req.body.status === 'rejected') {
			condition.$or = [{ftStatus: 2}, {suhStatus: 2}, {hoStatus: 2}, {ho1Status: 2}];
		} else if (req.body.status === 'inprogress') {
			condition.$and = [{ftStatus: {$ne: 2}}, {suhStatus: {$ne: 2}}, {hoStatus: {$ne: 2}}, {ho1Status: 0}] 
		}

		/* if (req.body.status === 'inprogress') condition.ftStatus = 0;
		else if (req.body.status === 'acceptedFt') condition.ftStatus = 1;
		else if (req.body.status === 'acceptedSuh') condition.suhStatus = 1;
		else if (req.body.status === 'acceptedHo') condition.hoStatus = 1;
		else if (req.body.status === 'approved') condition.ho1Status = 1;
		else if (req.body.status === 'rejectedFt') condition.ftStatus = 2;
		else if (req.body.status === 'rejectedSuh') condition.suhStatus = 2;
		else if (req.body.status === 'rejectedHo') condition.hoStatus = 2;
		else if (req.body.status === 'rejected') condition.ho1Status = 2; */
	}
	console.log('getApprovedClaim---', condition);

	Claim.aggregate([
		{
			$match: condition
		}, {
			$lookup: {
				from: "com_stockiests",
				localField: "customerId",
				foreignField: "customerId",
				as: "stockiest"
			}
		}, {
			$lookup: {
				from: "cn_claim_files",
				localField: "_id",
				foreignField: "claimId",
				as: "files"
			}
		}
	]).exec((error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.saveClaimParticulars = (req, res) => {
	const reqData = {
		particulars: req.body.particulars
	}
	Claim.findByIdAndUpdate(req.body.id, reqData).exec((err, success) => {
		if (err) {
			return res.status(400).send({ status: 400, message: "somethingWrong" });
		} else {
			res.status(200).send({ status: 200, message: "success", data: [] });
		}
	});
}

exports.saveClaimCategory = (req, res) => {
	const reqData = {
		category: req.body.category
	}
	Claim.findByIdAndUpdate(req.body.id, reqData).exec((err, success) => {
		if (err) {
			return res.status(400).send({ status: 400, message: "somethingWrong" });
		} else {
			res.status(200).send({ status: 200, message: "success", data: [] });
		}
	});
}

exports.saveClaimSupplyProof = (req, res) => {
	const reqData = {
		supplyProof: req.body.supplyProof
	}
	Claim.findByIdAndUpdate(req.body.id, reqData).exec((err, success) => {
		if (err) {
			return res.status(400).send({ status: 400, message: "somethingWrong" });
		} else {
			res.status(200).send({ status: 200, message: "success", data: [] });
		}
	});
}

exports.saveClaimPurchaseOrder = (req, res) => {
	const reqData = {
		purchaseOrder: req.body.purchaseOrder
	}
	Claim.findByIdAndUpdate(req.body.id, reqData).exec((err, success) => {
		if (err) {
			return res.status(400).send({ status: 400, message: "somethingWrong" });
		} else {
			res.status(200).send({ status: 200, message: "success", data: [] });
		}
	});
}

exports.checkDuplicacy = (req, res) => {
	const condition = {
		plant: parseInt(req.body.plant),
	    batch: req.body.batch,
	    invoice: req.body.invoice,
	    material: parseInt(req.body.material),
	    customerId: parseInt(req.body.customerId)
	};

	Claim.findOne(condition, (error, result) => {
		if (error) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}