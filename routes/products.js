const express = require('express');
const router = express.Router();
let productData = {
	newId: 1
};

router.post('/', (req, res) => {
	function priceToNumber() {
		let priceStr = req.body.price.trim();
		let priceStrWithoutDollarSign = (priceStr.charAt(0) === '$') ? (priceStr.substr(1)) : (priceStr);
		let priceNum = Number(priceStrWithoutDollarSign.trim());
		return isNaN(priceNum) ? (false) : (Number(priceStr));
	}
	function productHasValidFormat() {
		let nameIsStr = typeof req.body.name === 'string';
		let priceIsNum = typeof priceToNumber() === 'number';
		let inventoryIsStr = typeof req.body.inventory === 'string';
		return nameIsStr && priceIsNum && inventoryIsStr;
	}
	if(productHasValidFormat()) {
		let currentIndex = productData.newId;
		productData[currentIndex] = req.body;
		productData[currentIndex]["price"] = priceToNumber().toFixed(2);
		productData[currentIndex]["id"] = currentIndex;
		productData.newId++;
		res.end();
	}
});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;