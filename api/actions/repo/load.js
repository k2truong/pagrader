import Repo from '../../models/repo';

export default function load() {
  return new Promise((resolve, reject) => {
    Repo.find({}, (err, res) => {
      if (err) {
        return reject({
          message: err
        });
      }

      return resolve(res);
    });
  });
}
