import Assignment from '../../models/assignment';

export default function update(req) {
  return new Promise((resolve, reject) => {
    const { name, repo, bonusDate, input, paguide, warnings } = req.body;
    const updateProps = {};

    if (input) {
      updateProps.input = input;
    }

    if (bonusDate) {
      updateProps.bonusDate = bonusDate;
    }

    if (paguide) {
      updateProps.paguide = paguide;
    }

    if (warnings) {
      updateProps.warnings = warnings;
    }

    Assignment.findOneAndUpdate({
      name,
      repo
    }, updateProps, {new: true}, (err, updatedAssignment) => {
      if (err) {
        return reject({
          message: err
        });
      }

      resolve(updatedAssignment);
    });
  });
}
