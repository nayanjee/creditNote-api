const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BatchSchema = new mongoose.Schema({
    batch: {
        type: String,
        default: null
    },
    division: {
        type: Number,
        ref: "com_division",
        default: 0
    },
    material: {
        type: Number,
        ref: "com_product",
        default: null
    },
    mrp: {
        type: Number,
        default: null
    },
    ptd: {
        type: Number,
        default: null
    },
    ptr: {
        type: Number,
        default: null
    },
    pts: {
        type: Number,
        default: null
    },
    expireOn: {
        type: Date,
        default: null
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
