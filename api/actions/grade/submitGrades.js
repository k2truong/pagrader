import Grade from '../../models/grade';
import SparkPost from 'sparkpost';

function sendEmail(sp, options) {
  return new Promise((resolve, reject) => {
    const { body, subject, recipients, attachments } = options;
    sp.transmissions.send({
      transmissionBody: {
        content: {
          from: 'csgrader@kennethtruong.com', // 'testing@sparkpostbox.com'
          subject: subject,
          html: `<html><body><p>${ body }</p><br>` +
            '<p>Please do not reply to this email. ' +
            'If you have any questions about your grade or comments please email smarx@cs.ucsd.edu.' +
            '</p></body></html>',
          attachments
        },
        recipients
      }
    }, (err) => {
      if (err) {
        reject({
          message: err
        });
      } else {
        resolve();
      }
    });
  });
}

export default function submitGrades(req) {
  const { assignmentId, repoId, graderId, bbcEmail, verification } = req.body;
  return new Promise((resolve, reject) => {
    Grade.find({
      assignment: assignmentId,
      repo: repoId,
      grader: graderId
    }, (err, grades) => {
      if (err) {
        return reject(err);
      }

      const emailPromises = [];
      const sp = new SparkPost();
      const gradedStudents = [];
      const ungradedStudents = [];
      const isProd = process.env.NODE_ENV === 'production';
      let scores = '';
      let comments = '';

      grades.forEach((grade) => {
        if (grade.grade) {
          const studentEmail = isProd && !verification ? `${ grade.studentId }@acsmail.ucsd.edu` : '';
          emailPromises.push(
            sendEmail(sp, {
              subject: `${ graderId } Grade`,
              body: `<pre style="font-size: 12px;"><b>Grade:</b> ${ grade.grade }\n` +
                `<b>Comments:</b> ${ grade.comment || '' }</pre>`,
              recipients: [{
                address: {
                  email: studentEmail
                }
              },
              {
                address: {  // BCC
                  email: bbcEmail,
                  header_to: studentEmail
                }
              }]
            })
          );
          gradedStudents.push(grade.studentId);
          scores += grade.studentId + '\t' + grade.grade + (grade.bonus ? '*' : '') + '\n';
          comments += grade.studentId + ': ' + grade.grade + '/10\n' +
              'Comments: \n' + (grade.comment || '') + '\n\n';
        } else {
          ungradedStudents.push(grade.studentId);
        }
      });

      const profEmail = isProd ? `smarx@cs.ucsd.edu` : bbcEmail;
      Promise.all(emailPromises).then(() => {
        sendEmail(sp, {
          subject: `${ graderId } ${ verification ? 'Verification' : '' } Grades`,
          body: `<pre style="font-size: 12px;">Grades and comments attached</pre>`,
          recipients: [{
            address: profEmail
          },
          {
            address: {
              email: bbcEmail,
              header_to: profEmail
            }
          }],
          'attachments': [
            {
              'type': 'text/plain',
              'name': `${assignmentId} Grades.txt`,
              'data': new Buffer(scores + '\n\n' + comments).toString('base64')
            }
          ]
        }).then(() => {
          resolve({
            graded: gradedStudents,
            ungraded: ungradedStudents
          });
        }).catch(reject);
      });
    });
  });
}
