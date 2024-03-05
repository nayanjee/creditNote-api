const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BatchSchema = new mongoose.Schema({
    material: {
        type: Number,
        ref: "com_product",
        default: null
    },
    materialName: {
        type: String,
        default: null
    },
    plant: {
        type: Number,
        default: null
    },
    division: {
        type: Number,
        ref: "com_division",
        default: 0
    },
    divName: {
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
    mrp2: {
        type: Number,
        default: 0
    },
    ptd2: {
        type: Number,
        default: 0
    },
    ptr2: {
        type: Number,
        default: 0
    },
    pts2: {
        type: Number,
        default: 0
    },
    mrp3: {
        type: Number,
        default: 0
    },
    ptd3: {
        type: Number,
        default: 0
    },
    ptr3: {
        type: Number,
        default: 0
    },
    pts3: {
        type: Number,
        default: 0
    },
    mrp4: {
        type: Number,
        default: 0
    },
    ptd4: {
        type: Number,
        default: 0
    },
    ptr4: {
        type: Number,
        default: 0
    },
    pts4: {
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
    }
}, {
    timestamps: true
});

mongoose.model('com_batch', BatchSchema);
module.exports = mongoose.model('com_batch');
