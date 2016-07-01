import React, { Component, PropTypes } from 'react';
import { FolderSelector } from 'components';
import moment from 'moment';
import DatePicker from 'react-bootstrap-datetimepicker';

export default class AssignmentForm extends Component {
  static propTypes = {
    bonusDate: PropTypes.string,
    error: PropTypes.object,
    input: PropTypes.string,
    assignment: PropTypes.object,
    folderDisabled: PropTypes.bool,
    repo: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string.isRequired,
    loading: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);

    if (props.assignment) {
      const { bonusDate, input, path } = props.assignment;

      this.state = {
        bonusDate,
        input,
        selectedPath: path,
        path,
        name: path.match(/.*\/(.+?)\/?$/)[1]
      };
    } else {
      this.state = {};
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleDateChange = (date) => {
    this.setState({
      bonusDate: moment(date, 'x').format('MM/DD/YY HH:mm')
    });
  }

  handlePathChange = (path, folder) => {
    this.setState({
      path: path,
      name: folder
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.onSubmit({
      ...this.state,
      repo: this.props.repo.username
    });
  }

  render() {
    const { error, submitText, folderDisabled, loading } = this.props;
    const { name, input, bonusDate, selectedPath } = this.state;
    const hasInvalidFields = !(name && input);

    return (
      <form onSubmit={ this.handleSubmit }>
        { error &&
          <div className="form-group">{ error.message }</div>
        }
        <div className="form-group">
          <FolderSelector
            folderDisabled={ folderDisabled }
            selectedFolder={ selectedPath && selectedPath.match(/.*\/(.+?)\/?$/)[1] }
            onChange={ this.handlePathChange }
            path={ selectedPath || this.props.repo.path }
          />
        </div>
        <div className="form-group">
          <textarea
            name="input"
            placeholder="Input"
            rows="6"
            className="form-control"
            onChange={ this.handleChange }
            defaultValue={ input }
          />
        </div>
        <div className="form-group">
          <DatePicker
            defaultText={ bonusDate || 'Bonus Date' }
            onChange={ this.handleDateChange }
          />
        </div>
        {
          // <div className="form-group">
          //   <textarea placeholder="PA Guide" rows="6" className="form-control" />
          // </div>
        }
        <button disabled={ hasInvalidFields || loading } className="btn btn-block btn-primary">
          { submitText }
        </button>
      </form>
    );
  }
}
