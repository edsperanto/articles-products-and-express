const pgp =  require('pg-promise')();
const PG_PASS = process.env.PG_PASS;
const db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'articles_products_express',
	user: 'articles_products_user',
	password: PG_PASS
});

module.exports = (function() {
	function _all() {
		return db.many('SELECT * FROM "products"');
	}

	function _getByID(id) {
		return db.one(`SELECT * FROM "products" WHERE id = ${id}`);
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
	return { 
		all: _all, 
		getByID: _getByID,
		updateProduct: _updateProduct
	};
})();