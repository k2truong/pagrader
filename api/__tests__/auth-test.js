import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import User from '../models/user';

const api = supertest('http://localhost:3030');

describe('Passport: routes', () => {
  let runnable;

  before((done) => {
    require('../api').then((res) => {
      runnable = res;

      for (const collection in mongoose.connection.collections) {
        if (mongoose.connection.collections[collection]) {
          mongoose.connection.collections[collection].remove(() => {});
        }
      }

      done();
    });
  });

  after((done) => {
    runnable.close(done);
  });

  const userInfo = {
    username: 'test1',
    password: 'test'
  };

  it('should be able to signup a user', (done) => {
    api.post('/signup')
      .send(userInfo)
      .expect(200)
      .end((err, res) => {
        expect(err).to.be.a('null');
        expect(res.body.username).equal(userInfo.username);
        expect(res.body.password).not.equal(userInfo.password);

        User.findOne({ 'username': userInfo.username }, (dbErr, user) => {
          expect(dbErr).to.be.a('null');
          expect(res.body.username).equal(user.username);
          expect(res.body.password).equal(user.password);
          done();
        });
      });
  });

  it('should prevent adding duplicate user', (done) => {
    api.post('/signup')
      .send(userInfo)
      .expect(403)
      .end((err, res) => {
        expect(err).to.be.a('null');
        expect(res.body.message).to.not.be.a('null');
        done();
      });
  });

  it('should be able to login', (done) => {
    api.post('/login')
      .send(userInfo)
      .expect(200)
      .end((err, res) => {
        expect(err).to.be.an('null');
        expect(res.body.username).equal(userInfo.username);
        done();
      });
  });

  it('should not be able to login', (done) => {
    api.post('/login')
      .send({
        username: 'test1',
        password: 'wrongpassword'
      })
      .expect(403)
      .end((err, res) => {
        expect(err).to.be.an('null');
        expect(res.body.message).to.not.be.a('null');
        done();
      });
  });
});
