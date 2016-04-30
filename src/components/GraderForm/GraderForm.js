import React, { Component, PropTypes } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class GraderForm extends Component {
  static propTypes = {
    studentId: PropTypes.string,
    bonus: PropTypes.bool,
    comment: PropTypes.string,
    grade: PropTypes.string,
    onSave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      dirty: false,
      comment: props.comment,
      grade: props.grade
    };
  }

  componentWillReceiveProps(nextProps) {
    // New student so we should swap the comments and grades to new student
    if (this.props.studentId !== nextProps.studentId) {
      this.setState({
        comment: nextProps.comment,
        grade: nextProps.grade
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

  handleGradeChange = (event) => {
    this.setState({
      grade: event.target.value
    });
  }

  handleCommentChange = (event) => {
    this.setState({
      comment: event.target.value
    });
  }

  handleBlur = (event) => {
    event.preventDefault();

    if (this.state.dirty) {
      const { grade, comment } = this.state;

      this.props.onSave(grade, comment);

      this.setState({
        dirty: false
      });
    }
  }

  render() {
    const { bonus } = this.props;
    const { comment, grade } = this.state;

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
              type="text"
              className="form-control"
              onChange={ this.handleGradeChange }
              value={ grade || '' }
            />
          </div>

          <div className="form-group">
            <label>Comments:</label>
            <textarea
              rows="20"
              className="form-control"
              onChange={ this.handleCommentChange }
              value={ comment || '' }
            />
          </div>
        </form>
      </div>
    );
  }
}
