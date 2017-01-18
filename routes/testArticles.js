const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Articles = require('../db/articles');
const To = require('../To');

router.get('/', (req, res) => {
	let articleListData = Articles.all();
	res.json({ "success": true, "article list": articleListData });
});

router.get('/:id', (req, res) => {
	let articleData = Articles.getByID(req.params.id);
	res.json({ "success": true, "article": articleData });
});

router.post('/', (req, res) => {
	function success(newArticle) {
		res.json({ "success": true, "new article": newArticle });
	}
	function failure() {
		res.json({ "success": false });
	}
	Articles.add(req.body, success, failure);
});

router.put('/:id', (req, res) => {
	function success() {
		res.json({ "success": true, "edited article": Articles.getByID(req.params.id) });
	}
	function failure() {
		res.json({ "success": false });
	}
	Articles.editByID(To.strToUrl(req.body.urlTitle), success, failure);
});

router.delete('/:id', (req, res) => {
	function success() {
		res.json({ "success": true, "new article list": Articles.all() });
	}
	function failure() {
		res.json({ "success": false });
	}
	Articles.deleteByID(req.body, success, failure);
});

module.exports = router;