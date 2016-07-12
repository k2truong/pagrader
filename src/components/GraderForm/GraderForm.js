import React, { Component, PropTypes } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class GraderForm extends Component {
  static propTypes = {
    studentId: PropTypes.string,
    bonus: PropTypes.bool,
    comment: PropTypes.string,
    errors: PropTypes.string,
    grade: PropTypes.string,
    paguide: PropTypes.string,
    onSave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      dirty: false,
      comment: props.comment,
      grade: props.grade,
      errors: props.errors
    };
  }

  componentWillReceiveProps(nextProps) {
    // New student so we should swap the comments and grades to new student
    if (this.props.studentId !== nextProps.studentId) {
      this.setState({
        comment: nextProps.comment,
        grade: nextProps.grade,
        errors: nextProps.errors
      });
    }
  }

  getHelpTooltip() {
    return (<Tooltip id="bonusTooltip">
      True if student has submitted assignment before bonus date.
    </Tooltip>);
  }

  handleChange = (event) => {
    event.preventDefault();

    this.setState({
      dirty: true
    });
  }

  handleInputChange = (event) => {
    event.preventDefault();

    this.setState({
      [event.target.name]: event.target.value
    });
  }


  addError = (event) => {
    event.preventDefault();

    const { grade, comment } = this.state;
    const { errorList } = this.refs;
    let { errors = '' } = this.state;

    errors = errors.trim();
    errors = `${ errors }${ errors ? '\n' : '' }${ errorList.value }`;

    errorList.value = '';
    this.props.onSave(grade, comment, errors);

    this.setState({
      dirty: false,
      errors
    });
  }

  handleBlur = (event) => {
    event.preventDefault();

    if (this.state.dirty) {
      const { grade, comment, errors } = this.state;

      this.props.onSave(grade, comment, errors);

      this.setState({
        dirty: false
      });
    }
  }

  render() {
    const { bonus, paguide } = this.props;
    const { comment, grade, errors } = this.state;

    return (
      <div>
        <form className="" onBlur={ this.handleBlur } onChange={ this.handleChange }>
          <div className="form-group">
            <label>Bonus:</label>
            <div className="input-group">
              <input type="text" value={ bonus } className="form-control" readOnly />
              <OverlayTrigger placement="bottom" overlay={ this.getHelpTooltip() }>
                <span className="input-group-addon">
                    <i className="fa fa-question-circle" rel="help"></i>
                </span>
              </OverlayTrigger>
            </div>
          </div>
          <div className="form-group">
            <label>Grade:</label>
            <input
              name="grade"
              type="text"
              className="form-control"
              value={ grade || '' }
              onChange={ this.handleInputChange }
            />
          </div>
          <div className="form-group">
            <label>Errors:</label>
            <div className="input-group form-group">
              <input list="errors" className="form-control" ref="errorList"/>
              <span className="input-group-btn">
                <button
                  className="btn btn-primary"
                  style={ { marginLeft: '10px' } }
                  onClick={ this.addError }
                >
                   <i className="fa fa-plus"></i>
                </button>
              </span>
              <datalist id="errors">
                {
                  paguide && paguide.split('\n').map((error, idx) =>
                    <option key={ idx } value={ error } />
                  )
                }
              </datalist>
            </div>
            <textarea
              rows="5"
              name="errors"
              className="form-control"
              style={ { color: 'red' } }
              value={ errors || '' }
              onChange={ this.handleInputChange }
            />
          </div>
          <div className="form-group">
            <label>Comments:</label>
            <textarea
              rows="10"
              name="comment"
              className="form-control"
              value={ comment || '' }
              onChange={ this.handleInputChange }
            />
          </div>
        </form>
      </div>
    );
  }
}
