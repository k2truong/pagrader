import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';

import auth from './auth';
import { reducer as form } from 'redux-form';
import repo from './repo';

export default combineReducers({
  routing: routeReducer,
  reduxAsyncConnect,
  repo,
  auth,
  form
});
