const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Products = require('../db/products');
const To = require('../To');

router.get('/', (req, res) => {
	res.json({ "success": true, "product list": Products.all() });
});

router.get('/reset', (req, res) => {
	Products.reset();
	res.json({ "success": true, "product list": Products.all() });
});

router.get('/:id', (req, res) => {
	let productData = Products.getByID(req.params.id);
	res.json({ "success": true, "product": productData });
});

router.post('/', (req, res) => {
	function success(newProduct) {
		res.json({ "success": true, "new product": newProduct });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.add(req.body, success, failure);
});

router.put('/:id', (req, res) => {
	function success() {
		res.json({ "success": true, "edited product": Products.getByID(req.params.id) });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.editByID(req.body, success, failure);
});

router.delete('/:id', (req, res) => {
	function success() {
		res.json({ "success": true, "new product list": Products.all() });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.deleteByID(req.body, success, failure);
});

module.exports = router;