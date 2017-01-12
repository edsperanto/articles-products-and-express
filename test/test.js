const chai = require('chai');
const should = chai.should();
const supertest = require('supertest');

describe('sanity', () => {
	it('should be true', () => {
		true.should.equal(true);
	});
});