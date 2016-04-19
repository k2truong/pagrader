import Grade from '../../models/grade';

export default function getGraders(req, params) {
  return new Promise((resolve, reject) => {
    const repoId = params[0];
    const assignmentId = params[1];
    const graderId = params[2];

    Grade.find({
      assignment: assignmentId,
      repo: repoId,
      grader: graderId
    }).sort({ studentId: 1 }).exec((err, students) => {
      if (err) {
        return reject(err);
      }
      resolve(students);
    });
  });
}
