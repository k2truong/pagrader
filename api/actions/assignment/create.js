import Assignment from '../../models/assignment';

export default function create(req) {
  return new Promise((resolve, reject) => {
    const { repo, name, input, bonusDate, path, paguide, warnings } = req.body;

    Assignment.findOne({ name: req.body.name, repo: req.body.repo }, (err, res) => {
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
        repo,
        name,
        input,
        bonusDate,
        path,
        paguide,
        warnings
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
