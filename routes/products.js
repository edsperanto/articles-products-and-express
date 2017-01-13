const express = require('express');
const router = express.Router();

let productData = {
	generateNewID: function() {
		return currentID = Math.random().toString(36).slice(2).substr(0, 10);
	}
};

function priceToNumber(price) {
	let priceStr = price.trim();
	let priceStrWithoutDollarSign = (priceStr.charAt(0) === '$') ? (priceStr.substr(1)) : (priceStr);
	let priceNum = Number(priceStrWithoutDollarSign.trim());
	return isNaN(priceNum) ? (false) : (Number(priceStr));
}

router.post('/', (req, res) => {
	let price = priceToNumber(req.body.price);
	function productHasValidFormat() {
		let nameIsStr = typeof req.body.name === 'string';
		let priceIsNum = typeof price === 'number';
		let inventoryIsStr = typeof req.body.inventory === 'string';
		return nameIsStr && priceIsNum && inventoryIsStr;
	}
	if(productHasValidFormat()) {
		let currentID = productData.generateNewID();
		productData[currentID] = req.body;
		productData[currentID]["price"] = price.toFixed(2);
		productData[currentID]["id"] = currentID;
		res.end();
	}
});

router.put('/', (req, res) => {
	let price = priceToNumber(req.body.price);
	function productEditHasValidFormat() {
		let productExists = typoef productData[req.body.id] === 'object';
		let nameIsStr = typeof req.body.name === 'string' || req.body.name === undefined;
		let priceIsNum = typeof price === 'number' || price === undefined;
		let inventoryIsStr = typeof req.body.inventory === 'string' || req.body.inventory === undefined;
		return productExists = nameIsStr && priceIsNum && inventoryIsStr;
	}
	function updateProductData() {
		productData[req.body.id].name = req.body.name;
		productData[req.body.id].price = req.body.price;
		productData[req.body.id].inventory = req.body.inventory;
	}
	if(productEditHasValidFormat()) {
		updateProductData();
	}
});

router.delete('/', (req, res) => {

});

module.exports = router;