/**
 * This file helps transfer the input.txt needed and then runs the script in the hidden directory
 */
import { command, transfer} from './';
import { saveStudents } from '../grade';

// TODO: Need to split this file apart so that we make multiple queries
export default function runScript(req) {
  const { assignment, socketId } = req.body;
  const { repo, input, path, bonusDate, name } = assignment;
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
            if (!data.graders || !previewList) {
              return Promise.reject({
                message: 'Error running script! Please make sure repository path is correct!'
              });
            }

            // Grab bonusList
            return command({
              body: {
                socketId,
                command: `cd .private_repo/${ name };
                  cat bonusList;`
              }
            }).then((bonusList) => {
              data.previewList = previewList.split('\n');
              // Save the students after running the script
              return saveStudents({
                body: {
                  repoId: repo,
                  assignmentId: name,
                  students: data.previewList.map((fileName) => {
                    return {
                      graderId: fileName.split('/')[0],
                      studentId: fileName.split('/')[1].replace(/\..*/, '')
                    };
                  }),
                  bonusList: bonusList.split('\n')
                }
              }).then(() => {
                return data;
              });
            });
          });
        });
      });
    });
  });
}
