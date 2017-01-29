const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Products = require('../db/products');
const To = require('../helpers/To');
const productModel = require('../models/products');

router.get('/', (req, res) => {
	productModel.all()
		.then(productsList => {
			res.render("products", { "allProducts": true, "product": productsList });
		})
		.catch(error => {
			res.render("products", { "allProducts": true, "product": {"empty": { 'name': 'Product list is empty', 'notEmpty': false }} });
		});
});

router.get('/new', (req, res) => {
	res.render("products", { "newProduct": true, "product": { "err": false } });
});

router.get('/new/err', (req, res) => {
	res.render("products", { "newProduct": true, "product": { "err": true } });
});

router.get('/:id', (req, res) => {
	productModel.getByID(req.params.id)
		.then(productData => {
			productData.notEmpty = true;
			res.render("products", { "oneProduct": true, "product": productData });
		})
		.catch(err => {
			res.render("products", { "oneProduct": true, "product": {"id": "empty", "name": "Product does not exist"} });
		});
});

router.get('/:id/edit', (req, res) => {
	productModel.getByID(req.params.id)
		.then(productData => {
			res.render("products", { "editProduct": true, "product": productData });
		})
		.catch(err => {
			res.render("products", { "oneProduct": true, "product": {"id": "empty", "name": "Product does not exist"} });
		});
});

router.post('/', (req, res) => {
	productModel.add(req.body)
		.then(_ => {
			productModel.all()
				.then(productsList => {
					res.render("products", { "allProducts": true, "product": productsList });
				});
		})
		.catch(err => {
			res.redirect(303, `/products/new/err`);
		});
});

router.put('/:id', (req, res) => {
	productModel.editByID(req.body, (status, productData) => {
		if(status === 'success') {
			console.log('EDIT SUCCESS');
			res.render("products", { "oneProduct": true, "product": productData });
		}else{
			console.log('EDIT FAIL');
			res.render("products", { "editProduct": true, "product": productData });
		}
	});
});

router.delete('/:id', (req, res) => {
	productModel.deleteByID(req.body)
		.then(_ => {
			res.redirect(303, `/products`);
		})
		.catch(_ => {
			res.redirect(303, `/products/${req.body.id}`);
		});
});

module.exports = router;