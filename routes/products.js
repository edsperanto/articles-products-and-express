const express = require('express');
const router = express.Router();
let productData = {
	newId: 1
};

router.post('/', (req, res) => {
	function priceToNumber() {
		let priceStr = req.body.price.trim();
		priceStr = (priceStr.charAt(0) === '$') ? (priceStr.substr(1)) : (priceStr);
		return isNaN(Number(priceStr)) ? (false) : (Number(priceStr));
	}
	function productHasValidFormat() {
		let nameIsStr = typeof req.body.name === 'string';
		let priceIsNum = typeof priceToNumber() === 'number';
		let inventoryIsStr = typeof req.body.inventory === 'string';
		return nameIsStr && priceIsNum && inventoryIsStr;
	}
	if(productHasValidFormat()) {
		console.log('yes');
		let currentIndex = productData.newId;
		productData[currentIndex] = req.body;
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