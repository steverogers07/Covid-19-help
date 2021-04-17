var mongoose = require("mongoose");

var count = new mongoose.Schema({
	patientId: Number,
	reportedOn: String,
	onsetEstimate: String,
	ageEstimate:Number,
	gender: String,
	city: String,
	district: String,
	state: String,
	status: String,
	notes: String,
	contractedFrom: String
});

module.exports = mongoose.model("Count", count);