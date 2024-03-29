const db = require("../models");
const mongoose = require("mongoose");
const Division = db.com_division;

exports.add = (req, res) => {
	Division.findOne({ division: req.body.divisionID }, (error, result) => {
		if (error) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
		if (result) return res.status(200).send({ status: 400, message: 'Division ID already exist, please enter valid number.' });
		const reqData = {
			plant: req.body.plant,
			division: req.body.divisionID,
			name: req.body.divisionName,
			createdBy: mongoose.Types.ObjectId(req.body.loggedUserId)
		};

		Division.create(reqData, (err, suc) => {
			if (err) return res.status(200).send({ status: 400, message: 'somethingWrong' });
			res.status(200).send({ status: 200, message: 'added', data: suc });
		});
	});
};
exports.getAll = function (req, res) {
	Division.find({ isDeleted: false }, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	}).sort({ name: 1 });
};

exports.getDivisionById = function (req, res) {
	Division.findOne({ division: req.params.divisionId }, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
};

exports.getDivisionById2 = function (req, res) {
	Division.findOne({ _id: mongoose.Types.ObjectId(req.params.divisionId) }, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
};

exports.edit = function (req, res) {
	console.log(req.body);
	const newdivision = req.body.newdivision;
	const olddivision = req.body.olddivision;
	if (newdivision != olddivision) {
		Division.findOne({ division: newdivision }, (error, result) => {
			if (error) return res.status(200).send({ status: 400, message: 'problemFindingRecord' });
			if (result) return res.status(200).send({ status: 400, message: 'Division ID already exist, please enter valid number.' });

			const reqData = {
				plant: req.body.plant,
				name: req.body.name,
				division: req.body.newdivision,
				isActive: req.body.status,
				updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
			}
			Division.findByIdAndUpdate(req.body._id, reqData).exec((err, success) => {
				if (err) {
					return res.status(200).send({ status: 400, message: "somethingWrong" });
				} else {
					res.status(200).send({ status: 200, message: "success", data: [] });
				}
			});

		});
	} else {
		const reqData = {
			plant: req.body.plant,
			name: req.body.name,
			isActive: req.body.status,
			updatedBy: mongoose.Types.ObjectId(req.body.loggedUserId)
		}
		Division.findByIdAndUpdate(req.body._id, reqData).exec((err, success) => {
			if (err) {
				return res.status(200).send({ status: 400, message: "somethingWrong" });
			} else {
				res.status(200).send({ status: 200, message: "success", data: [] });
			}
		});
	}

}

exports.divisionByIds = function(req, res) {
  Division.find({ division: { $in: req.body } }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({ name: 1 });
}
