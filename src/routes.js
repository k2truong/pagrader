import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Home,
    Login,
    // Signup,
    Repo,
    AssignmentPage,
    GraderPage,
    NotFound,
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname }
        });
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={ App }>
      { /* Home (main) route */ }

      { /* Routes requiring login */ }
      <Route onEnter={ requireLogin }>
        { /* <Route path="signup" component={ Signup } /> */}
      </Route>
      <IndexRoute component={ Home } />
      <Route path="repo/:repoId" component={ Repo } />
      <Route path="repo/:repoId/:assignmentId" component={ AssignmentPage } />
      <Route path="repo/:repoId/:assignmentId/:graderId" component={ GraderPage } />

      { /* Routes */ }
      <Route path="login" component={ Login } />

      { /* Catch all route */ }
      <Route path="*" component={ NotFound } status={404} />
    </Route>
  );
};
