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
	res.json(Products.deleteByID(req.body));
});

module.exports = router;