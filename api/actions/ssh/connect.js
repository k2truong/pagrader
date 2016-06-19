import { Client } from 'ssh2';
import { saveSSHConnection } from '../../ssh/connection';
import command from './command';
import { sshServerInfo } from '../../config/secrets.js';

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
          path: stdout
        });
      }).catch(reject);
    }).connect({
      host: sshServerInfo,
      port: 22,
      user: username,
      password: password
    });
  });
}
