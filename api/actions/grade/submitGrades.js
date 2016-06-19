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
  const { assignmentId, repoId, graderId } = req.body;
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
          // TODO: Add recipients as students email instead of my testing account
          // recipients.push(`${ grade.studentId }@acsweb.ucsd.edu`);
          emailPromises.push(
            sendEmail(sp, {
              subject: `${ assignmentId } Grade`,
              body: `<pre style="font-size: 12px;"><b>Grade:</b> ${ grade.grade }\n` +
                `<b>Comments:</b> ${ grade.comment || '' }</pre>`,
              recipients: [{
                address: isProd ? `${ grade.studentId }@acsmail.ucsd.edu` : 'kenneth.e.truong@gmail.com'
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

      Promise.all(emailPromises).then(() => {
        sendEmail(sp, {
          subject: `${ assignmentId } Grades`,
          body: `<pre style="font-size: 12px;">Grades and comments attached</pre>`,
          recipients: [{
            address: isProd ? `smarx@cs.ucsd.edu` : 'kenneth.e.truong@gmail.com'
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
