import Grade from '../../models/grade';
import SparkPost from 'sparkpost';

function sendEmail(sp, options) {
  return new Promise((resolve, reject) => {
    const { body, subject, recipients } = options;
    sp.transmissions.send({
      transmissionBody: {
        content: {
          from: 'noreply@' + process.env.SPARKPOST_SANDBOX_DOMAIN, // 'testing@sparkpostbox.com'
          subject: subject,
          html: `<html><body><p>${ body }</p>` +
            '<p>Please do not reply to this email.' +
            'If you have any questions about your grade or comments please email Susan.' +
            '</p></body></html>'
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
      const recipients = [{address: 'aznflarekid@gmail.com'}];
      const gradedStudents = [];
      const ungradedStudents = [];

      grades.forEach((grade) => {
        if (grade.grade) {
          // TODO: Add recipients as students email instead of my testing account
          // recipients.push(`${ grade.studentId }@acsweb.ucsd.edu`);
          emailPromises.push(
            sendEmail(sp, {
              subject: `${ assignmentId } Grade`,
              body: `<pre style="font-size: 12px;"><b>Grade:</b> ${ grade.grade }\n` +
                `<b>Comments:</b> ${ grade.comment || '' }</pre>`,
              recipients
            })
          );
          gradedStudents.push(grade.studentId);
        } else {
          ungradedStudents.push(grade.studentId);
        }
      });

      Promise.all(emailPromises).then(() => {
        resolve({
          graded: gradedStudents,
          ungraded: ungradedStudents
        });
      });
    });
  });
}
