module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://localhost/react-dev-webkit',

  session: process.env.SESSION_SECRET || 'Your session secret goes here'
};
