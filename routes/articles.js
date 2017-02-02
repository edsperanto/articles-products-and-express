const express = require('express');
const router = express.Router();
const To = require('../helpers/To');
const articleModel = require('../models/articles');

router.get('/', (req, res) => {
	articleModel.all()
		.then(articlesList => {
			console.log("showing again", articlesList);
			res.render("articles", { "allArticles": true, "article": articlesList });
		})
		.catch(error => {
			res.render("articles", { "allArticles": true, "article": {"empty": { 'title': 'Article list is empty', 'notEmpty': false }} });
		});
});

router.get('/new', (req, res) => {
	res.render("articles", { "newArticle": true, "article": { "err": false } });
});

router.get('/new/err', (req, res) => {
	res.render("articles", { "newArticle": true, "article": { "err": true } });
});

router.get('/:id', (req, res) => {
	articleModel.getByID(req.params.id)
		.then(articleData => {
			res.render("articles", { "oneArticle": true, "article": articleData });
		})
		.catch(err => {
			res.render("articles", { "oneArticle": true, "article": {"id": "empty", "title": "Article Does Not Exist"} });
		});
});

router.get('/:id/edit', (req, res) => {
	articleModel.getByID(req.params.id)
		.then(articleData => {
			res.render("articles", { "editArticle": true, "article": articleData });
		})
		.catch(err => {
			res.render("articles", { "oneArticle": true, "article": {"id": "empty", "name": "Article Does Not Exist"} });
		});
});

router.post('/', (req, res) => {
	articleModel.add(req.body)
		.then(_ => {
			articleModel.all()
				.then(articlesList => {
					res.render("articles", { "allArticles": true, "article": articlesList });
				});
		})
		.catch(err => {
			res.redirect(303, `/articles/new/err`);
		});
});

router.put('/:id', (req, res) => {
	articleModel.editByID(req.body, (status, articleData) => {
		if(status === 'success') {
			console.log('EDIT SUCCESS');
			res.render("articles", { "oneArticle": true, "article": articleData });
		}else{
			console.log('EDIT FAIL');
			res.render("articles", { "editArticle": true, "article": articleData });
		}
	});
});

router.delete('/:id', (req, res) => {
	articleModel.deleteByID(req.body)
		.then(_ => {
			res.redirect(303, `/articles`);
		})
		.catch(_ => {
			res.redirect(303, `/articles/${req.body.id}`);
		});
});

module.exports = router;