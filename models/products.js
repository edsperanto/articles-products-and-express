const To = require('../helpers/To');
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
		return db.many('SELECT * FROM "products"')
			.then(productsList => {
				let outputObj = {};
				productsList.forEach(product => {
					outputObj[product.id] = product;
					outputObj[product.id]['notEmpty'] = true;
				});
				return outputObj;
			});
	}

	function _getByID(id) {
		return db.one(`SELECT * FROM "products" WHERE id = ${id}`)
			.then(productData => {
				productData.notEmpty = true;
				return productData;
			});
	}

	function _add(data) {
		let price = To.moneyToNum(data.price);
		return db.none(`INSERT INTO "products" (name, price, inventory) VALUES ('${data.name}', ${price}, '${data.inventory}');`);
	}

	function _updateProduct(data) {

	}

	return { 
		all: _all, 
		getByID: _getByID,
		add: _add,
		updateProduct: _updateProduct
	};
})();