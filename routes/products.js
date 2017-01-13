const express = require('express');
const router = express.Router();
let productData = {
	generateNewID: function() {
		return currentID = Math.random().toString(36).slice(2).substr(0, 10);
	}
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
		let currentID = productData.generateNewID();
		productData[currentID] = req.body;
		productData[currentID]["price"] = priceToNumber().toFixed(2);
		productData[currentID]["id"] = currentID;
		console.log(productData[currentID]);
		res.end();
	}
});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;