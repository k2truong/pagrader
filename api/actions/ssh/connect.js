import { Client } from 'ssh2';
import { saveSSHConnection } from '../../ssh/connection';
import command from './command';
import { sshServerInfo } from '../../config/secrets.js';
import Repo from '../../models/repo';

export default function connect(req) {
  return new Promise((resolve, reject) => {
    // if (req.user) Need to add this for production
    const conn = new Client();
    const { username, password, socketId } = req.body;

    conn.on('error', (connErr) => {
      if (connErr) {
        return reject({
          message: 'Error connecting to SSH'
        });
      }
    });

    Repo.findOne({ username: username }, (err, res) => {
      if (err) {
        return reject({
          message: err
        });
      }

      conn.on('ready', () => {
        saveSSHConnection(socketId, conn);
        command({
          body: {
            socketId: socketId,
            command: 'pwd'
          }
        }).then((stdout) => {
          resolve({
            username: username,
            path: stdout,
            language: res.language
          });
        }).catch(reject);
      }).connect({
        host: sshServerInfo,
        port: 22,
        user: username,
        password: password
      });
    });
  });
}
