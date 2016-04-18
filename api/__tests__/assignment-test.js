import { expect } from 'chai';
import { create, update, load } from '../actions/assignment';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Assignment from '../models/assignment';

describe('Assignment API', () => {
  before((done) => {
    mongoose.connect(secrets.db, (dbErr) => {
      if (dbErr) {
        done(dbErr);
      } else {
        for (const collection in mongoose.connection.collections) {
          if (mongoose.connection.collections[collection]) {
            mongoose.connection.collections[collection].remove(() => {});
          }
        }
        done();
      }
    });
  });

  after((done) => {
    // Clean up after finished with tests
    mongoose.disconnect();
    done();
  });

  const MOCK_ASSIGNMENT = {
    repo: 'cs7s10',
    input: 'B\n1900\n3.3\n\nA\n2000\n2.2\n',
    name: 'PA1',
    path: '/home/linux/ieng6/cs7s/cs7s10/GRADER/PA1/',
    bonusDate: '1/24/1991 12:00'
  };
  it('should create assignment', (done) => {
    create({
      body: MOCK_ASSIGNMENT
    }).then((res) => {
      expect(res.repo).deep.equal(MOCK_ASSIGNMENT.repo);
      expect(res.input).equal(MOCK_ASSIGNMENT.input);
      expect(res.name).equal(MOCK_ASSIGNMENT.name);
      expect(res.path).equal(MOCK_ASSIGNMENT.path);
      expect(res.bonusDate).equal(MOCK_ASSIGNMENT.bonusDate);

      Assignment.findOne({
        repo: MOCK_ASSIGNMENT.repo,
        name: MOCK_ASSIGNMENT.name
      }, (err, assignment) => {
        expect(assignment.repo).deep.equal(MOCK_ASSIGNMENT.repo);
        expect(assignment.input).equal(MOCK_ASSIGNMENT.input);
        expect(assignment.name).equal(MOCK_ASSIGNMENT.name);
        expect(assignment.path).equal(MOCK_ASSIGNMENT.path);
        expect(assignment.bonusDate).equal(MOCK_ASSIGNMENT.bonusDate);
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

  const NEW_REPO_ASSIGNMENT = {
    repo: 'cs7s11',
    input: 'B\n1900\n3.3\n\nA\n2000\n2.2\n',
    name: 'PA1',
    path: '/home/linux/ieng6/cs7s/cs7s10/GRADER/PA1/',
    bonusDate: '1/24/1991 12:00'
  };
  it('should be able to create new assignment in separate repo', (done) => {
    create({
      body: NEW_REPO_ASSIGNMENT
    }).then((res) => {
      expect(res.repo).deep.equal(NEW_REPO_ASSIGNMENT.repo);
      expect(res.input).equal(NEW_REPO_ASSIGNMENT.input);
      expect(res.name).equal(NEW_REPO_ASSIGNMENT.name);
      expect(res.path).equal(NEW_REPO_ASSIGNMENT.path);
      expect(res.bonusDate).equal(NEW_REPO_ASSIGNMENT.bonusDate);

      Assignment.findOne({
        repo: NEW_REPO_ASSIGNMENT.repo,
        name: NEW_REPO_ASSIGNMENT.name
      }, (err, assignment) => {
        expect(assignment.repo).equal(NEW_REPO_ASSIGNMENT.repo);
        expect(assignment.input).equal(NEW_REPO_ASSIGNMENT.input);
        expect(assignment.name).equal(NEW_REPO_ASSIGNMENT.name);
        expect(assignment.path).equal(NEW_REPO_ASSIGNMENT.path);
        expect(assignment.bonusDate).equal(NEW_REPO_ASSIGNMENT.bonusDate);
        done();
      });
    }).catch(done);
  });

  const NEW_INPUT = 'B\n1900\n3.3\n\nA\n2000\n2.2\nx\n';
  it('should update assignment only input', (done) => {
    update({
      body: {
        name: MOCK_ASSIGNMENT.name,
        repo: MOCK_ASSIGNMENT.repo,
        input: NEW_INPUT
      }
    }).then((res) => {
      expect(res.input).equal(NEW_INPUT);

      Assignment.findOne({
        name: MOCK_ASSIGNMENT.name
      }, (findErr, updatedAssignment) => {
        if (findErr) {
          done(findErr);
        }

        expect(updatedAssignment.input).equal(NEW_INPUT);
        done();
      });
    }).catch(done);
  });

  const NEW_BONUS = '1/24/1991 6:00';
  it('should update assignment only bonusDate', (done) => {
    update({
      body: {
        name: MOCK_ASSIGNMENT.name,
        repo: MOCK_ASSIGNMENT.repo,
        bonusDate: NEW_BONUS
      }
    }).then((res) => {
      expect(res.bonusDate).equal(NEW_BONUS);

      Assignment.findOne({
        name: MOCK_ASSIGNMENT.name
      }, (findErr, updatedAssignment) => {
        if (findErr) {
          done(findErr);
        }

        expect(updatedAssignment.bonusDate).equal(NEW_BONUS);
        done();
      });
    }).catch(done);
  });

  it('should update assignment', (done) => {
    update({
      body: {
        name: MOCK_ASSIGNMENT.name,
        repo: MOCK_ASSIGNMENT.repo,
        input: MOCK_ASSIGNMENT.input,
        bonusDate: MOCK_ASSIGNMENT.bonusDate
      }
    }).then((res) => {
      expect(res.input).equal(MOCK_ASSIGNMENT.input);
      expect(res.bonusDate).equal(MOCK_ASSIGNMENT.bonusDate);

      Assignment.findOne({
        name: MOCK_ASSIGNMENT.name
      }, (findErr, updatedAssignment) => {
        if (findErr) {
          done(findErr);
        }

        expect(updatedAssignment.input).equal(MOCK_ASSIGNMENT.input);
        expect(updatedAssignment.bonusDate).equal(MOCK_ASSIGNMENT.bonusDate);
        done();
      });
    }).catch(done);
  });

  it('should list all assignment in repo', (done) => {
    load({}, [MOCK_ASSIGNMENT.repo]).then((res) => {
      expect(res.length).equal(1);
      expect(res[0].repo).equal(MOCK_ASSIGNMENT.repo);
      expect(res[0].name).equal(MOCK_ASSIGNMENT.name);
      expect(res[0].path).equal(MOCK_ASSIGNMENT.path);
      expect(res[0].input).equal(MOCK_ASSIGNMENT.input);
      expect(res[0].bonusDate).equal(MOCK_ASSIGNMENT.bonusDate);
      done();
    }).catch(done);
  });

  it('should load one assignment', (done) => {
    load({}, [MOCK_ASSIGNMENT.repo, MOCK_ASSIGNMENT.name]).then((res) => {
      expect(res.repo).equal(MOCK_ASSIGNMENT.repo);
      expect(res.name).equal(MOCK_ASSIGNMENT.name);
      expect(res.path).equal(MOCK_ASSIGNMENT.path);
      expect(res.input).equal(MOCK_ASSIGNMENT.input);
      expect(res.bonusDate).equal(MOCK_ASSIGNMENT.bonusDate);
      done();
    }).catch(done);
  });
});
