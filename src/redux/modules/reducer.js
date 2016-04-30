import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import multireducer from 'multireducer';

import auth from './auth';
import grade from './grade';
import repo from './repo';
import assignment from './assignment';
import output from './output';

export default combineReducers({
  routing: routeReducer,
  reduxAsyncConnect,
  repo,
  auth,
  grade,
  assignment,
  multireducer: multireducer({
    correctOutput: output,
    studentOutput: output
  })
});
