const mongoose = require("mongoose");

const db = require("../models");
const Claim = db.cn_claim;
const ClaimFile = db.cn_claim_file;

exports.getAll = function (req, res) {
	const condition = {
		isActive: true, 
		isDeleted: false
	};

	/* const condition = {
		isActive: true, 
		isDeleted: false,
		expireOn: { $gt: new Date("2021-01-01T00:00:00.000Z") }		// show batch by date
	}; */

	Claim.find(condition, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	}).sort({ name: 1 });
};

exports.getClaim = function(req, res) {
	if (!req.body.customerId) return res.status(200).send({ status: 400, param: 'customerId', message: 'Stockiest is required.' });

	let condition = { isDraft: true };
	if (req.body.customerId) condition.customerId = parseInt(req.body.customerId);
	if (req.body.month) condition.claimMonth 			= parseInt(req.body.month);
	if (req.body.year) condition.claimYear 				= parseInt(req.body.year);
	if (req.body.division) condition.divisionName = req.body.division;
	if (req.body.type) condition.claimType 				= req.body.type;

	Claim.aggregate([
		{
			$match: condition
		}, {
			$lookup: {
			from: 				"cn_claim_files",
			localField: 	"_id",
			foreignField: "claimId",
			as: 					"files"
		}
	}
	]).exec( (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
}

exports.create = function(req, res) {
	if (req.body.header) {
		const explodeHeader = req.body.header.split('.::.');
		if (explodeHeader.length === 5) {
			const totRecords 	= req.body.claims.length + 1;

			// Seperate all the value from header and specify it
			const customerId 	= explodeHeader[0];
			const claimType 	= explodeHeader[1];
			const claimMonth 	= explodeHeader[2];
			const claimYear 	= explodeHeader[3];
			const userId 			= explodeHeader[4];
			
			for (var i = 0; i < totRecords; i++) {
				let enterData = [];
				if (i === 0) { 	// Default fields
					// Keep all data as per database
					const fd = {
						customerId 			: customerId,
						claimType				:	claimType,
						claimMonth			:	claimMonth,
						claimYear				:	claimYear,
						invoice					:	req.body.def_invoice,
						batch						:	req.body.def_batch,
						divisionName		:	req.body.def_division,
						materialName		:	req.body.def_product,
						//particulars			:	'',
						mrp							:	req.body.def_mrp,
						pts							:	req.body.def_pts,
						ptr							:	req.body.def_ptr,
						ptd							:	req.body.def_ptd,
						billingRate			:	req.body.def_billingRate,
						margin					:	req.body.def_margin,
						freeQuantity		:	req.body.def_freeQuantity,
						saleQuantity		:	req.body.def_saleQuantity,
						difference			:	req.body.def_difference,
						totalDifference	:	req.body.def_totalDifference,
						amount					:	req.body.def_amount,
						createdBy				: mongoose.Types.ObjectId(userId)
					}
					enterData.push(fd);
				} else { // Add more fields
					// Keep all data as per database
					const fd = {
						customerId 			: customerId,
						claimType				:	claimType,
						claimMonth			:	claimMonth,
						claimYear				:	claimYear,
						invoice					:	req.body.claims[i-1].invoice,
						batch						:	req.body.claims[i-1].batch,
						divisionName		:	req.body.claims[i-1].division,
						materialName		:	req.body.claims[i-1].product,
						//particulars			:	'',
						mrp							:	req.body.claims[i-1].mrp,
						pts							:	req.body.claims[i-1].pts,
						ptr							:	req.body.claims[i-1].ptr,
						ptd							:	req.body.claims[i-1].ptd,
						billingRate			:	req.body.claims[i-1].billingRate,
						margin					:	req.body.claims[i-1].margin,
						freeQuantity		:	req.body.claims[i-1].freeQuantity,
						saleQuantity		:	req.body.claims[i-1].saleQuantity,
						difference			:	req.body.claims[i-1].difference,
						totalDifference	:	req.body.claims[i-1].totalDifference,
						amount					:	req.body.claims[i-1].amount,
						createdBy				: mongoose.Types.ObjectId(userId)
					}
					enterData.push(fd);
				}
				console.log('enterData--', enterData);
				if (enterData.length) {
					Claim.create(enterData, (err, rec) => {
						if (err === null && rec.length === 1) {
							//console.log("rec---", rec[0]);
							if (req.body.def_image) {
								const explodeImage = req.body.def_image.split('.::.');
								console.log('explodeImage--', explodeImage);
								if (explodeImage.length) {
									let images = [];
									for (var j = 0; j < explodeImage.length-1; j++) {
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
							}
						}
					});
				}
			}
			res.status(200).send({ status: 200, message: "success", data: [] });
		}
	}
}
