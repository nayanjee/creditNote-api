const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmpDistributorStockistDivisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },
  empCode: {
    type: Number,
    default: 0
  },
	plant: {
    type: Number,
    default: 0
  },
  divisions: [],
  stockists: [],
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

mongoose.model('cn_emp_dist_stockist_division', EmpDistributorStockistDivisionSchema);
module.exports = mongoose.model('cn_emp_dist_stockist_division');