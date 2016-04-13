import { getSSHConnection } from '../../ssh/connection';

export default function getFile(req, params) {
  return new Promise((resolve, reject) => {
    const socketId = params[0];
    const assignmentId = params[1];
    const graderId = params[2];
    const fileName = params[3];

    const conn = getSSHConnection(socketId);
    conn.sftp((sshErr, sftp) => {
      if (sshErr) {
        reject({
          message: sshErr
        });
      }

      resolve((res) => {
        const filePath = `.private_repo/${ assignmentId }/${ graderId }/${ fileName }`;
        const readStream = sftp.createReadStream(filePath);

        readStream.pipe(res);
        return readStream;
      });
    });
  });
}
