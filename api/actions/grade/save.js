import Grade from '../../models/grade';

export default function saveGrade(req) {
  return new Promise((resolve, reject) => {
    const { studentId, assignment, repo } = req.body;

    Grade.update({
      assignment,
      repo,
      studentId
    }, req.body, (err) => {
      if (err) {
        return reject({
          message: err
        });
      }

      resolve();
    });
  });
}
