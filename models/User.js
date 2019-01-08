const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	account: {
		username: String,
		email: { type: String, unique: true }
	},
	linksSubmitted: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Link'
			}
		}
	],
	security: {
		token: String,
		hash: String,
		salt: String
	},
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema, 'users');
