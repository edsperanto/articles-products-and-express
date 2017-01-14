const To = require('../To');

module.exports = (function() {

	let _list = {};

	function _all() {
		return To.cloneObj(_list);
	}

	function _priceToNumber(price) {
		let priceStr = price.trim();
		let priceStrNo$ = (priceStr.charAt(0) === '$') ? (priceStr.substr(1)) : (priceStr);
		let priceNum = Number(priceStrNo$.trim());
		return isNaN(priceNum) ? false : priceNum;
	}

	function _newProductHasValidFormat(data) {
		let nameIsStr = typeof data.name === 'string';
		let priceIsNum = typeof _priceToNumber(data.price) === 'number';
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
		_list[data.id].price = _priceToNumber(data.price);
	}

	function _generateNewID() {
		return Math.random().toString(36).slice(2).substr(0, 10);
	}

	function _add(data, success, failure) {
		if(_newProductHasValidFormat(data)) {
			data.id = _generateNewID();
			_list[data.id] = {};
			_updateProduct(data);
			success();
		}else{
			failure();
		}
	}

	function _editProductHasValidFormat(data) {
		let productExists = typeof _list[data.id] === 'object';
		let nameIsStr = typeof data.name === 'string' || data.name === undefined;
		let priceIsNum = typeof _priceToNumber(data.price) === 'number' || data.price === undefined;
		let inventoryIsStr = typeof data.inventory === 'string' || data.inventoy === undefined;
		return productExists && nameIsStr && priceIsNum && inventoryIsStr;
	}

	function _getByID(data) {
		return To.cloneObj(_list[data.id]);
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