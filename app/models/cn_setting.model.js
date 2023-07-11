const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new mongoose.Schema({
    batchDate: {        // Batch restrictions for loading issue on claim form
		type: Date,
        default: null
	},
	createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gen_user",
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gen_user",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('cn_setting', LogSchema);
module.exports = mongoose.model('cn_setting');
