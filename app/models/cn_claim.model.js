const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClaimSchema = new mongoose.Schema({
  plant: {
    type: Number,
    default: null
  },
  customerId: {
    type: Number,
    default: null
  },
  claimType: {
    type: String,
    default: null
  },
  claimMonth: {
    type: Number,
    default: null
  },
  claimYear: {
    type: Number,
    default: null
  },
  invoice: {
    type: String,
    default: null
  },
  batch: {
    type: String,
    default: null
  },
  divisionId: {
    type: Number,
    default: null
  },
  divisionName: {
    type: String,
    default: null
  },
  material: {
    type: Number,
    default: null
  },
  materialName: {
    type: String,
    default: null
  },
  particulars: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: null
  },
  supplyProof: {
    type: String,
    default: null
  },
  purchaseOrder: {
    type: String,
    default: null
  },
  mrp: {
    type: Number,
    default: null
  },
  pts: {
    type: Number,
    default: null
  },
  ptr: {
    type: Number,
    default: null
  },
  ptd: {
    type: Number,
    default: null
  },
  billingRate: {
    type: Number,
    default: null
  },
  margin: {
    type: Number,
    default: 10
  },
  freeQuantity: {
    type: Number,
    default: null
  },
  saleQuantity: {
    type: Number,
    default: null
  },
  difference: {
    type: Number,
    default: null
  },
  totalDifference: {
    type: Number,
    default: null
  },
  amount: {
    type: Number,
    default: null
  },

  isDraft: {
    type: Boolean,
    default: true
  },

  isSubmit: {
    type: Boolean,
    default: false
  },
  submittedOn: {
    type: Date,
    default: null
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },

  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedOn: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },

  isFoApproved: {
    type: Boolean,
    default: false
  },
  foApprovedOn: {
    type: Date,
    default: null
  },
  foApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },

  isFoUnapproved: {
    type: Boolean,
    default: false
  },
  foUnapprovedOn: {
    type: Date,
    default: null
  },
  foUnapprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },
  foUnapprovedComment: {
    type: String,
    default: null
  },

  isApproved: {
    type: Boolean,
    default: false
  },
  approvedOn: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },

  isUnapproved: {
    type: Boolean,
    default: false
  },
  unapprovedOn: {
    type: Date,
    default: null
  },
  unapprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },

  canceledOn: {
    type: Date,
    default: null
  },
  canceledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },

  updateComment: {
    type: String,
    default: null
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

mongoose.model('cn_claim', ClaimSchema);
module.exports = mongoose.model('cn_claim');
