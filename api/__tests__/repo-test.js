import { expect } from 'chai';
import { create as createRepo } from '../actions/repo';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Repo from '../models/repo';

describe('createRepo', () => {
  before((done) => {
    mongoose.connect(secrets.db, (dbErr) => {
      if (dbErr) {
        console.log(dbErr);
      } else {
        for (const collection in mongoose.connection.collections) {
          if (mongoose.connection.collections[collection]) {
            mongoose.connection.collections[collection].remove(() => {});
          }
        }
      }
      done();
    });
  });

  after((done) => {
    mongoose.disconnect();
    done();
  });

  const mockRepo = {
    description: 'CSE5 Winter 2015'
  };
  it('should create repo', (done) => {
    createRepo({
      body: mockRepo
    }).then((res) => {
      expect(res.username).equal(mockRepo.username);
      expect(res.description).equal(mockRepo.description);

      Repo.findOne({ username: mockRepo.username }, (err, repo) => {
        expect(repo.username).equal(mockRepo.username);
        expect(repo.description).equal(mockRepo.description);
        done();
      });
    }).catch((err) => {
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
    }).catch((err) => {
      expect(err.message).to.not.be.a('null');
      done();
    });
  });

  // TODO: Need to mock SSH for tests
  // it('should give list of repo', (done) => {
  //   loadRepos().then((res) => {
  //     expect(res.length).equal(1);
  //     expect(res[0].username).equal(mockRepo.username);
  //     expect(res[0].description).equal(mockRepo.description);
  //     done();
  //   });
  // });
});
