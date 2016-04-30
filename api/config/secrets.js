module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://localhost/react-dev-webkit',

  session: process.env.SESSION_SECRET || 'Your session secret goes here',

  sshTestInfo: process.env.SSH_TEST_INFO
};
