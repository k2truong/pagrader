import Grade from '../../models/grade';
import { command, transfer } from './';

function transferEmail(options) {
  const { emailPath, content, fileName, socketId } = options;

  return transfer({
    body: {
      socketId,
      content,
      filePath: `${ emailPath }/${ fileName }`
    }
  });
}

function emailStudents(grades, index, options) {
  const { socketId, emailPath, warnings } = options;
  const grade = grades[index];

  return transferEmail({
    socketId,
    emailPath,
    fileName: `${ grade.studentId }.html`,
    content: `<html><body><p><pre style="font-size: 12px;"><b>Grade:</b> ${ grade.grade }\n` +
      (grade.bonus ? '+1 Early turn-in bonus\n' : '') +
      `<b>Errors:</b>\n${ grade.errorList || '' }\n` +
      `<b>Comments:</b>\n${ grade.comment || '' }\n\n` +
      `<b>*WARNINGS*</b>\n` +
      `Note: These warnings may not apply to you but keep them in mind for future reference.\n` +
      `${ warnings }</pre></p><br>` +
      '<p>Please do not reply to this email. ' +
      'If you have any questions about your grade or comments please email smarx@cs.ucsd.edu.' +
      '</p></body></html>'
  }).then(() => {
    if (index + 1 < grades.length) {
      return emailStudents(grades, index + 1, options);
    }
  });
}

export default function submitGrades(req) {
  const { assignmentId, repoId, graderId, bbcEmail, verification, socketId, warnings = '' } = req.body;

  const emailPath = `.private_repo/${ assignmentId }/email/${ graderId }`;

  return new Promise((resolve, reject) => {
    Grade.find({
      assignment: assignmentId,
      repo: repoId,
      grader: graderId
    }, (err, grades) => {
      if (err) {
        return reject(err);
      }

      const gradedStudents = [];
      const ungradedStudents = [];
      let scores = '';
      let comments = '';

      grades.forEach((grade) => {
        if (grade.grade) {
          gradedStudents.push(grade.studentId);
          scores += grade.studentId + '\t' + grade.grade + (grade.bonus ? '*' : '') + '\n';
          comments += grade.studentId + ': ' + grade.grade + '/10\n' +
              (grade.bonus ? '+1 Early turn-in bonus\n' : '') +
              'Errors:\n' + (grade.errorList || '') + '\n' +
              'Comments:\n' + (grade.comment || '') + '\n\n' +
              `*WARNINGS*\n` +
              `Note: These warnings may not apply to you but keep them in mind for future reference.\n` +
              `${ warnings }\n\n`;
        } else {
          ungradedStudents.push(grade.studentId);
        }
      });

      const verify = verification ? 'Verification' : '';
      emailStudents(grades, 0, { socketId, emailPath, warnings }).then(() => {
        transferEmail({
          socketId,
          emailPath,
          fileName: 'PAScores.txt',
          content: scores + '\n\n' + comments
        }).then(() => {
          console.log(`cd ${ emailPath }; ~/.private_repo/email.sh ${ bbcEmail } "${ graderId } Grade" ${ verify }`);
          command({
            body: {
              socketId,
              command: `cd ${ emailPath }; ~/.private_repo/email.sh ${ bbcEmail } "${ graderId } Grade" ${ verify }`
            }
          }).then(() => {
            resolve({
              graded: gradedStudents,
              ungraded: ungradedStudents
            });
          }).catch(reject);
        }).catch(reject);
      }).catch((emailErr) => {
        console.log(emailErr);
        reject(emailErr);
      });
    });
  });
}
