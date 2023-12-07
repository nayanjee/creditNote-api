const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// This table is being used as an "Exclude Stockiest".
const StockiestSchema = new mongoose.Schema({
  name: {             // User name OR Organization name
      type: String,
      default: null
  },
  email: {
      type: String,
  },
  password: {
      type: String,
  },
  type: {
      type: Number,   // 1=>Head Office, 2=>Field Officer, 3=>Stockist
      default: 1
  },
  isOfficer: {
    type: Boolean,
    default: false
  },
  image: {
      type: String,
      default: "6.jpg"
  },
  portals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gen_portal"
    }
  ],
  stockiest: [],
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

mongoose.model('gen_user', StockiestSchema);
module.exports = mongoose.model('gen_user');
