const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesAllocatedQuantitySchema = new mongoose.Schema({
    claimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cn_claim",
        default: null
    },
    distInvoiceNo: {
        type: Number,
        default: 0
    },
    distInvoiceQty: {
        type: Number,
        default: 0
    },
    stkInvoiceNo: {
        type: Number,
        default: 0
    },
    stkInvoiceQty: {
        type: Number,
        default: 0
    },
    allocatedQty: {
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

mongoose.model('cn_sales_allocated_quantity', SalesAllocatedQuantitySchema);
module.exports = mongoose.model('cn_sales_allocated_quantity');
