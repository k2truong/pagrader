import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar } from 'react-bootstrap';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { routeActions } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: (options) => {
    const { store: {dispatch, getState} } = options;
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    user: state.auth.user
  }), {
    logout,
    pushState: routeActions.push
  })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/login');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const { user } = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        { // user &&
          <Navbar fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
                  <div className={styles.brand}/>
                  <span>{config.app.title}</span>
                </IndexLink>
              </Navbar.Brand>
              <Navbar.Toggle/>
            </Navbar.Header>

            <Navbar.Collapse>
              <Nav navbar pullRight>
                {
                  user &&
                  <LinkContainer to="/signout">
                    <NavItem className="logout-link" onClick={this.handleLogout}>
                      Logout
                    </NavItem>
                  </LinkContainer>
                }
              </Nav>
              {/* <p className="navbar-text"><strong>{user.username}</strong></p> */}
            </Navbar.Collapse>
          </Navbar>
        }

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <div className={styles.appFooter + ' text-center'}>
          Have questions or see issues? Submit them <a
          href="https://github.com/k2truong/pagrader/issues"
          target="_blank">on Github</a> or email me at kenneth.e.truong@gmail.com.
        </div>
      </div>
    );
  }
}
