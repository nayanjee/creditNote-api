const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    plant: {
        type: Number,
        default: null
    },
    division: {
        type: Number,
        default: 0
    },
    material: {
        type: Number,
        default: null
    },
    materialName: {
        type: String,
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
