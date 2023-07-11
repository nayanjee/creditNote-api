const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermissionSchema = new mongoose.Schema({
  userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Admin",
		default: null
	},
	portalId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Portal",
		default: null
	},
	permissions: [
		{
			type: Object,
			default: []
		}
	],
	createdBy: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: "Admin",
	  default: null
	},
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  }
}, {
  timestamps: true
});

mongoose.model('gen_permission', PermissionSchema);
module.exports = mongoose.model('gen_permission');
