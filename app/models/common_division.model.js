const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DivisionSchema = new mongoose.Schema({
	division: {
		type: Number,
		default: 0
	},
	name: {
		type: String,
		default: null
	},
	isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
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

mongoose.model('com_division', DivisionSchema);
module.exports = mongoose.model('com_division');
