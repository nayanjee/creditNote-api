const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockiestSchema = new mongoose.Schema({
    plant: {
        type: Number,
        default: null
    },
    customerId: {
        type: Number,
        default: null
    },
    organization: {
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

mongoose.model('com_stockiest', StockiestSchema);
module.exports = mongoose.model('com_stockiest');
