const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BatchSchema = new mongoose.Schema({
    material: {
        type: Number,
        ref: "com_product",
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
    batch: {
        type: String,
        default: null
    },
    manufacturedOn: {
        type: Date,
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
