const chai = require('chai');
const should = chai.should();
const server = require('../server');
const supertest = require('supertest');
const agent = supertest.agent(server);

agent.get('/api/products/reset');
agent.get('/api/articles/reset');

describe('sanity', () => {
	it('should be true', () => {
		true.should.be.true;
	});
});

describe('Products API', () => {
	describe('GET /api/products', () => {
		it('should return empty list', done => {
			agent.get('/api/products')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if(err) throw err;
					res.body.should.have.property('success');
					res.body.success.should.be.a('Boolean');
					done();
				});
		});
	});
});