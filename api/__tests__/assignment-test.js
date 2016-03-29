import { expect } from 'chai';
import { create as createAssignment } from '../actions/assignment';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Assignment from '../models/assignment';

describe('createAssignment', () => {
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
    // Clean up after finished with tests
    for (const collection in mongoose.connection.collections) {
      if (mongoose.connection.collections[collection]) {
        mongoose.connection.collections[collection].remove(() => {});
      }
    }

    mongoose.disconnect();
    done();
  });

  const mockAssignment = {
    repoId: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'), // eslint-disable-line new-cap
    input: '1\n2\n',
    name: 'PA1',
    path: '/cs5w9/GRADER/PA1',
    bonusDate: new Date('1/24/1991')
  };
  it('should create assignment', (done) => {
    return createAssignment({
      body: mockAssignment
    }).then((res) => {
      expect(res.repo).deep.equal(mockAssignment.repoId);
      expect(res.input).equal(mockAssignment.input);
      expect(res.name).equal(mockAssignment.name);
      expect(res.path).equal(mockAssignment.path);
      expect(res.bonusDate).deep.equal(mockAssignment.bonusDate);

      return Assignment.findOne({
        repo: mockAssignment.repoId,
        name: mockAssignment.name
      }, (err, assignment) => {
        expect(assignment.repo).deep.equal(mockAssignment.repoId);
        expect(assignment.input).equal(mockAssignment.input);
        expect(assignment.name).equal(mockAssignment.name);
        expect(assignment.path).equal(mockAssignment.path);
        expect(assignment.bonusDate).deep.equal(mockAssignment.bonusDate);
        done();
      });
    }).catch(done);
  });

  it('should give error for duplicate name', (done) => {
    return createAssignment({
      body: mockAssignment
    }).then(() => {
      done('Did not throw duplicate error');
    }).catch((err) => {
      if (err) {
        done();
      } else {
        done('No error given for duplicate error');
      }
    });
  });
});
