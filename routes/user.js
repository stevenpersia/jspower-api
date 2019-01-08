const express = require('express');
const router = express.Router();
const uid2 = require('uid2');
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');
const isAuthenticated = require('../middlewares/isAuthenticated');
const User = require('../models/User.js');

// Login
router.post('/log_in', function(req, res, next) {
	User.findOne({ 'account.email': req.body.account.email }).exec(function(
		err,
		user
	) {
		if (err) return next(err.message);
		if (user) {
			if (
				SHA256(req.body.account.password + user.security.salt).toString(
					encBase64
				) === user.security.hash
			) {
				return res.json({
					_id: user._id,
					token: user.security.token,
					account: user.account
				});
			} else {
				return res.status(401).json({ error: 'Unauthorized' });
			}
		} else {
			return next('User not found');
		}
	});
});

// Create an account
router.post('/sign_up', function(req, res, next) {
	const token = uid2(64);
	const salt = uid2(64);
	const hash = SHA256(req.body.password + salt).toString(encBase64);

	const user = new User({
		account: {
			username: req.body.account.username,
			email: req.body.account.email
		},
		linksSubmitted: [],
		security: {
			token: token,
			hash: hash,
			salt: salt
		}
	});
	user.save(function(err) {
		if (err) {
			return next(err.message);
		} else {
			return res.json({
				_id: user._id,
				token: user.security.token,
				account: user.account
			});
		}
	});
});

// Read my profile
router.get('/:id', isAuthenticated, function(req, res, next) {
	User.findById(req.params.id)
		.exec()
		.then(function(user) {
			if (!user) {
				res.status(404);
				return next('User not found');
			}

			return res.json({
				_id: user._id,
				account: user.account
			});
		})
		.catch(function(err) {
			res.status(400);
			return next(err.message);
		});
});

// Update my profile
router.put('/:id', isAuthenticated, function(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if (err) {
			res.status(400);
			return next('An error occured');
		}
		if (!user) {
			res.status(404);
			return next('User not found');
		} else {
			req.body.account && Object.assign(user.account, req.body.account);
			user.save();
			return res.json(user);
		}
	});
});

// Delete my profile
router.delete('/:id', isAuthenticated, function(req, res, next) {
	User.findByIdAndRemove(req.params.id, function(err, user) {
		if (err) {
			return next(err.message);
		}
		if (!user) {
			res.status(404);
			return next('Nothing to delete');
		} else {
			return res.json({
				message: 'Account deleted'
			});
		}
	});
});

module.exports = router;
