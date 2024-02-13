const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// This table is being used as an "Exclude Stockiest".
const UserSchema = new mongoose.Schema({
  userType: {
    type: String,   // Head Office, Field Officer, Stockist, Distributor
    default: 'ho'
  },
  name: {           // User name OR Organization name
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  code: {
    type: Number,
    default: null
  },
  workType: {     // HO, HOS, SUH, Field
    type: String,
    default: null
  },
  supervisor: {
    type: Number,
    default: null
  },
  isSupervisor: {
    type: Boolean,
    default: false
  },
  /*distributors: [],
  divisions: [],
  stockiest: [],*/
  portals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_portal"
  }],
  image: {
    type: String,
    default: "6.jpg"
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

  password: {
    type: String,
  }
}, {
  timestamps: true
});

mongoose.model('gen_user', UserSchema);
module.exports = mongoose.model('gen_user');
