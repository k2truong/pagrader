import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { save } from 'redux/modules/grade';

@connect(
  state => ({
    loading: state.grade.loading,
    // assignmentId: state.assignment.id,
  }), {
    save
  })
export default class GraderForm extends Component {
  static propTypes = {
    studentId: PropTypes.string,
    assignmentId: PropTypes.string,
    save: PropTypes.func.isRequired,
    loading: PropTypes.bool
  };

  getHelpTooltip() {
    return (<Tooltip id="bonusTooltip">
      True if student has submitted assignment before bonus date.
    </Tooltip>);
  }

  handleChange = () => {
    this.dirty = true;
  }

  handleBlur = () => {
    if (this.dirty) {
      const { grade, comment } = this.refs;
      const { assignmentId, studentId } = this.props;

      this.props.save({
        assignmentId: assignmentId,
        studentId: studentId,
        grade: grade,
        comment: comment
      });
    }
  }

  render() {
    return (
      <div>
        <form className="" onBlur={ this.handleBlur } onChange={ this.handleChange }>
          <div className="form-group">
            <label>Bonus:</label>
            <div className="input-group">
              <input type="text" value="True" className="form-control" readOnly />
              <OverlayTrigger placement="bottom" overlay={ this.getHelpTooltip() }>
                <span className="input-group-addon">
                    <i className="fa fa-question-circle" rel="help"></i>
                </span>
              </OverlayTrigger>
            </div>
          </div>
          <div className="form-group">
            <label>Grade:</label>
            <input type="text" ref="grade" className="form-control" />
          </div>

          <div className="form-group">
            <label>Comments:</label>
            <textarea ref="comment" rows="20" className="form-control" />
          </div>
        </form>
      </div>
    );
  }
}
