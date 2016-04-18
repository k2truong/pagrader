import { getSSHConnection } from '../../ssh/connection';

export default function getFile(req, params) {
  return new Promise((resolve, reject) => {
    const socketId = params[0];
    const assignmentId = params[1];
    const graderId = params[2];
    const fileName = params[3];

    const conn = getSSHConnection(socketId);
    if (conn) {
      conn.sftp((sshErr, sftp) => {
        if (sshErr) {
          return reject({
            message: sshErr
          });
        }

        const filePath = `.private_repo/${ assignmentId }/${ graderId }/${ fileName }`;
        const readStream = sftp.createReadStream(filePath);

        readStream.on('open', () => {
          resolve((res) => {
            readStream.pipe(res);
            return readStream;
          });
        });

        readStream.on('close', () => {
          sftp.end();
        });

        readStream.on('error', (err) => {
          reject({
            message: err.message
          });
        });
      });
    } else {
      return reject({
        message: 'No SSH Connection! Try relogging.'
      });
    }
  });
}
