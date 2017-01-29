\c Edward;
DROP USER IF EXISTS articles_products_user;
DROP DATABASE IF EXISTS articles_products_express;
CREATE USER articles_products_user WITH ENCRYPTED PASSWORD 'password';
CREATE DATABASE articles_products_express;

\c articles_products_express;

DROP TABLE IF EXISTS "products";
CREATE TABLE "products" (
	id SERIAL NOT NULL PRIMARY KEY,a
	name TEXT NOT NULL,
	price INTEGER NOT NULL,
	inventory TEXT NOT NULL
);

DROP TABLE IF EXISTS "articles";
CREATE TABLE "articles" (
	urlTitle TEXT NOT NULL PRIMARY KEY,
	title TEXT NOT NULL,
	author TEXT NOT NULL,
	body TEXT NOT NULL
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO articles_products_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO articles_products_user;