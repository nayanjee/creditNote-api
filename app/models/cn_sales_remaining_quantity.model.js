const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesRemainingSchema = new mongoose.Schema({
    billDocNumber: {
        type: Number,
        default: 0
    },
    billToParty: {
        type: Number,
        default: 0
    },
    itemCategory: {
        type: String,
        default: null
    },
    division: {
        type: Number,
        default: 0
    },
    batch: {
        type: String,
        default: null
    },
    quantity: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('cn_sales_remaining_quantity', SalesRemainingSchema);
module.exports = mongoose.model('cn_sales_remaining_quantity');
