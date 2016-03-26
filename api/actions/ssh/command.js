import { getSSHConnection } from '../../ssh/connection';

export default function connect(req) {
  return new Promise((resolve, reject) => {
    const { socketId, command } = req.body;

    const conn = getSSHConnection(socketId);
    if (conn) {
      conn.exec(command, (err, stream) => {
        if (err) {
          reject({
            message: err
          });
        }

        let output = '';
        stream.on('close', () => {
          resolve(output.trim());
        }).on('data', (data) => {
          output += data;
        }).stderr.on('data', (data) => {
          reject({
            message: data
          });
        });
      });
    } else {
      reject({
        message: 'No SSH Connection! Try relogging.'
      });
    }
  });
}
