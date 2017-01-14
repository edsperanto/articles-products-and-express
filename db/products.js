const To = require('../To');

module.exports = (function() {

	const rndIDStrLength = 6;
	let _list = {};

	function _all() {
		return To.cloneObj(_list);
	}

	function _newProductHasValidFormat(data) {
		let nameIsStr = typeof data.name === 'string';
		let priceIsNum = typeof To.moneyToNum(data.price) === 'number';
		let inventoryIsStr = typeof data.inventory === 'string';
		return nameIsStr && priceIsNum && inventoryIsStr;
	}

	function _updateProduct(data) {
		let validKeys = ['id', 'name', 'price', 'inventory'];
		validKeys.forEach(key => {
			if(data[key] !== undefined) {
				_list[data.id][key] = data[key];
			}
		});
		_list[data.id].price = "$" + To.moneyToNum(data.price).toFixed(2);
	}

	function _add(data, success, failure) {
		if(_newProductHasValidFormat(data)) {
			data.id = To.rndStr(rndIDStrLength);
			_list[data.id] = {};
			_updateProduct(data);
			success();
		}else{
			failure();
		}
	}

	function _editProductHasValidFormat(data) {
		let productExists = typeof _list[data.id] === 'object';
		let noName = data.name === undefined;
		let noPrice = data.price === undefined;
		let noInventory = data.inventory === undefined;
		let nameIsStr = typeof data.name === 'string';
		let priceIsNum = typeof To.moneyToNum(data.price) === 'number';
		let inventoryIsStr = typeof data.inventory === 'string';
		return productExists 
				&& (noName || nameIsStr)
				&& (noPrice || priceIsNum)
				&& (noInventory || inventoryIsStr);
	}

	function _getByID(id) {
		return To.cloneObj(_list[id]);
	}

	function _editByID(data, success, failure) {
		if(_editProductHasValidFormat(data)) {
			_updateProduct(data);
			success();
		}else{
			failure();
		}
	}

	function _deleteByID(data, success, failure) {
		let productExists = typeof _list[data.id] === 'object';
		if(productExists) {
			delete _list[data.id];
			success();
		}else{
			failure();
		}
	}

	return {
		all: _all,
		add: _add,
		getByID: _getByID,
		editByID: _editByID,
		deleteByID: _deleteByID
	}

})();