const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesHoSchema = new mongoose.Schema({
    plant: {
        type: Number,
        default: 0
    },
    billDocNumber: {
        type: String,
        default: null
        // cast: false
    },
    billDocDate: {
        type: Date,
        default: null
    },
    billDocType: {
        type: String,
        default: null
    },
    itemCategory: {
        type: String,
        default: null
    },
    billToParty: {
        type: Number,
        default: 0
    },
    billToPartyName: {
        type: String,
        default: null
    },
    division: {
        type: Number,
        default: 0
    },
    divisionName: {
        type: String,
        default: null
    },
    material: {
        type: Number,
        default: null
    },
    materialDesc: {
        type: String,
        default: null
    },
    batch: {
        type: String,
        default: null
    },
    saleUnit: {
        type: Number,
        default: 0
    },
    mrpAmount: {
        type: Number,
        default: 0
    },
    ptdAmount: {
        type: Number,
        default: 0
    },
    expireOn: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gen_user",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('cn_sales_ho', SalesHoSchema);
module.exports = mongoose.model('cn_sales_ho');
