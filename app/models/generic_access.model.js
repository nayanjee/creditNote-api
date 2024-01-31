const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccessSchema = new mongoose.Schema({
	portalId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "gen_portal",
		default: null
	},
    permissionId: {
        type: Number, 
        default: null
      },
	permissionName: {
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
  }
}, {
  timestamps: true
});

mongoose.model('gen_access', AccessSchema);
module.exports = mongoose.model('gen_access');
