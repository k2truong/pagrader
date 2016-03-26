import { expect } from 'chai';
import { create as createRepo } from '../actions/repo';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Repo from '../models/repo';

describe('createRepo', () => {
  before((done) => {
    mongoose.connect(secrets.db, (dbErr) => {
      if (dbErr) {
        console.log('MongoDB ERROR: Could not connect to ' + secrets.db);
        console.log(dbErr);
      } else {
        console.log('==> 💻  Mongoose connected to ' + secrets.db);

        for (const collection in mongoose.connection.collections) {
          if (mongoose.connection.collections[collection]) {
            mongoose.connection.collections[collection].remove(() => {});
          }
        }
      }
      done();
    });
  });

  const mockRepo = {
    description: 'CSE5 Winter 2015'
  };
  it('should create repo', (done) => {
    createRepo({
      body: mockRepo
    }).then((res) => {
      expect(res.username).to.equal(mockRepo.username);
      expect(res.description).to.be.equal(mockRepo.description);

      Repo.findOne({ username: mockRepo.username }, (err, repo) => {
        expect(repo.username).to.be.equal(mockRepo.username);
        expect(repo.description).to.be.equal(mockRepo.description);
        done();
      });
    }, (err) => {
      expect(err.message).to.not.be.a('null');
      done();
    });
  });

  it('should give error for duplicate repo', (done) => {
    createRepo({
      body: mockRepo
    }).then((res) => {
      expect(res).to.be.a('null');
      done();
    }, (err) => {
      expect(err.message).to.not.be.a('null');
      done();
    });
  });

  // TODO: Need to mock SSH for tests
  // it('should give list of repo', (done) => {
  //   loadRepos().then((res) => {
  //     expect(res.length).to.equal(1);
  //     expect(res[0].username).to.equal(mockRepo.username);
  //     expect(res[0].description).to.equal(mockRepo.description);
  //     done();
  //   });
  // });
});
