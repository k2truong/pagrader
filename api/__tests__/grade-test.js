import { expect } from 'chai';
import { save, getStudents, saveStudents, submitGrades } from '../actions/grade';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Grade from '../models/grade';

describe('Grade API', () => {
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
    for (const collection in mongoose.connection.collections) {
      if (mongoose.connection.collections[collection]) {
        mongoose.connection.collections[collection].remove(() => {});
      }
    }

    mongoose.disconnect();
    done();
  });

  const MOCK_STUDENTS = {
    assignmentId: 'PA1',
    repoId: 'cs7s10',
    students: [{studentId: 'cs7uaa', graderId: 'cs7u2'}, {studentId: 'cs7uac', graderId: 'cs7u2'}],
    bonusList: ['cs7uaa', 'cs7uac']
  };
  it('should createAll grades', (done) => {
    saveStudents({
      body: MOCK_STUDENTS
    }).then(() => {
      Grade.find({
        assignment: MOCK_STUDENTS.assignmentId,
        repo: MOCK_STUDENTS.repoId
      }, (err, docs) => {
        if (err) {
          return done(err);
        }
        expect(docs.length).equal(MOCK_STUDENTS.students.length);
        expect(docs[0].bonus).equal(true);
        expect(docs[1].bonus).equal(true);
        done();
      });
    }).catch(done);
  });

  it('should list all students', (done) => {
    getStudents({}, [
      MOCK_STUDENTS.repoId,
      MOCK_STUDENTS.assignmentId,
      MOCK_STUDENTS.students[0].graderId
    ]).then((students) => {
      expect(students.length).equal(MOCK_STUDENTS.students.length);
      done();
    }).catch(done);
  });

  const MOCK_GRADE = {
    assignment: 'PA1',
    repo: 'cs7s10',
    studentId: 'cs7uaa',
    grade: '10',
    comment: '1\n2\n'
  };
  it('should update grade', (done) => {
    save({
      body: MOCK_GRADE
    }).then(() => {
      Grade.findOne({
        assignment: MOCK_GRADE.assignment,
        repo: MOCK_GRADE.repo,
        studentId: MOCK_GRADE.studentId
      }, (err, res) => {
        if (err) {
          return done(err);
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
    repo: 'cs7s10',
    studentId: 'cs7uaa',
    grade: '5',
    comment: 'Output does not match'
  };
  it('should update grade again', (done) => {
    save({
      body: UPDATED_GRADE
    }).then(() => {
      Grade.findOne({
        assignment: UPDATED_GRADE.assignment,
        repo: UPDATED_GRADE.repo,
        studentId: UPDATED_GRADE.studentId
      }, (err, res) => {
        if (err) {
          return done(err);
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

  const NEW_MOCK_STUDENTS = {
    assignmentId: 'PA1',
    repoId: 'cs7s10',
    students: [
      {studentId: 'cs7uaa', graderId: 'cs7u2'},
      {studentId: 'cs7uac', graderId: 'cs7u2'},
      {studentId: 'cs7uag', graderId: 'cs7u3'},
      {studentId: 'cs7uah', graderId: 'cs7u3'}
    ],
    bonusList: ['cs7uaa', 'cs7uac']
  };
  it('should create grades again but keep previous updates', (done) => {
    saveStudents({
      body: NEW_MOCK_STUDENTS
    }).then(() => {
      Grade.findOne({
        assignment: UPDATED_GRADE.assignment,
        repo: UPDATED_GRADE.repo,
        studentId: UPDATED_GRADE.studentId
      }, (updateErr, res) => {
        if (updateErr) {
          return done(updateErr);
        }

        expect(res.bonus).equal(true);
        expect(res.grade).equal(UPDATED_GRADE.grade);
        expect(res.comment).equal(UPDATED_GRADE.comment);
        expect(res.studentId).equal(UPDATED_GRADE.studentId);
        expect(res.assignment).equal(UPDATED_GRADE.assignment);
        expect(res.repo).equal(UPDATED_GRADE.repo);

        Grade.find({
          assignment: NEW_MOCK_STUDENTS.assignmentId,
          repo: NEW_MOCK_STUDENTS.repoId
        }, (err, docs) => {
          if (err) {
            return done(err);
          }

          expect(docs[0].bonus).equal(true);
          expect(docs[1].bonus).equal(true);
          expect(docs[2].bonus).equal(false);
          expect(docs[3].bonus).equal(false);
          expect(docs.length).equal(NEW_MOCK_STUDENTS.students.length);
          done();
        });
      });
    }).catch(done);
  });

  const NEW_MOCK_BONUS_STUDENTS = {
    assignmentId: 'PA1',
    repoId: 'cs7s10',
    students: [
      {studentId: 'cs7uaa', graderId: 'cs7u2'},
      {studentId: 'cs7uac', graderId: 'cs7u2'},
      {studentId: 'cs7uag', graderId: 'cs7u3'},
      {studentId: 'cs7uah', graderId: 'cs7u3'}
    ],
    bonusList: ['cs7uag']
  };
  it('should create grades again but bonusList is updated', (done) => {
    saveStudents({
      body: NEW_MOCK_BONUS_STUDENTS
    }).then(() => {
      Grade.findOne({
        assignment: UPDATED_GRADE.assignment,
        repo: UPDATED_GRADE.repo,
        studentId: UPDATED_GRADE.studentId
      }, (updateErr, res) => {
        if (updateErr) {
          return done(updateErr);
        }

        expect(res.bonus).equal(false);
        expect(res.grade).equal(UPDATED_GRADE.grade);
        expect(res.comment).equal(UPDATED_GRADE.comment);
        expect(res.studentId).equal(UPDATED_GRADE.studentId);
        expect(res.assignment).equal(UPDATED_GRADE.assignment);
        expect(res.repo).equal(UPDATED_GRADE.repo);

        Grade.find({
          assignment: NEW_MOCK_BONUS_STUDENTS.assignmentId,
          repo: NEW_MOCK_BONUS_STUDENTS.repoId
        }, (err, docs) => {
          if (err) {
            return done(err);
          }
          expect(docs.length).equal(NEW_MOCK_BONUS_STUDENTS.students.length);

          expect(docs[0].bonus).equal(false);
          expect(docs[1].bonus).equal(false);
          expect(docs[2].bonus).equal(true);
          expect(docs[3].bonus).equal(false);
          done();
        });
      });
    }).catch(done);
  });

  // Only test sparkpost if we have it enabled
  if (process.env.SPARKPOST_SANDBOX_DOMAIN) {
    const MOCK_GRADER = {
      graderId: 'cs7u2',
      repoId: 'cs7s10',
      assignmentId: 'PA1'
    };
    it('should email students and professor grades', (done) => {
      submitGrades({
        body: MOCK_GRADER
      }).then(() => {
        done();
      }).catch(done);
    });
  }
});
