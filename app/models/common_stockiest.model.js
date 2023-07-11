const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockiestSchema = new mongoose.Schema({
    plant: {
        type: String,
        default: null
    },
    customerId: {
        type: String,
        default: null
    },
    organization: {
        type: String,
        default: null
    },
    country: {
		type: String,
		default: 'india'
	},
    state: {
        type: String,
        default: null
    },
    city: {
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

mongoose.model('com_stockiest', StockiestSchema);
module.exports = mongoose.model('com_stockiest');
