const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Articles = require('../db/articles');
const To = require('../To');

router.use((req, res, next) => {
	if(String(req.headers.version) !== '1.0') {
		res.json({ "error": "bad headers" });
	}else{
		next();
	}
});

router.get('/', (req, res) => {
	res.render("articles", { "allArticles": true, "article": Articles.all() });
});

router.get('/new', (req, res) => {
	res.render("articles", { "newArticle": true, "article": { "err": false } });
});

router.get('/new/err', (req, res) => {
	res.render("articles", { "newArticle": true, "article": { "err": true } });
});

router.get('/:id', (req, res) => {
	let urlID = req.params.id;
	let articleData = Articles.getByID(urlID);
	res.render("articles", { "oneArticle": true, "article": articleData });
});

router.get('/:id/edit', (req, res) => {
	res.render("articles", { "editArticle": true, "article": Articles.getByID(req.params.id) });
});

router.post('/', (req, res) => {
	function success(article) {
		res.render("articles", { "allArticles": true, "article": article });
	}
	function failure() {
		res.redirect(303, `/articles/new/err`);
	}
	Articles.add(req.body, success, failure);
});

router.put('/:id', (req, res) => {
	for(key in req.body) {
		if(req.body[key] === "") {
			req.body[key] = undefined;
		}
	}
	function success(data) {
		let articleData = Articles.getByID(data.title);
		res.render("articles", { "oneArticle": true, "article": articleData });
	}
	function failure(data) {
		let articleData = To.cloneObj(data);
		articleData.err = true;
		res.render("articles", { "editArticle": true, "article": articleData });
	}
	Articles.editByID(req.body, success, failure);
});

router.delete('/:id', (req, res) => {
	function success() {
		res.redirect(303, `/articles`);
	}
	function failure() {
		res.redirect(303, `/article/${req.body.urlTitle}`);
	}
	Articles.deleteByID(req.body, success, failure);
});

module.exports = router;