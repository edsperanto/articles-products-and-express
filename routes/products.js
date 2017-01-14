const express = require('express');
const router = express.Router();
const Products = require('../db/products');

router.get('/', (req, res) => {
	res.json(Products.all());
});

router.post('/', (req, res) => {
	function success() {
		res.json({ "success": true });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.add(req.body, success, failure);
});

router.put('/:id', (req, res) => {
	function success() {
		res.json({ "success": true, "updated product": Products.getByID(req.body) });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.editByID(req.body, success, failure);
});

router.delete('/:id', (req, res) => {
	function success() {
		res.json({ "success": true, "product list": Products.all() });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.deleteByID(req.body, success, failure);
});

module.exports = router;