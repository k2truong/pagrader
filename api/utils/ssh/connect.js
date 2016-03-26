import { Client } from 'ssh2';
// import sshConnection from '../../ssh/connection';
// import fs from 'fs';
// import path from 'path';

export default function connect(req) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    const { username, password } = req.body;

    conn.on('error', (connErr) => {
      console.log(connErr);
      reject({
        message: connErr
      });
    });

    conn.on('ready', () => {
      resolve(conn);
      // sshConnection.saveConnection();
      // conn.sftp((sshErr, sftp) => {
      //   if (sshErr) throw sshErr;

      //   /* sftp.readdir('test', function(err, list) {
      //     if (err) throw err;
      //     console.dir(list);
      //     conn.end();
      //   });*/

      //   const writeStream = sftp.createWriteStream('./c_script.sh');
      //   const readStream = fs.createReadStream(
      //     path.join(__dirname, '/scripts/c_script.sh')
      //   );

      //   // what to do when transfer finishes
      //   writeStream.on('close', () => {
      //     resolve(sftp);
      //   });
      //   // initiate transfer of file
      //   readStream.pipe(writeStream);
      // });
    }).connect({
      // debug: console.log,
      host: 'ieng6.ucsd.edu',
      port: 22,
      user: username,
      password: password
    });
  });
}
