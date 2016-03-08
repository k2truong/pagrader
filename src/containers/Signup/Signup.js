import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { signup, destroy } from 'redux/modules/auth';

@connect(
  state => ({
    user: state.auth.user,
    error: state.auth.error
  }), {
    signup,
    destroy
  })
export default class Signup extends Component {
  static propTypes = {
    destroy: PropTypes.func.isRequired,
    error: PropTypes.object,
    signup: PropTypes.func.isRequired,
    user: PropTypes.object
  }

  componentWillUnmount() {
    this.props.destroy();
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const username = this.refs.username;
    const password = this.refs.password;

    this.props.signup({
      username: username.value,
      password: password.value
    });
    password.value = '';
  }

  render() {
    const {error} = this.props;
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
            <form className="login-form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="text" ref="username" placeholder="Pick a username" className="form-control"/>
              </div>
              <div className="form-group">
                <input type="password" ref="password" placeholder="Create a password" className="form-control"/>
              </div>
              <button className="btn btn-lg btn-block btn-primary" onClick={this.handleSubmit}>
                <i className="fa fa-sign-in"/>{' '}Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
