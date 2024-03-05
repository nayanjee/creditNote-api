const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesAllocatedQuantitySchema = new mongoose.Schema({
    claimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cn_claim",
        default: null
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
    }
}, {
    timestamps: true
});

mongoose.model('cn_sales_allocated_quantity', SalesAllocatedQuantitySchema);
module.exports = mongoose.model('cn_sales_allocated_quantity');
