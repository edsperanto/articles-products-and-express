const express = require('express');
const router = express.Router();
const Products = require('../db/products');
const To = require('../To');

router.get('/', (req, res) => {
	res.render("products", { "allProducts": true, "product": Products.all() });
});

router.get('/test', (req, res) => {
	let productListData = Products.all();
	res.json({ "success": true, "product list": productListData });
});

router.get('/:id', (req, res) => {
	let urlID = req.params.id;
	let productData = Products.getByID(urlID);
	res.render("products", { "oneProduct": true, "product": productData });
});

router.get('/:id/test', (req, res) => {
	let productData = Products.getByID(req.params.id);
	res.json({ "success": true, "product": productData });
});

router.get('/:id/edit', (req, res) => {
	res.render("products", { "editProduct": true, "product": Products.getByID(req.params.id) });
});

router.post('/', (req, res) => {
	function success() {
		res.redirect(303, `/products`);
	}
	function failure() {
		res.redirect(303, `/products/new`);
	}
	Products.add(req.body, success, failure);
});

router.post('/test', (req, res) => {
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
		res.render("products", { "editProduct": true, "product": Products.getByID(req.params.id) });
	}
	function failure() {
		res.redirect(303, `/products/${req.body.id}/edit`);
	}
	Products.editByID(req.body, success, failure);
});

router.put('/:id/test', (req, res) => {
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
		res.redirect(303, `/products`);
	}
	function failure() {
		res.redirect(303, `/products/${req.body.id}`);
	}
	Products.deleteByID(req.body, success, failure);
});

router.delete('/:id/test', (req, res) => {
	function success() {
		res.json({ "success": true, "new product list": Products.all() });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.deleteByID(req.body, success, failure);
});

module.exports = router;