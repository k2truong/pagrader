import Repo from '../../models/repo';
import connect from '../ssh/connect';

export default function create(req) {
  const { username, description } = req.body;

  return new Promise((resolve, reject) => {
    Repo.findOne({ username: username }, (err, res) => {
      if (err) {
        return reject({
          message: err
        });
      }

      if (res) {
        return reject({
          message: 'Repository already created for SSH Username'
        });
      }

      const newRepo = new Repo({
        username: username,
        description: description
      });

      connect(req).then((connRes) => {
        newRepo.save((saveErr) => {
          if (saveErr) {
            return reject({
              message: saveErr
            });
          }
          resolve(connRes);
        });
      }, (connErr) => {
        reject(connErr);
      });
    });
  });
}
