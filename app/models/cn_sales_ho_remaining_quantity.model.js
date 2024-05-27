const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesHoRemainingSchema = new mongoose.Schema({
    billDocNumber: {
        type: String,
        default: null
    },
    /*billToParty: {
        type: Number,
        default: 0
    },*/
    batch: {
        type: String,
        default: null
    },
    quantity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

mongoose.model('cn_sales_ho_remaining_quantity', SalesHoRemainingSchema);
module.exports = mongoose.model('cn_sales_ho_remaining_quantity');
