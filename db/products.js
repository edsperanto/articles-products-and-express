const To = require('../To');

module.exports = (function() {

	const rndIDStrLength = 6;
	let _list = {};

	function _all() {
		let returnObj = { "empty": {} };
		if(Object.keys(_list).length === 0) {
			returnObj.empty.name = "Product List is Empty";
			returnObj.empty.notEmpty = false;
		}else{
			returnObj = To.cloneObj(_list);
		}
		return returnObj;
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
		_list[data.id].price = "$" + To.moneyToNum(_list[data.id].price).toFixed(2);
	}

	function _add(data, success, failure) {
		if(_newProductHasValidFormat(data)) {
			data.id = To.rndStr(rndIDStrLength);
			_list[data.id] = {};
			_list[data.id].notEmpty = true;
			_updateProduct(data);
			success(_getByID(data.id));
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
		let returnObj = {};
		if(_list[id] === undefined) {
			returnObj.id = "empty";
			returnObj.name = "Product Does Not Exist";
		}else{
			returnObj = To.cloneObj(_list[id]);
		}
		return returnObj;
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
		let ID = parseInt(data.id);
		let productExists = typeof _list[data.id] === 'object';
		if(productExists && isNaN(ID) === false) {
			delete _list[data.id];
			success();
		}else{
			failure();
		}
	}

	function _reset() {
		_list = {};
	}

	return {
		all: _all,
		add: _add,
		getByID: _getByID,
		editByID: _editByID,
		deleteByID: _deleteByID,
		reset: _reset
	}

})();