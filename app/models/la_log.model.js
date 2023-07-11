const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new mongoose.Schema({
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
	summary: {
		type: String,
		default: null
	},
	description: {
		type: String,
		default: null
	},
	effectOn: {
		type: mongoose.Schema.Types.ObjectId,
		default: null
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

mongoose.model('la_log', LogSchema);
module.exports = mongoose.model('la_log');
