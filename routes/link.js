const express = require('express');
const router = express.Router();
const Category = require('../models/Category.js');
const Link = require('../models/Link.js');
var isAuthenticated = require('../middlewares/isAuthenticated');

// All links
router.get('/', function(req, res, next) {
	Link.find({ $or: [{}, { id: req.params.id }] }).exec(function(err, links) {
		if (err) {
			return next(err.message);
		} else {
			return res.json(links);
		}
	});
});

// Create a link
router.post('/', isAuthenticated, function(req, res, next) {
	Category.findById(req.body.category).then(function(category) {
		const link = new Link({
			title: req.body.title,
			description: req.body.description,
			url: req.body.url,
			vote: req.body.vote,
			category: req.body.category
		});
		link.save(function(err) {
			if (err) {
				return next(err.message);
			} else {
				category.links.push(link._id);
				category.save();
				return res.json(link);
			}
		});
	});
});

module.exports = router;
