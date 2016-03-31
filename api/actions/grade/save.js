import Grade from '../../models/grade';

export default function save(req) {
  return new Promise((resolve, reject) => {
    const { studentId, assignmentId } = req.body;

    Grade.update({
      assignment: assignmentId,
      studentId: studentId
    }, req.body, { upsert: true}, (err) => {
      if (err) {
        reject({
          message: err
        });
      }

      resolve();
    });
  });
}
