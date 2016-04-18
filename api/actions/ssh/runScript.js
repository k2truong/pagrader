/**
 * This file helps transfer the input.txt needed and then runs the script in the hidden directory
 */
import { command, transfer} from './';

export default function connect(req) {
  const { assignment, socketId } = req.body;
  const { input, path, bonusDate, name } = assignment;
  const repoPath = `.private_repo/${ path.match(/.*\/(.+?)\/?$/)[1] }`;

  return command({
    body: {
      socketId,
      command: `rm -r ${ repoPath }`
    }
  }).then(() => {
    return transfer({
      body: {
        socketId,
        content: input,
        filePath: `${ repoPath }/input.txt`
      }
    }).then(() => {
      // Copy all files to directory
      // Copy script to directory
      // Change permission on script
      // dos2unix equivalent on script
      // Run script
      return command({
        body: {
          socketId,
          command: `cd ${ repoPath };
            cp -r ${ path }/* .;
            cp ../*.sh .;
            chmod 777 *.sh;
            ed -s *.sh <<< $'H\ng/\r*$/s///\nwq';`
        }
      }).then(() => {
        return command({
          body: {
            socketId,
            command: `cd ${ repoPath };./*.sh "${ bonusDate }"`
          }
        }).then((res) => {
          if (res.indexOf('Error') >= 0) {
            return Promise.reject({
              message: res
            });
          }

          const data = {
            graders: res ? res.split('\n') : null
          };
          return command({
            body: {
              socketId,
              command: `cd .private_repo/${ name };
                shopt -s nullglob;
                files=(*/*.out.html);
                printf "%s\\n" "$\{files[@]}";`
            }
          }).then((previewList) => {
            if (previewList) {
              data.previewList = previewList.split('\n');
            }

            if (!data.graders || !data.previewList) {
              return Promise.reject({
                message: 'Error running script! Please make sure repository path is correct!'
              });
            }

            return data;
          });
        });
      });
    });
  });
}
