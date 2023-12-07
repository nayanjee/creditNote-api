const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesHoSchema = new mongoose.Schema({
    plant: {
        type: Number,
        default: 0
    },
    billDocNumber: {
        type: Number,
        default: 0
    },
    billDocDate: {
        type: Date,
        default: null
    },
    billDocType: {
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
    netValue: {
        type: Number,
        default: 0
    },
    itemCategory: {
        type: String,
        default: null
    },
    salesOrg: {
        type: Number,
        default: 0
    },
    distChannel: {
        type: Number,
        default: 0
    },
    salesRegion: {
        type: String,
        default: null
    },
    storageLocation: {
        type: String,
        default: null
    },
    paymentTermDesc: {
        type: String,
        default: null
    },
    gstNo: {
        type: String,
        default: null
    },
    billPartyCity: {
        type: String,
        default: null
    },
    salesUom: {
        type: String,
        default: null
    },
    mrp: {
        type: Number,
        default: 0
    },
    ptd: {
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
    billValue: {
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
    discount: {
        type: Number,
        default: 0
    },
    expireOn: {
        type: Date,
        default: null
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
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('cn_sales_ho', SalesHoSchema);
module.exports = mongoose.model('cn_sales_ho');
