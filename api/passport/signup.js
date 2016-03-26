import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user';
import bCrypt from 'bcryptjs';


// Generates hash using bCrypt
const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = (passport) => {
  passport.use('signup', new LocalStrategy({
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  (req, username, password, done) => {
    // find a user in Mongo with provided username
    User.findOne({ 'username': username }, (err, user) => {
      // In case of any error, return using the done method
      if (err) {
        console.log('Error in SignUp: ' + err);
        return done(err);
      }

      // already exists
      if (user) {
        return done(null, false, {message: 'User Already Exists'});
      }

      // if there is no user with that email
      // create the user
      const newUser = new User();

      // set the user's local credentials
      newUser.username = username;
      newUser.password = createHash(password);
      // newUser.email = req.params.email;

      // save the user
      newUser.save((saveErr) => {
        if (saveErr) {
          throw saveErr;
        }
        return done(null, newUser);
      });
    });
  }));
};
