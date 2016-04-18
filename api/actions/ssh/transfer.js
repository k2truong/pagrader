import { command } from './';
import { getSSHConnection } from '../../ssh/connection';

function write(socketId, sftp, fileStream, filePath, content, resolve, reject) {
  command({
    body: {
      socketId,
      command: `rm ${ filePath }`
    }
  }).then(() => {
    const writeStream = sftp.createWriteStream(filePath);

    writeStream.on('close', () => {
      sftp.end();
      resolve();
    });

    writeStream.on('error', (err) => {
      sftp.end();
      reject({
        message: err
      });
    });

    if (fileStream) {
      // initiate transfer of file
      fileStream.pipe(writeStream);
    } else {
      writeStream.write(content);
      writeStream.end();
    }
  });
}

export default function transfer(req) {
  return new Promise((resolve, reject) => {
    const { socketId, filePath, fileStream, content } = req.body;

    const conn = getSSHConnection(socketId);
    if (conn) {
      conn.sftp((sshErr, sftp) => {
        if (sshErr) {
          return reject({
            message: sshErr
          });
        }

        const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
        sftp.readdir(dirPath, (readErr) => {
          if (readErr) {
            sftp.mkdir(dirPath, (err) => {
              if (err) {
                return reject({
                  message: err
                });
              }
              write(socketId, sftp, fileStream, filePath, content, resolve, reject);
            });
          } else {
            write(socketId, sftp, fileStream, filePath, content, resolve, reject);
          }
        });
      });
    } else {
      return reject({
        message: 'No SSH Connection! Try relogging.'
      });
    }
  });
}
