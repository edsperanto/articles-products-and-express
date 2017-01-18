const chai = require('chai');
const should = chai.should();
const To = require('../To');
const server = require('../server');
const supertest = require('supertest');
const agent = supertest.agent(server);

let my = {
	product: {
		incomplete: {
			"name": "sushi"
		},
		invalidPrice: {
			"name": "pencil",
			"price": "Dixon Ticonderoga",
			"inventory": "none"
		},
		lemonade: {
			"name": "lemonade",
			"price": "$1.25",
			"inventory": "100"
		},
		newLemonade: {
			"id": "",
			"price": "$3.5",
			"inventory": "10"
		}
	},
	article: {
		incomplete: {
			"title": "Trump again"
		},
		invalidTitle: {
			"title": "Stop the moochers!",
			"author": "Ayn Rand",
			"body": "The virtue of selfishness"
		},
		Obama: {
			"title": "Obama gift certification found",
			"author": "CNN Fake News",
			"body": "He was born in Kenya (confirmed)"
		},
		newObama: {
			"urlTitle": "",
			"title": "Obama gift certification lost",
			"author": "Fox Real News",
			"body": "Obama destroys evidence of treason by burning birth certificate"
		}
	}
};

function reset() {
	agent.get('/api/products/reset');
	agent.get('/api/articles/reset');
}

describe('Products API', () => {

	describe('GET /api/products', () => {
		it('should be successful', done => {
			agent.get('/api/products')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let productList;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('product list');
					if(res.body['product list'] !== undefined) {
						productList = res.body['product list'];
						productList.should.be.a('Object');
						productList.should.have.property('empty');
						productList.empty.should.have.property('name');
						productList.empty.should.have.property('notEmpty');
						productList.empty.name.should.equal('Product List is Empty');
						productList.empty.notEmpty.should.be.false;
					}
					done();
				});
		});
	});

	describe('POST /api/products', () => {
		it('should prevent empty requests', done => {
			agent.post('/api/products')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent incomplete requests', done => {
			let incomplete = my.product.incomplete;
			agent.post('/api/products')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(incomplete)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent invalid price requests', done => {
			let invalidPrice = my.product.invalidPrice;
			agent.post('/api/products')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(invalidPrice)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should fulfill valid requests and create new product', done => {
			let lemonade = my.product.lemonade;
			agent.post('/api/products')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(lemonade)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let newProduct;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('new product');
					if(res.body['new product'] !== undefined) {
						newProduct = res.body['new product'];
						newProduct.should.be.a('Object');
						newProduct.should.have.property('id');
						newProduct.should.have.property('name');
						newProduct.should.have.property('price');
						newProduct.should.have.property('inventory');
						newProduct.should.have.property('notEmpty');
						newProduct.name.should.equal(lemonade.name);
						newProduct.price.should.equal(lemonade.price);
						newProduct.inventory.should.equal(lemonade.inventory);
						newProduct.notEmpty.should.be.true;
						my.product.newLemonade.id = newProduct.id;
					}
					done();
				});
		});
	});

	describe('PUT /api/products/:id', () => {
		it('should allow empty requests', done => {
			let lemonade = my.product.lemonade;
			let lemonadeID = my.product.newLemonade.id;
			agent.put(`/api/products/${lemonadeID}`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send({ "id": lemonadeID })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let editedProduct;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('edited product');
					if(res.body['edited product'] !== undefined) {
						editedProduct = res.body['edited product'];
						editedProduct.should.be.a('Object');
						editedProduct.should.have.property('id');
						editedProduct.should.have.property('name');
						editedProduct.should.have.property('price');
						editedProduct.should.have.property('inventory');
						editedProduct.should.have.property('notEmpty');
						editedProduct.name.should.equal(lemonade.name);
						editedProduct.price.should.equal(lemonade.price);
						editedProduct.inventory.should.equal(lemonade.inventory);
						editedProduct.notEmpty.should.be.true;
					}
					done();
				});
		});
		it('should allow incomplete requests', done => {
			let lemonadeID = my.product.newLemonade.id;
			let incomplete = my.product.incomplete;
			incomplete.id = lemonadeID;
			agent.put(`/api/products/${lemonadeID}`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(incomplete)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.true;
					res.body.should.have.property('edited product');
					res.body['edited product'].name.should.equal(incomplete.name);
					done();
				});
		});
		it('should prevent non-existent product requests', done => {
			agent.put(`/api/products/whatevers`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send({ "id": "123456" })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent invalid price requests', done => {
			let lemonadeID = my.product.newLemonade.id;
			let invalidPrice = my.product.invalidPrice;
			agent.put(`/api/products/${lemonadeID}`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(invalidPrice)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should fulfill valid requests and update old product', done => {
			let newLemonade = my.product.newLemonade;
			agent.put(`/api/products/${newLemonade.id}`)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(newLemonade)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let editProduct;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('edited product');
					if(res.body['new product'] !== undefined) {
						editProduct = res.body['edited product'];
						editProduct.should.be.a('Object');
						editProduct.should.have.property('id');
						editProduct.should.have.property('name');
						editProduct.should.have.property('price');
						editProduct.should.have.property('inventory');
						editProduct.name.should.equal(newLemonade.name);
						editProduct.price.should.equal(newLemonade.price);
						editProduct.inventory.should.equal(newLemonade.inventory);
					}
					done();
				});
		});
	});

	describe('DELETE /api/products/:id', () => {
		it('should prevent invalid IDs', done => {
			let invalidID = my.product.newLemonade.id + 1;
			agent.delete(`/api/products/${invalidID}`)
				.send({ "id": invalidID })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent different IDs in URI and body', done => {
			let invalidID = my.product.newLemonade.id + 1;
			let lemonadeID = my.product.newLemonade.id;
			agent.delete(`/api/products/${invalidID}`)
				.send({ "id": lemonadeID })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent non-existent product requests', done => {
			agent.delete(`/api/products/123456`)
				.send({ "id": "123456" })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should fulfill valid requests and delete product', done => {
			let lemonadeID = my.product.newLemonade.id;
			agent.delete(`/api/products/${lemonadeID}`)
				.send({ "id": lemonadeID })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.should.have.property('new product list');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					done();
				});
		});
		it('should allow product ID as string in json', done => {
			let lemonade = my.product.lemonade;
			let lemonadeID;
			agent.post('/api/products')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(lemonade)
				.end((err, res) => {
					if(err) throw err;
					lemonadeID = res.body['new product'].id;
					done();
				});
			agent.delete(`/api/products/${lemonadeID}`)
				.send({ "id": `"${lemonadeID}"` })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.should.have.property('new product list');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					done();
				});
		});
	});

});

describe('Articles API', () => {

	describe('GET /api/articles', () => {
		it('should be successful', done => {
			agent.get('/api/articles')
				.set('version', '1.0')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let articleList;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('article list');
					if(res.body['article list'] !== undefined) {
						articleList = res.body['article list'];
						articleList.should.be.a('Object');
						articleList.should.have.property('empty');
						articleList.empty.should.have.property('title');
						articleList.empty.should.have.property('notEmpty');
						articleList.empty.title.should.equal('Article List is Empty');
						articleList.empty.notEmpty.should.be.false;
					}
					done();
				});
		});
	});

	describe('POST /api/articles', () => {
		it('should prevent empty requests', done => {
			agent.post('/api/articles')
				.set('version', '1.0')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent incomplete requests', done => {
			let incomplete = my.article.incomplete;
			agent.post('/api/articles')
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(incomplete)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent invalid price requests', done => {
			let invalidTitle = my.article.invalidTitle;
			agent.post('/api/articles')
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(invalidTitle)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should fulfill valid requests and create new product', done => {
			let Obama = my.article.Obama;
			agent.post('/api/articles')
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(Obama)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let newArticle;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('new article');
					if(res.body['new article'] !== undefined) {
						newArticle = res.body['new article'][Obama.title];
						newArticle.should.be.a('Object');
						newArticle.should.have.property('title');
						newArticle.should.have.property('author');
						newArticle.should.have.property('body');
						newArticle.should.have.property('urlTitle');
						newArticle.should.have.property('id');
						newArticle.should.have.property('notEmpty');
						newArticle.title.should.equal(Obama.title);
						newArticle.author.should.equal(Obama.author);
						newArticle.body.should.equal(Obama.body);
						newArticle.urlTitle.should.equal(To.strToUrl(Obama.title));
						my.article.newObama.urlTitle = newArticle.urlTitle;
						my.article.newObama.id = newArticle.id;
					}
					done();
				});
		});
	});

	describe('PUT /api/articles/:id', () => {
		it('should allow empty requests', done => {
			let newObamaUrl = my.article.newObama.urlTitle;
			agent.put(`/api/articles/${newObamaUrl}`)
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send({ "urlTitle": newObamaUrl })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.true;
					done();
				});
		});
		it('should allow incomplete requests', done => {
			let Obama = my.article.Obama;
			let newObamaUrl = my.article.newObama.urlTitle;
			let incomplete = my.article.incomplete;
			incomplete.urlTitle = newObamaUrl;
			agent.put(`/api/articles/${newObamaUrl}`)
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(incomplete)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let editArticle;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('edited article');
					if(res.body['edited article'] !== undefined) {
						editArticle = res.body['edited article'];
						editArticle.should.be.a('Object');
						editArticle.should.have.property('title');
						editArticle.should.have.property('author');
						editArticle.should.have.property('body');
						editArticle.should.have.property('urlTitle');
						editArticle.should.have.property('id');
						editArticle.should.have.property('notEmpty');
						editArticle.title.should.equal(incomplete.title);
						editArticle.author.should.equal(Obama.author);
						editArticle.body.should.equal(Obama.body);
						editArticle.urlTitle.should.equal(To.strToUrl(incomplete.title));
						my.article.newObama.urlTitle = editArticle.urlTitle;
					}
					done();
				});
		});
		it('should prevent non-existent article requests', done => {
			agent.put(`/api/articles/whatevers`)
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send({ "urlTitle": "mygoshlolwow" })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent invalid title requests', done => {
			let newObamaUrl = my.article.newObama.urlTitle;
			let invalidTitle = my.article.invalidTitle;
			invalidTitle.urlTitle = newObamaUrl;
			agent.put(`/api/articles/${newObamaUrl}`)
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(invalidTitle)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should fulfill valid requests and update old product', done => {
			let newObama = my.article.newObama;
			agent.put(`/api/articles/${newObama.urlTitle}`)
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(newObama)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let editArticle;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('edited article');
					if(res.body['edited article'] !== undefined) {
						editArticle = res.body['edited article'];
						editArticle.should.be.a('Object');
						editArticle.should.have.property('title');
						editArticle.should.have.property('author');
						editArticle.should.have.property('body');
						editArticle.should.have.property('urlTitle');
						editArticle.title.should.equal(newObama.title);
						editArticle.author.should.equal(newObama.author);
						editArticle.body.should.equal(newObama.body);
						editArticle.urlTitle.should.equal(To.strToUrl(newObama.title));
					}
					done();
				});
		});
	});

	describe('DELETE /api/products/:id', () => {
		it('should prevent invalid IDs', done => {
			let invalidID = my.product.newLemonade.id + 1;
			agent.delete(`/api/products/${invalidID}`)
				.set('version', '1.0')
				.send({ "id": invalidID })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent different IDs in URI and body', done => {
			let invalidID = my.product.newLemonade.id + 1;
			let lemonadeID = my.product.newLemonade.id;
			agent.delete(`/api/products/${invalidID}`)
				.set('version', '1.0')
				.send({ "id": lemonadeID })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should prevent non-existent product requests', done => {
			agent.delete(`/api/products/123456`)
				.set('version', '1.0')
				.send({ "id": "123456" })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.false;
					done();
				});
		});
		it('should fulfill valid requests and delete product', done => {
			let lemonadeID = my.product.newLemonade.id;
			agent.delete(`/api/products/${lemonadeID}`)
				.set('version', '1.0')
				.send({ "id": lemonadeID })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.should.have.property('new product list');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					done();
				});
		});
		it('should allow product ID as string in json', done => {
			let lemonade = my.product.lemonade;
			let lemonadeID;
			agent.post('/api/products')
				.set('version', '1.0')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.send(lemonade)
				.end((err, res) => {
					if(err) throw err;
					lemonadeID = res.body['new product'].id;
					done();
				});
			agent.delete(`/api/products/${lemonadeID}`)
				.set('version', '1.0')
				.send({ "id": `"${lemonadeID}"` })
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.should.have.property('new product list');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					done();
				});
		});
	});

});