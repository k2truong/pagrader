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
