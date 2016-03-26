import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { signup, destroy } from 'redux/modules/auth';

@connect(
  state => ({
    error: state.auth.error,
    loading: state.auth.loading,
    user: state.auth.user
  }), {
    signup,
    destroy
  })
export default class Signup extends Component {
  static propTypes = {
    destroy: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    signup: PropTypes.func.isRequired,
    user: PropTypes.object
  }

  componentWillUnmount() {
    this.props.destroy();
  }

  handleSubmit = (event) => {
    if (!this.props.loading) {
      event.preventDefault();

      const username = this.refs.username;
      const password = this.refs.password;

      this.props.signup({
        username: username.value,
        password: password.value
      });
      password.value = '';
    }
  }

  render() {
    const {error, loading} = this.props;
    const styles = require('./Signup.scss');
    return (
      <div className={styles.signupPage + ' container'}>
        <Helmet title="Sign Up"/>
        <div className={styles.card + ' text-center'}>
          <h1>Sign Up</h1>
          {error &&
            <p>{error.message}</p>
          }
          <div>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="text" ref="username" placeholder="Pick a username" className="form-control"/>
              </div>
              <div className="form-group">
                <input type="password" ref="password" placeholder="Create a password" className="form-control"/>
              </div>
              <button
                className={(loading ? 'disabled ' : '') + 'btn btn-block btn-primary'}
                onClick={this.handleSubmit}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
