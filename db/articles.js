const To = require('../To');

module.exports = (function() {

	const rndIDStrLength = 6;
	let _list = {};

	function _all() {
		let returnObj = { "empty": {} };
		if(Object.keys(_list).length === 0) {
			returnObj.empty.name = "Article List is Empty";
			returnObj.empty.notEmpty = false;
		}else{
			returnObj = To.cloneObj(_list);
		}
		return returnObj;
	}

	function _newArticleHasValidFormat(data) {
		let nameIsStr = typeof data.name === 'string';
		let priceIsNum = typeof To.moneyToNum(data.price) === 'number';
		let inventoryIsStr = typeof data.inventory === 'string';
		return nameIsStr && priceIsNum && inventoryIsStr;
	}

	function _updateArticle(data) {
		let validKeys = ['id', 'name', 'price', 'inventory'];
		validKeys.forEach(key => {
			if(data[key] !== undefined) {
				_list[data.id][key] = data[key];
			}
		});
		_list[data.id].price = "$" + To.moneyToNum(_list[data.id].price).toFixed(2);
	}

	function _add(data, success, failure) {
		if(_newArticleHasValidFormat(data)) {
			data.id = To.rndStr(rndIDStrLength);
			_list[data.id] = {};
			_list[data.id].notEmpty = true;
			_updateArticle(data);
			success(_getByID(data.id));
		}else{
			failure();
		}
	}

	function _editArticleHasValidFormat(data) {
		let articleExists = typeof _list[data.id] === 'object';
		let noName = data.name === undefined;
		let noPrice = data.price === undefined;
		let noInventory = data.inventory === undefined;
		let nameIsStr = typeof data.name === 'string';
		let priceIsNum = typeof To.moneyToNum(data.price) === 'number';
		let inventoryIsStr = typeof data.inventory === 'string';
		return articleExists 
				&& (noName || nameIsStr)
				&& (noPrice || priceIsNum)
				&& (noInventory || inventoryIsStr);
	}

	function _getByID(id) {
		let returnObj = {};
		if(_list[id] === undefined) {
			returnObj.id = "empty";
			returnObj.name = "Article Does Not Exist";
		}else{
			returnObj = To.cloneObj(_list[id]);
		}
		return returnObj;
	}

	function _editByID(data, success, failure) {
		if(_editArticleHasValidFormat(data)) {
			_updateArticle(data);
			success();
		}else{
			failure();
		}
	}

	function _deleteByID(data, success, failure) {
		let articleExists = typeof _list[data.id] === 'object';
		if(articleExists) {
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