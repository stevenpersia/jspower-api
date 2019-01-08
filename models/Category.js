const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
	title: { type: String, unique: true },
	description: String,
	color: String,
	icon: String,
	links: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Link'
		}
	],
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema, 'categories');
