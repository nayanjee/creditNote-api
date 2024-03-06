const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesSchema = new mongoose.Schema({
    billDocNumber: {
        type: String,
        default: null
    },
    billDocDate: {
        type: Date,
        default: null
    },
    itemCategory: {
        type: String,
        default: null
    },
    billDocType: {
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
    plant: {
        type: Number,
        default: 0
    },
    billToParty: {
        type: Number,
        default: 0
    },
    billToPartyName: {
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
    expireOn: {
        type: Date,
        default: null
    },
    saleUnit: {
        type: Number,
        default: 0
    },
    mrp: {
        type: Number,
        default: 0
    },
    pts: {
        type: Number,
        default: 0
    },
    ptr: {
        type: Number,
        default: 0
    },
    ptd: {
        type: Number,
        default: 0
    },
    /*billValue: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    netValue: {
        type: Number,
        default: 0
    },
    totalValue: {
        type: Number,
        default: 0
    },
    roundOfValue: {
        type: Number,
        default: 0
    },
    month: {
        type: Number,
        default: null
    },
    year: {
        type: Number,
        default: null
    },
    monthYear: {
        type: Date,
        default: null
    },*/
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gen_user",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('cn_sales', SalesSchema);
module.exports = mongoose.model('cn_sales');
