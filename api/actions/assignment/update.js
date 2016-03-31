import Assignment from '../../models/assignment';

export default function update(req) {
  return new Promise((resolve, reject) => {
    const { input, assignmentId } = req.body;
    const updateProps = {};

    if (input) {
      updateProps.input = input;
    }

    Assignment.findOneAndUpdate({
      _id: assignmentId // eslint-disable-line new-cap
    }, updateProps, (err) => {
      if (err) {
        return reject({
          message: err
        });
      }

      resolve();
    });
  });
}
