import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { create } from 'redux/modules/repo';
import { routeActions } from 'react-router-redux';

@connect(
  state => ({
    repo: state.repo.repo,
    error: state.repo.error
  }), {
    create,
    pushState: routeActions.push
  }
)
export default class RepoForm extends Component {

  static propTypes = {
    create: PropTypes.func.isRequired,
    error: PropTypes.object,
    repo: PropTypes.object,
    pushState: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && nextProps.repo) {
      // Created new repo
      this.props.pushState('/repo/' + nextProps.repo.username);
    }
  }

  getHelpTooltip() {
    return <Tooltip id="sshTooltip">This is the tutor account on ieng6 where the assignments are stored. (i.e cs11u5) </Tooltip>;
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { sshusername: username, sshpass: password, description } = this.refs;
    this.props.create({
      username: username.value,
      password: password.value,
      description: description.value
    });
    password.value = '';
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group input-group">
            <input type="text" ref="sshusername" placeholder="SSH Username" className="form-control"/>

            <OverlayTrigger placement="bottom" overlay={this.getHelpTooltip()} >
              <span className="input-group-addon">
                  <i className="fa fa-question-circle" rel="help"></i>
              </span>
            </OverlayTrigger>
        </div>
        <div className="form-group">
          <input type="password" ref="sshpass" placeholder="SSH Password" className="form-control"/>
        </div>
        <div className="form-group">
          <input
            type="text" ref="description" placeholder="Repository Name/Description" className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="language-c" className="radio-inline">
            <input type="radio" id="language-c" name="language" value="c"/>C (CSE5)
          </label>
          <label htmlFor="language-java" className="radio-inline">
            <input type="radio" id="language-java" name="language" value="java"/>Java (CSE11)
          </label>
        </div>

        <button className="btn btn-block btn-primary">
          + New Repository
        </button>
      </form>
    );
  }
}
