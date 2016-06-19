module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://localhost/react-dev-webkit',

  session: process.env.SESSION_SECRET || 'Your session secret goes here',

  sshServerInfo: process.env.SSH_SERVER_INFO || 'ieng6.ucsd.edu',

  sshTestInfo: process.env.SSH_TEST_INFO
};
