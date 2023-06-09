const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClaimSchema = new mongoose.Schema({
    customerId: {
        type: Number,
        default: null
    },
    claimType: {
        type: String,
        default: null
    },
    claimMonth: {
        type: Number,
        default: null
    },
    claimYear: {
        type: Number,
        default: null
    },
    invoice: {
        type: String,
        default: null
    },
    batch: {
        type: String,
        default: null
    },
    divisionName: {
        type: String,
        default: null
    },
    materialName: {
        type: String,
        default: null
    },
    particulars: {
        type: String,
        default: null
    },
    mrp: {
        type: Number,
        default: null
    },
    pts: {
        type: Number,
        default: null
    },
    ptr: {
        type: Number,
        default: null
    },
    ptd: {
        type: Number,
        default: null
    },
    billingRate: {
        type: Number,
        default: null
    },
    margin: {
        type: Number,
        default: null
    },
    freeQuantity: {
        type: Number,
        default: null
    },
    saleQuantity: {
        type: Number,
        default: null
    },
    difference: {
        type: Number,
        default: null
    },
    totalDifference: {
        type: Number,
        default: null
    },
    amount: {
        type: Number,
        default: null
    },
    isDraft: {
        type: Boolean,
        default: true
    },
    isSubmit: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedOn: {
        type: Date,
        default: null
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gen_user",
        default: null
    },
    submittedOn: {
        type: Date,
        default: null
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gen_user",
        default: null
    },
    deletedOn: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gen_user",
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

mongoose.model('cn_claim', ClaimSchema);
module.exports = mongoose.model('cn_claim');
