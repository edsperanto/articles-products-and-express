const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Products = require('../db/products');
const To = require('../helpers/To');
const productModel = require('../models/products');

router.get('/', (req, res) => {
	productModel.all()
		.then(productsList => {
			if(productsList.length === 0) {
				console.log('zerooo');
				res.render("products", { "allProducts": true, "product": {"empty": { 'name': 'Product list is empty', 'notEmpty': false }} });
			}else{
				let outputObj = {};
				productsList.forEach(product => {
					outputObj[product.id] = product;
				});
				res.render("products", { "allProducts": true, "product": outputObj });
			}
		});
});

router.get('/new', (req, res) => {
	res.render("products", { "newProduct": true, "product": { "err": false } });
});

router.get('/new/err', (req, res) => {
	res.render("products", { "newProduct": true, "product": { "err": true } });
});

router.get('/:id', (req, res) => {
	let urlID = req.params.id;
	productModel.getByID(urlID).
		then(productData => {
			res.render("products", { "oneProduct": true, "product": productData });
		});
});

router.get('/:id/edit', (req, res) => {
	res.render("products", { "editProduct": true, "product": Products.getByID(req.params.id) });
});

router.post('/', (req, res) => {
	function success() {
		res.render("products", { "allProducts": true, "product": Products.all() });
	}
	function failure() {
		res.redirect(303, `/products/new/err`);
	}
	Products.add(req.body, success, failure);
});

router.put('/:id', (req, res) => {
	for(key in req.body) {
		if(req.body[key] === "") {
			req.body[key] = undefined;
		}
	}
	function success() {
		let urlID = req.params.id;
		let productData = Products.getByID(urlID);
		res.render("products", { "oneProduct": true, "product": productData });
	}
	function failure() {
		let productData = Products.getByID(req.params.id);
		productData.err = true;
		res.render("products", { "editProduct": true, "product": productData });
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
	if(req.params.id !== req.body.id) {
		failure();
	}else{
		Products.deleteByID(req.body, success, failure);
	}
});

module.exports = router;