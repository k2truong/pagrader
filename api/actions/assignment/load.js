import Assignment from '../../models/assignment';

export default function load(req, params) {
  return new Promise((resolve, reject) => {
    const repo = params[0];
    const assignment = params[1];

    const data = { repo };
    if (assignment) {
      req.name = assignment;
    }

    Assignment.find(data, (err, res) => {
      if (err) {
        return reject({
          message: err
        });
      }

      if (assignment && res.length === 1) {
        return resolve(res[0]);
      }
      return resolve(null);
    });
  });
}
