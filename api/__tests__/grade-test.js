import { expect } from 'chai';
import { save } from '../actions/grade';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Grade from '../models/grade';

describe('Grade API', () => {
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

  const MOCK_GRADE = {
    assignment: 'PA1',
    repo: 'cs5s10',
    studentId: 'cs5waa',
    grade: '10',
    comment: '1\n2\n'
  };
  it('should create grade', (done) => {
    save({
      body: MOCK_GRADE
    }).then(() => {
      Grade.findOne({
        assignment: MOCK_GRADE.assignment,
        repo: MOCK_GRADE.repo,
        studentId: MOCK_GRADE.studentId
      }, (err, res) => {
        if (err) {
          done(err);
        }

        expect(res.grade).equal(MOCK_GRADE.grade);
        expect(res.comment).equal(MOCK_GRADE.comment);
        expect(res.studentId).equal(MOCK_GRADE.studentId);
        expect(res.assignment).equal(MOCK_GRADE.assignment);
        expect(res.repo).equal(MOCK_GRADE.repo);
        done();
      });
    }).catch(done);
  });

  const UPDATED_GRADE = {
    assignment: 'PA1',
    repo: 'cs5s10',
    studentId: 'cs5waa',
    grade: '5',
    comment: 'Output does not match'
  };
  it('should update grade', (done) => {
    save({
      body: UPDATED_GRADE
    }).then(() => {
      Grade.findOne({
        assignment: UPDATED_GRADE.assignment,
        repo: UPDATED_GRADE.repo,
        studentId: UPDATED_GRADE.studentId
      }, (err, res) => {
        if (err) {
          done(err);
        }

        expect(res.grade).equal(UPDATED_GRADE.grade);
        expect(res.comment).equal(UPDATED_GRADE.comment);
        expect(res.studentId).equal(UPDATED_GRADE.studentId);
        expect(res.assignment).equal(UPDATED_GRADE.assignment);
        expect(res.repo).equal(UPDATED_GRADE.repo);
        done();
      });
    }).catch(done);
  });
});
