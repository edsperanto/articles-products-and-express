const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Articles = require('../db/articles');
const To = require('../To');

router.use((req, res, next) => {
	res.append('version', '1.0');
	if(String(req.headers.version) !== '1.0') {
		res.json({ "error": "bad headers" });
	}else{
		next();
	}
});

router.get('/', (req, res) => {
	res.json({ "success": true, "article list": Articles.all() });
});

router.get('/reset', (req, res) => {
	Articles.reset();
	res.json({ "success": true, "article list": Articles.all() });
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
	for(key in req.body) {
		if(req.body[key] === "") {
			req.body[key] = undefined;
		}
	}
	function success(data) {
		res.json({ "success": true, "edited article": Articles.getByID(data.title) });
	}
	function failure() {
		res.json({ "success": false });
	}
	Articles.editByID(req.body, success, failure);
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