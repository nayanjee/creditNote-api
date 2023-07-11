const db = require("../models");
const Division = db.com_division;

exports.getAll = function (req, res) {
	Division.find({ isActive: true, isDeleted: false }, (error, result) => {
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
