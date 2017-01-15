const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Articles = require('../db/articles');
const To = require('../To');

router.get('/', (req, res) => {
	res.render("articles", { "allArticles": true, "article": Articles.all() });
});

router.get('/test', (req, res) => {
	let articleListData = Articles.all();
	res.json({ "success": true, "article list": articleListData });
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

router.get('/:id/test', (req, res) => {
	let articleData = Articles.getByID(req.params.id);
	res.json({ "success": true, "article": articleData });
});

router.get('/:id/edit', (req, res) => {
	res.render("article", { "editArticle": true, "article": Articles.getByID(req.params.id) });
});

router.post('/', (req, res) => {
	function success() {
		console.log("SUCCESS!!!!");
		res.render("articles", { "allArticles": true, "article": Articles.all() });
	}
	function failure() {
		res.redirect(303, `/article/new/err`);
	}
	Articles.add(req.body, success, failure);
});

router.post('/test', (req, res) => {
	function success(newArticle) {
		res.json({ "success": true, "new article": newArticle });
	}
	function failure() {
		res.json({ "success": false });
	}
	Articles.add(req.body, success, failure);
});

router.put('/:id', (req, res) => {
	for(key in req.body) {
		if(req.body[key] === "") {
			req.body[key] = undefined;
		}
	}
	function success() {
		let urlID = req.params.id;
		let articleData = Articles.getByID(urlID);
		res.render("articles", { "oneArticle": true, "article": articleData });
	}
	function failure() {
		let articleData = Articles.getByID(req.params.id);
		articleData.err = true;
		res.render("articles", { "editArticle": true, "article": articleData });
	}
	Articles.editByID(req.body, success, failure);
});

router.put('/:id/test', (req, res) => {
	function success() {
		res.json({ "success": true, "edited article": Articles.getByID(req.params.id) });
	}
	function failure() {
		res.json({ "success": false });
	}
	Articles.editByID(req.body, success, failure);
});

router.delete('/:id', (req, res) => {
	function success() {
		res.redirect(303, `/articles`);
	}
	function failure() {
		res.redirect(303, `/article/${req.body.id}`);
	}
	Articles.deleteByID(req.body, success, failure);
});

router.delete('/:id/test', (req, res) => {
	function success() {
		res.json({ "success": true, "new article list": Articles.all() });
	}
	function failure() {
		res.json({ "success": false });
	}
	Articles.deleteByID(req.body, success, failure);
});

module.exports = router;