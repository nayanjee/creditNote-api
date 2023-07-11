const db = require("../models");
const Batch = db.com_batch;
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