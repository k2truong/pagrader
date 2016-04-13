import React, { Component, PropTypes } from 'react';
import { connect} from 'react-redux';
import { connect as sshConnect } from 'redux/modules/repo';
import { destroy } from 'redux/modules/repo';

@connect(
  state => ({
    loading: state.repo.loading,
    error: state.repo.error
  }), {
    sshConnect,
    destroy
  })
export default class SSHLoginForm extends Component {
  static propTypes = {
    sshConnect: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.object,
    repoId: PropTypes.string,
    destroy: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.destroy();
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
    const styles = require('./LoginForm.scss');
    const { error, loading, repoId } = this.props;
    // const { repoID } = this.props.params;

    return (
      // TODO: Move to own component
      <div className={styles.card + ' text-center'}>
        <h1>SSH Login</h1>
        {error &&
          <span>{error.message}</span>
        }
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" ref="username" value={ repoId } disabled placeholder="Username or email" className="form-control"/>
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
    );
  }
}
