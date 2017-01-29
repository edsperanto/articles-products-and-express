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
		return db.many('SELECT * FROM "articles";')
			.then(articlesList => {
				console.log("showing", articlesList);
				let outputObj = {};
				articlesList.forEach(article => {
					outputObj[article.title] = article;
					outputObj[article.title]['notEmpty'] = true;
				});
				return outputObj;
			});
	}

	function _getByID(id) {
		return db.one(`SELECT * FROM "articles" WHERE urltitle = ${id};`)
			.then(articleData => {
				articleData.notEmpty = true;
				return articleData;
			});
	}

	function _add(data) {
		let price = To.moneyToNum(data.price);
		return db.none(`INSERT INTO "articles" (name, price, inventory) VALUES ('${data.name}', ${price}, '${data.inventory}');`);
	}

	function _editArticleHasValidFormat(data) {
		let noName = data.name === undefined;
		let noPrice = data.price === undefined;
		let noInventory = data.inventory === undefined;
		let nameIsStr = typeof data.name === 'string';
		let priceIsNum = typeof To.moneyToNum(data.price) === 'number';
		let inventoryIsStr = typeof data.inventory === 'string';
		return (noName || nameIsStr)
			&& (noPrice || priceIsNum)
			&& (noInventory || inventoryIsStr);
	}

	function _updateArticle(data, callback) {
		let id = data.id;
		_all()
			.then(_ => {
				if(data.name !== undefined) {
					return db.none(`UPDATE "articles" SET name = '${data.name}' WHERE id = ${id};`);
				}
			})
			.then(_ => {
				if(data.price !== undefined) {
					return db.none(`UPDATE "articles" SET price = ${data.price} WHERE id = ${id};`);
				}
			})
			.then(_ => {
				if(data.inventory !== undefined) {
					return db.none(`UPDATE "articles" SET inventory = '${data.inventory}' WHERE id = ${id};`);
				}
			})
			.then(_ => {
				callback();
			});
	}

	function _editByID(data, callback) {
		for(key in data) {
			if(data[key] === "") {
				data[key] = undefined;
			}
		}
		if(_editArticleHasValidFormat(data)) {
			_updateArticle(data, _ => {
				_getByID(data.id)
					.then(articleData => {
						callback('success', articleData);
					});
			});
		}else{
			_getByID(data.id)
				.then(articleData => {
					callback('fail', articleData);
				});
		}
	}

	function _deleteByID(data) {
		return db.none(`DELETE FROM "articles" WHERE id = ${data.id}`);
	}

	return { 
		all: _all, 
		getByID: _getByID,
		add: _add,
		editByID: _editByID,
		deleteByID: _deleteByID
	};
})();