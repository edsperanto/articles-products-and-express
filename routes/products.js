const express = require('express');
const router = express.Router();
const Products = require('../db/products');

router.get('/', (req, res) => {
	res.json(Products.all());
});

router.post('/', (req, res) => {
	res.json(Products.add(req.body));
});

router.put('/:id', (req, res) => {
	res.json(Products.editByID(req.body));
});

router.delete('/:id', (req, res) => {
	let linkIDMatchesJsonID = req.param("id") === req.body.id;
	let productExists = typeof productData[req.body.id] === 'object';
	if(linkIDMatchesJsonID && productExists) {
		delete productData[req.body.id];
		res.json({ success: true });
	}else{
		res.json({ success: false });
	}
});

module.exports = router;