import React, { Component, PropTypes } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class GraderForm extends Component {
  static propTypes = {
    bonus: PropTypes.bool,
    comment: PropTypes.string,
    grade: PropTypes.string,
    onSave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      bonus: props.bonus,
      comment: props.comment,
      grade: props.grade
    };
  }

  getHelpTooltip() {
    return (<Tooltip id="bonusTooltip">
      True if student has submitted assignment before bonus date.
    </Tooltip>);
  }

  handleChange = (event) => {
    event.preventDefault();
    this.dirty = true;
  }

  handleBlur = (event) => {
    event.preventDefault();
    if (this.dirty) {
      const { grade, comment } = this.refs;
      this.props.onSave(grade.value, comment.value);
      this.dirty = false;
    }
  }

  render() {
    const { bonus, comment, grade } = this.props;

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
            <input type="text" ref="grade" className="form-control" defaultValue={ grade } />
          </div>

          <div className="form-group">
            <label>Comments:</label>
            <textarea ref="comment" rows="20" className="form-control" defaultValue={ comment } />
          </div>
        </form>
      </div>
    );
  }
}
