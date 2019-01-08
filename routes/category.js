const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const Category = require('../models/Category.js');

// All categories
router.get('/', function(req, res, next) {
	Category.find()
		.sort('title')
		.exec(function(err, categories) {
			if (err) {
				return next(err.message);
			} else {
				return res.json(categories);
			}
		});
});

// Create a category
router.post('/', isAuthenticated, function(req, res, next) {
	const category = new Category({
		title: req.body.title,
		description: req.body.description,
		color: req.body.color
	});
	category.save(function(err) {
		if (err) {
			return next(err.message);
		} else {
			return res.json({
				_id: category._id,
				title: category.title,
				description: category.description,
				color: category.color
			});
		}
	});
});

// Read a category
router.get('/:id', function(req, res, next) {
	Category.findById(req.params.id)
		.populate('links')
		.exec(function(err, category) {
			if (err) {
				return next(err.message);
			}
			if (!category) {
				res.status(404);
				return next('Category not found');
			} else {
				return res.json(category);
			}
		});
});

// Update a category
router.put('/:id', isAuthenticated, function(req, res, next) {
	Category.findById(req.params.id, function(err, category) {
		if (err) {
			res.status(400);
			return next('An error occured');
		}
		if (!category) {
			res.status(404);
			return next('Category not found');
		} else {
			req.body && Object.assign(category, req.body);
			category.save();
			return res.json(category);
		}
	});
});

// Delete a category
router.delete('/:id', isAuthenticated, function(req, res, next) {
	Category.findByIdAndRemove(req.params.id, function(err, category) {
		if (err) {
			return next(err.message);
		}
		if (!category) {
			res.status(404);
			return next('Nothing to delete');
		} else {
			return res.json({
				message: 'Category deleted'
			});
		}
	});
});

module.exports = router;
