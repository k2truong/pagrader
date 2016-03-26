import passport from 'passport';

export default function login(req) {
  return new Promise((resolve, reject) => {
    passport.authenticate('login', (err, user, info) => {
      if (err) {
        reject({
          message: err
        });
      }

      if (!user) {
        reject({
          message: info.message,
          status: 403
        });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          reject({
            message: 'Issue logging in.'
          });
        }
        resolve(user);
      });
    })(req);
  });
}
