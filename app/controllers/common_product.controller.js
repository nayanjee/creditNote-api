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
