import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { RepoForm, RepoList } from 'components';
import { asyncConnect } from 'redux-async-connect';
import { create, isLoaded, load, destroy } from 'redux/modules/repo';
import { routeActions } from 'react-router-redux';

@asyncConnect([{
  promise: (options) => {
    const { store: {dispatch, getState} } = options;

    if (!isLoaded(getState())) {
      return dispatch(load());
    }
  }
}])
@connect(
  state => ({
    repo: state.repo.repo,
    error: state.repo.error,
    loading: state.repo.loading
  }), {
    create,
    destroy,
    pushState: routeActions.push
  }
)
export default class Home extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    pushState: PropTypes.func.isRequired,
    repo: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    const currentRepo = this.props.repo;
    const nextRepo = nextProps.repo;

    if (!currentRepo && nextRepo ||
        (nextRepo && nextRepo.username !== currentRepo.username)) {
      // Created new repo
      this.props.pushState('/repo/' + nextRepo.username);
    }
  }

  componentWillUnmount() {
    this.props.destroy();
  }

  handleSubmit = (formData) => {
    this.props.create(formData);
  }

  render() {
    const styles = require('./Home.scss');
    const { error, loading } = this.props;

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <RepoList />
            </div>
            <div className="col-lg-3">
              <RepoForm
                onSubmit={ this.handleSubmit }
                error={ error }
                loading={ loading }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
