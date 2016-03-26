import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { PAForm } from 'components';
import { connect } from 'react-redux';
import { connect as sshConnect } from 'redux/modules/repo';
// import { isLoaded, load } from 'redux/modules/repo';
// import { connect } from 'react-redux';

// @asyncConnect([{
//   promise: (options) => {
//     const { store: {dispatch, getState} } = options;
//     if (!isLoaded(getState())) {
//       return dispatch(load());
//     }
//   }
// }])

@connect(
  state => ({
    error: state.repo.error,
    repo: state.repo.repo,
    loading: state.repo.loading
  }), {
    sshConnect
  }
)
export default class Repo extends Component {
  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool,
    params: PropTypes.object.isRequired,
    repo: PropTypes.object,
    sshConnect: PropTypes.func.isRequired
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.props.loading) {
      const username = this.refs.username;
      const password = this.refs.password;

      this.props.sshConnect({
        username: username.value,
        password: password.value,
        socketId: socket.id
      });
      password.value = '';
    }
  }

  render() {
    const styles = require('./Repo.scss');
    const { repoID } = this.props.params;
    const { repo, error, loading } = this.props;

    return (
      <div className={styles.repoPage}>
        <Helmet title="Repo"/>
        <div className="container">
          { repo &&
            <div>
              <h3>
                {repoID}
              </h3>
              <div className="col-lg-8"></div>
              <div className="col-lg-4">
                <PAForm />
              </div>
            </div> ||
            // Add SSH Login Form
            <div className={styles.card + ' text-center'}>
              <h1>SSH Login</h1>
              {error &&
                <span>{error.message}</span>
              }
              <div>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input type="text" ref="username" value={repoID} disabled placeholder="Username or email" className="form-control"/>
                  </div>
                  <div className="form-group">
                    <input type="password" ref="password" placeholder="Password" className="form-control"/>
                  </div>
                  <button
                    className={(loading ? 'disabled ' : '') + 'btn btn-block btn-primary'}
                    onClick={this.handleSubmit}
                  >
                    Log In
                  </button>
                </form>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
