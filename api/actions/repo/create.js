import Repo from '../../models/repo';
import { connect, transfer } from '../ssh';
import path from 'path';
import fs from 'fs';

export default function create(req) {
  const { username, password, description, language, socketId } = req.body;

  return new Promise((resolve, reject) => {
    const errors = [];
    if (!language) {
      errors.push('language');
    }

    if (!username) {
      errors.push('username');
    }

    if (!password) {
      errors.push('password');
    }

    if (errors.length) {
      return reject({
        message: `Missing ${ errors.join(', ')}`
      });
    }

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
        username,
        description,
        language
      });
      connect(req).then((connRes) => {
        const dirPath = path.join(__dirname, `./scripts/${language}_script.sh`);
        fs.stat(dirPath, (fileErr) => {
          if (fileErr) {
            return reject({
              message: 'Error in reading file'
            });
          }

          const fileStream = fs.createReadStream(dirPath);
          transfer({
            body: {
              socketId,
              fileStream,
              filePath: `./.private_repo/${language}_script.sh`
            }
          }).then(() => {
            newRepo.save((saveErr) => {
              if (saveErr) {
                return reject({
                  message: saveErr
                });
              }
              resolve(connRes);
            });
          }).catch(reject);
        });
      }).catch(reject);
    });
  });
}
