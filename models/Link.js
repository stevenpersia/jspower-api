const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
	title: String,
	description: String,
	url: { type: String, unique: true },
	vote: Number,
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	},
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Link', LinkSchema, 'links');
