const chai = require('chai');
const should = chai.should();
const server = require('../server');
const supertest = require('supertest');
const agent = supertest.agent(server);

let my = {
	product: {
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
	}
};

function reset() {
	agent.get('/api/products/reset');
	agent.get('/api/articles/reset');
}

describe('sanity', () => {
	it('should be true', () => {
		true.should.be.true;
	});
});

describe('Products API', () => {

	describe('GET /api/products', () => {
		it('should be successful', done => {
			agent.get('/api/products')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					let newProduct;
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					res.body.success.should.be.true;
					res.body.should.have.property('product list');
					if(res.body['new product'] !== undefined) {
						newProduct = res.body['new product'];
						newProduct.should.be.a('Object');
						newProduct.should.have.property('empty');
						newProduct.empty.should.have.property('name');
						newProduct.empty.should.have.property('notEmpty');
						newProduct.empty.name.should.equal('Product List is Empty');
						newProduct.empty.notEmpty.should.be.false;
					}
					done();
				});
		});
	});

	describe('POST /api/products', () => {
		it('should generate new product', done => {
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
						newProduct.name.should.equal(lemonade.name);
						newProduct.price.should.equal(lemonade.price);
						newProduct.inventory.should.equal(lemonade.inventory);
						my.product.newLemonade.id = newProduct.id;
					}
					done();
				});
		});
	});

	describe('PUT /api/products', () => {
		it('should update old product', done => {
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

});