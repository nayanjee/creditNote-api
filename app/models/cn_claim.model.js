const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClaimSchema = new mongoose.Schema({
  plant: {
    type: Number,
    default: null
  },
  customerId: {
    type: Number,
    default: 0
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
  approvedQty: {
    type: Number,
    default: 0
  },
  approvedAmount: {
    type: Number,
    default: 0
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

  // inprogress => 0, approved => 1, unapproved => 2,
  ftStatus: {
    type: Number,
    default: 0
  },
  ftActionOn: {
    type: Date,
    default: null
  },
  ftActionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },
  ftUpdateComment: {
    type: String,
    default: null
  },
  ftApprovalComment: {
    type: String,
    default: null
  },
  
  suhStatus: {
    type: Number,
    default: 0
  },
  suhActionOn: {
    type: Date,
    default: null
  },
  suhActionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },
  suhUpdateComment: {
    type: String,
    default: null
  },
  suhApprovalComment: {
    type: String,
    default: null
  },

  hoStatus: {
    type: Number,
    default: 0
  },
  hoActionOn: {
    type: Date,
    default: null
  },
  hoActionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },
  hoUpdateComment: {
    type: String,
    default: null
  },
  hoApprovalComment: {
    type: String,
    default: null
  },

  ho1Status: {
    type: Number,
    default: 0
  },
  ho1ActionOn: {
    type: Date,
    default: null
  },
  ho1ActionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gen_user",
    default: null
  },
  ho1UpdateComment: {
    type: String,
    default: null
  },
  ho1ApprovalComment: {
    type: String,
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
