const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesAllocatedQuantitySchema = new mongoose.Schema({
    claimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cn_claim",
        default: null
    },
    billToParty: {
        type: Number,
        default: 0
    },
    stkInvoiceNo: {
        type: String,
        default: null
    },
    stkInvoiceQty: {
        type: Number,
        default: 0
    },
    allocatedQty: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

mongoose.model('cn_sales_allocated_quantity', SalesAllocatedQuantitySchema);
module.exports = mongoose.model('cn_sales_allocated_quantity');
