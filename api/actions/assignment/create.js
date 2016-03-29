import Assignment from '../../models/assignment';

export default function create(req) {
  return new Promise((resolve, reject) => {
    const { repoId, name, input, bonusDate, path } = req.body;

    Assignment.findOne({ name: req.body.name, repo: req.body.repoId }, (err, res) => {
      if (err) {
        return reject({
          message: err
        });
      }

      if (res) {
        return reject({
          message: 'Assignment name already taken for this repository.'
        });
      }

      const newAssignment = new Assignment({
        repo: repoId,
        name: name,
        input: input,
        bonusDate: bonusDate,
        path: path
      });

      newAssignment.save((saveErr, assignment) => {
        if (saveErr) {
          return reject({
            message: saveErr
          });
        }
        resolve(assignment);
      });
    });
  });
}
