import { getSSHConnection } from '../../ssh/connection';

function write(sftp, fileStream, filePath, content, resolve, reject) {
  const writeStream = sftp.createWriteStream(filePath);

  writeStream.on('close', () => {
    resolve();
  });

  writeStream.on('error', (err) => {
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
}

export default function transfer(req) {
  return new Promise((resolve, reject) => {
    const { socketId, filePath, fileStream, content } = req.body;

    const conn = getSSHConnection(socketId);
    conn.sftp((sshErr, sftp) => {
      if (sshErr) {
        reject({
          message: sshErr
        });
      }

      const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
      sftp.readdir(dirPath, (readErr) => {
        if (readErr) {
          sftp.mkdir(dirPath, (err) => {
            if (err) {
              reject({
                message: err
              });
            }
            write(sftp, fileStream, filePath, content, resolve, reject);
          });
        } else {
          write(sftp, fileStream, filePath, content, resolve, reject);
        }
      });
    });
  });
}
