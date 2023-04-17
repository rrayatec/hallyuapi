const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

const app = require('../app');

chai.use(chaiHttp);

describe('Artists - Happy Path Tests', () => {
  describe('GET /api/v1/artists', () => {
    it('GET All Artists', (done) => {
      chai
        .request(app)
        .get('/api/v1/artists')
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.status, 'success');
          assert.equal(res.body.count, 1428);
          assert.equal(res.body.results.length, res.body.count);
          done();
        });
    });
  });

  describe('GET /api/v1/artists/:id', () => {
    it('GET specific artist by id', (done) => {
      chai
        .request(app)
        .get('/api/v1/artists/526')
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.status, 'success');
          assert.equal(res.body.results.Id, 526);
          assert.equal(res.body.results.FullName, 'Im Jaebum');
          done();
        });
    });
  });

  describe('GET /api/v1/artists?q=', () => {
    it('GET artists by search (Eng characters)', (done) => {
      chai
        .request(app)
        .get('/api/v1/artists?q=Im Jaebum')
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.status, 'success');
          assert.equal(res.body.count, 1);
          assert.equal(res.body.results[0].Id, 526);
          assert.equal(res.body.results[0].FullName, 'Im Jaebum');
          done();
        });
    });
  });

  describe('GET /api/v1/artists?q=', () => {
    it('GET artist by search (KR characters)', (done) => {
      const uri = encodeURI('/api/v1/artists?q=%EC%9E%84%EC%9E%AC%EB%B2%94');
      chai
        .request(app)
        .get(uri)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.status, 'success');
          assert.equal(res.body.count, 1);
          assert.equal(res.body.results[0].Id, 526);
          assert.equal(res.body.results[0].FullName, 'Im Jaebum');
          done();
        });
    });
  });
});

describe('Artists - Unhappy Path Tests', () => {
  describe('GET /api/v1/artists/:id', () => {
    it('GET Artists Id out of range', (done) => {
      chai
        .request(app)
        .get('/api/v1/artists/1429')
        .end((err, res) => {
          assert.equal(res.statusCode, 404);
          done();
        });
    });
  });

  describe('GET /api/v1/artists', () => {
    it('GET Artists search criteria not met', (done) => {
      chai
        .request(app)
        .get('/api/v1/artists?q=blah')
        .end((err, res) => {
          assert.equal(res.statusCode, 404);
          done();
        });
    });
  });
});
