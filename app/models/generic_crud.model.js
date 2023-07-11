const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CrudSchema = new mongoose.Schema({
  portalId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Portal",
		default: null
	},
	operation: {
		type: String,
	},
	operationId: {
		type: Number,
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

mongoose.model('gen_crud', CrudSchema);
module.exports = mongoose.model('gen_crud');
