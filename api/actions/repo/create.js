import Repo from '../../models/repo';
import connect from '../ssh/connect';

export default function create(req) {
  return new Promise((resolve, reject) => {
    Repo.findOne({ username: req.body.username }, (err, res) => {
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

      const newRepo = new Repo();
      newRepo.username = req.body.username;
      newRepo.description = req.body.description;

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
