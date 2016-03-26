import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FolderSelector } from 'components';
import { create } from 'redux/modules/repo';
import { routeActions } from 'react-router-redux';
import DatePicker from 'react-datepicker';

@connect(
  state => ({
    repo: state.repo.repo,
    error: state.repo.error
  }), {
    create,
    pushState: routeActions.push
  }
)
export default class PAForm extends Component {

  static propTypes = {
    create: PropTypes.func.isRequired,
    error: PropTypes.object,
    repo: PropTypes.object,
    pushState: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      bonusDate: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && nextProps.repo) {
      // Created new repo
      this.props.pushState('/repo/' + nextProps.repo.username);
    }
  }

  handleChange = (date) => {
    this.setState({
      bonusDate: date
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    require('react-datepicker/dist/react-datepicker.css');
    // const styles = require('./RepoForm.scss');
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <FolderSelector />
        </div>
        <div className="form-group">
          <textarea placeholder="Input" rows="6" className="form-control" />
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon">
              <i className="glyphicon glyphicon-calendar"></i>
            </span>
            <DatePicker
              className="form-control"
              placeholderText="Bonus Date"
              popoverTargetOffset="45px 0"
              selected={ this.state.bonusDate }
              onChange={ this.handleChange }
            />
          </div>
        </div>
        <div className="form-group">
          <textarea placeholder="PA Guide" rows="6" className="form-control" />
        </div>
        <button className="btn btn-block btn-primary">
          + New PA
        </button>
      </form>
    );
  }
}
