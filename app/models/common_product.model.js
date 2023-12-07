const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    material: {
        type: Number,
        default: null
    },
    plant: {
        type: Number,
        default: null
    },
    materialName: {
        type: String,
        default: null
    },
    materialType: {
        type: String,
        default: null
    },
    materialGroup: {
        type: String,
        default: null
    },
    baseUnitMeasure: {
        type: String,
        default: null
    },
    purchaseGroup: {
        type: Number,
        default: 0
    },
    mrpType: {
        type: String,
        default: null
    },
    division: {
        type: Number,
        default: 0
    },
    mrp: {
        type: Number,
        default: 0
    },
    ptd: {
        type: Number,
        default: 0
    },
    ptr: {
        type: Number,
        default: 0
    },
    pts: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
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
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gen_user",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('com_products', ProductSchema);
module.exports = mongoose.model('com_products');
