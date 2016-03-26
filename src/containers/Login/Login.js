import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { login, destroy } from 'redux/modules/auth';

@connect(
  state => ({
    error: state.auth.error,
    loading: state.auth.loading
  }), {
    login,
    destroy
  }
)
export default class Login extends Component {
  static propTypes = {
    destroy: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    login: PropTypes.func.isRequired,
    user: PropTypes.object
  }

  componentWillUnmount() {
    this.props.destroy();
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.props.loading) {
      const username = this.refs.username;
      const password = this.refs.password;

      this.props.login({
        username: username.value,
        password: password.value
      });
      password.value = '';
    }
  }

  render() {
    const {error, loading} = this.props;
    const styles = require('./Login.scss');

    return (
      <div className={styles.loginPage + ' container'}>
        <Helmet title="Login"/>
        <div className={styles.card + ' text-center'}>
          <h1>Log in</h1>
          {error &&
            <span>{error.message}</span>
          }
          <div>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="text" ref="username" placeholder="Username or email" className="form-control"/>
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
            <LinkContainer to="/signup">
              <a href="#">Forgot password?</a>
            </LinkContainer>
          </div>
        </div>
      </div>
    );
  }
}
