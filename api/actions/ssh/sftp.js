// import fs from 'fs';
// import path from 'path';

      // conn.shell((err, stream) => {
      //   if (err) throw err;
      //   stream.on('close', () => {
      //     // console.log('Stream :: close');
      //     resolve();
      //   }).on('data', (data) => {
      //     console.log('STDOUT: ' + data);
      //   }).stderr.on('data', (data) => {
      //     // console.log('STDERR: ' + data);
      //   });
      //   stream.write('q\n');
      //   // stream.end('pwd\n');
      //   stream.write('cd ..; ls\n');
      //   stream.end('exit\n');
      // });
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

import fs from 'fs';
import path from 'path';
export default function sftp(req, params) {
  const fileName = params[0];

  return new Promise((resolve, reject) => {
    const dirPath = path.join(__dirname, `/scripts/${fileName}`);
    console.log(dirPath);
    fs.stat(dirPath, (err) => {
      if (err) {
        console.log('Error: ' + err);
        return reject({
          message: 'Error in reading file'
        });
      }

      resolve((res) => {
        const readStream = fs.createReadStream(dirPath);
        readStream.pipe(res);
      });
    });
  });
}
