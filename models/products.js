const pgp =  require('pg-promise')();
const PG_PASS = process.env.PG_PASS;
const db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'articles_products_express',
	user: 'articles_products_user',
	password: PG_PASS
});

function all() {
	return db.any('SELECT * FROM "products"');
}

function getByID(id) {
	return db.one(`SELECT * FROM "products" WHERE id = ${id}`);
}

module.exports = { all, getByID };