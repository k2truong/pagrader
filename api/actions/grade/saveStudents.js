import Grade from '../../models/grade';

function updateBonus(assignmentId, repoId, bonusList, resolve, reject) {
  if (bonusList && bonusList.length) {
    Grade.update({
      assignment: assignmentId,
      repo: repoId,
      studentId: { $in: bonusList }
    }, { bonus: true }, { multi: true}, (err) => {
      if (err) {
        return reject({
          message: err
        });
      }

      resolve();
    });
  } else {
    resolve();
  }
}

export default function saveStudents(req) {
  return new Promise((resolve, reject) => {
    const { students, assignmentId, repoId, bonusList } = req.body;

    // Find already added students and add only the new ones
    Grade.update({
      assignment: assignmentId,
      repo: repoId
    }, { bonus: false }, { multi: true }, (updateErr) => {
      if (updateErr) {
        return reject({
          message: updateErr
        });
      }
      Grade.find({
        assignment: assignmentId,
        repo: repoId
      }).exec((err, docs) => {
        if (err) {
          return reject({
            message: err
          });
        }

        const studentMap = {};
        docs.forEach((doc) => {
          studentMap[doc.studentId] = true;
        });

        const newStudents = [];
        students.forEach((student) => {
          if (!studentMap[student.studentId]) {
            newStudents.push({
              assignment: assignmentId,
              repo: repoId,
              studentId: student.studentId,
              grader: student.graderId,
              bonus: false
            });
          }
        });

        if (newStudents.length) {
          Grade.insertMany(newStudents, (insertErr) => {
            if (insertErr) {
              return reject({
                message: insertErr
              });
            }

            updateBonus(assignmentId, repoId, bonusList, resolve, reject);
          });
        } else {
          updateBonus(assignmentId, repoId, bonusList, resolve, reject);
        }
      });
    });
  });
}
