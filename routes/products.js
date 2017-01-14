const express = require('express');
const router = express.Router();
const Products = require('../db/products');
const To = require('../To');

router.get('/', (req, res) => {
	let productListData = Products.all();
	if(Object.keys(productListData).length === 0) {
		res.render('products', { "allProducts": true, "product": Products.getEmptyProduct() });
	}else{
		res.render('products', { "allProducts": true, "product": productListData });
	}
});

router.get('/.json', (req, res) => {
	let productListData = Products.all();
	res.json({ "success": true, "product list": productListData });
});

router.get('/:id', (req, res) => {
	let urlID = req.params.id;
	let productData = Products.getByID(urlID);
	res.render('products', { "oneProduct": true, "product": productData });
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

router.put('/:id', (req, res) => {
	function success() {
		res.redirect(303, `/products/${req.body.id}`);
	}
	function failure() {
		res.redirect(303, `/products/${req.body.id}/edit`);
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

module.exports = router;