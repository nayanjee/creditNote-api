const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DistributorDivisionSchema = new mongoose.Schema({
	plant: {
    type: Number,
    default: 0
  },
	divisions: [],
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

mongoose.model('cn_distributor_division', DistributorDivisionSchema);
module.exports = mongoose.model('cn_distributor_division');