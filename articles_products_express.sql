\c Edward;
DROP USER IF EXISTS articles_products_user;
DROP DATABASE IF EXISTS articles_products_express;
CREATE DATABASE articles_products_express;
CREATE USER articles_products_user WITH ENCRYPTED PASSWORD 'password';

\c articles_products_express;

CREATE TABLE "products" (
	id SERIAL NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	price INTEGER NOT NULL,
	inventory TEXT NOT NULL,
	notEmpty BOOLEAN NOT NULL DEFAULT true
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO articles_products_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO articles_products_user;