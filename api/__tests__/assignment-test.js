import { expect } from 'chai';
import { create, update } from '../actions/assignment';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Assignment from '../models/assignment';

describe('Assignment API', () => {
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

  const MOCK_ASSIGNMENT = {
    repoId: mongoose.Types.ObjectId('000000000000000000000000'), // eslint-disable-line new-cap
    input: '1\n2\n',
    name: 'PA1',
    path: '/cs5w9/GRADER/PA1',
    bonusDate: new Date('1/24/1991')
  };
  it('should create assignment', (done) => {
    create({
      body: MOCK_ASSIGNMENT
    }).then((res) => {
      expect(res.repo).deep.equal(MOCK_ASSIGNMENT.repoId);
      expect(res.input).equal(MOCK_ASSIGNMENT.input);
      expect(res.name).equal(MOCK_ASSIGNMENT.name);
      expect(res.path).equal(MOCK_ASSIGNMENT.path);
      expect(res.bonusDate).deep.equal(MOCK_ASSIGNMENT.bonusDate);

      Assignment.findOne({
        repo: MOCK_ASSIGNMENT.repoId,
        name: MOCK_ASSIGNMENT.name
      }, (err, assignment) => {
        expect(assignment.repo).deep.equal(MOCK_ASSIGNMENT.repoId);
        expect(assignment.input).equal(MOCK_ASSIGNMENT.input);
        expect(assignment.name).equal(MOCK_ASSIGNMENT.name);
        expect(assignment.path).equal(MOCK_ASSIGNMENT.path);
        expect(assignment.bonusDate).deep.equal(MOCK_ASSIGNMENT.bonusDate);
        done();
      });
    }).catch(done);
  });

  it('should give error for duplicate name', (done) => {
    create({
      body: MOCK_ASSIGNMENT
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

  const NEW_INPUT = 'new input';
  it('should update assignment', (done) => {
    Assignment.findOne({
      name: MOCK_ASSIGNMENT.name
    }, (err, assignment) => {
      if (err) {
        done(err);
      }

      update({
        body: {
          assignmentId: assignment._id,
          input: NEW_INPUT
        }
      }).then(() => {
        Assignment.findOne({
          _id: assignment._id
        }, (findErr, updatedAssignment) => {
          if (findErr) {
            done(err);
          }

          expect(updatedAssignment.input).to.equal(NEW_INPUT);
          done();
        });
      }).catch(done);
    });
  });
});
