import Grade from '../../models/grade';

export default function save(req) {
  return new Promise((resolve, reject) => {
    const { studentId, assignment, repo } = req.body;

    Grade.update({
      assignment,
      repo,
      studentId
    }, req.body, { upsert: true}, (err) => {
      if (err) {
        return reject({
          message: err
        });
      }

      resolve();
    });
  });
}
