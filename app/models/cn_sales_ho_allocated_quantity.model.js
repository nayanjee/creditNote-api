const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesHoAllocatedQuantitySchema = new mongoose.Schema({
    claimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cn_claim",
        default: null
    },
    billToParty: {
        type: Number,
        default: 0
    },
    distInvoiceNo: {
        type: String,
        default: null
    },
    distInvoiceQty: {
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

mongoose.model('cn_sales_ho_allocated_quantity', SalesHoAllocatedQuantitySchema);
module.exports = mongoose.model('cn_sales_ho_allocated_quantity');
