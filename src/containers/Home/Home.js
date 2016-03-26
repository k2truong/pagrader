import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { RepoForm, RepoList } from 'components';
import { asyncConnect } from 'redux-async-connect';
import { isLoaded, load } from 'redux/modules/repo';

@asyncConnect([{
  promise: (options) => {
    const { store: {dispatch, getState} } = options;

    if (!isLoaded(getState())) {
      return dispatch(load());
    }
  }
}])
export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className="container">
          <div className="col-lg-9">
            <RepoList />
          </div>
          <div className="col-lg-3">
            <RepoForm />
          </div>
        </div>
      </div>
    );
  }
}
