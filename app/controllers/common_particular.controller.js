const db = require("../models");
const Category = db.com_category;
const Particular = db.com_particular;

exports.getAll = function (req, res) {
	const condition = {
		isActive: true, 
		isDeleted: false
	};
	Particular.find(condition, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	}).sort({ name: 1 });
};

exports.getAllCategory = function (req, res) {
	const condition = {
		isActive: true, 
		isDeleted: false
	};
	Category.find(condition, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	}).sort({ name: 1 });
};

exports.getParticularsByName = function (req, res) {
	const name = req.params.name;
	var regexp = new RegExp(`^${req.params.name}`);
	console.log('name--', name);
	Particular.find({ name: {$regex: name, $options: 'i'} }, (error, result) => {
		if (error) return res.status(400).send({ status: 400, message: 'problemFindingRecord' });
		if (!result) return res.status(200).send({ status: 400, message: 'noRecord' });

		res.status(200).send({ status: 200, message: 'Success', data: result });
	});
};
