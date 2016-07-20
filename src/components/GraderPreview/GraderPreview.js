import React, { Component, PropTypes } from 'react';
import { Modal, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

export default class GraderPreview extends Component {
  static propTypes = {
    students: PropTypes.array,
    warnings: PropTypes.string,
    submitted: PropTypes.bool,
    submitting: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  getEmailTooltip() {
    return (<Tooltip id="bbcEmail">
      This is the email that should be BCC for a copy. (Hidden from the student)
    </Tooltip>);
  }

  getVerificationTooltip() {
    return (<Tooltip id="verificationTooltip">
      This will email only you and Susan for her to verify grades first.
    </Tooltip>);
  }

  handleSubmit = () => {
    const bbcEmail = this.refs.bbcEmail.value;
    if (!bbcEmail) {
      alert('Please add an email to bcc to get a copy');
    } else if (confirm('Are you sure you want to email the students and Susan these grades?')) {
      const verification = false;
      this.props.onSubmit(verification, bbcEmail);
    }
  }

  handleVerification = () => {
    const bbcEmail = this.refs.bbcEmail.value;
    if (!bbcEmail) {
      alert('Please add an email to bcc to get a copy');
    } else if (confirm('Are you sure you want to email Susan these grades for verification?')) {
      const verification = true;
      this.props.onSubmit(verification, bbcEmail);
    }
  }

  render() {
    const { onClose, submitting, students, warnings } = this.props;

    return (
      <Modal show onHide={ onClose }>
        <Modal.Header closeButton>
          <b>Preview</b>
        </Modal.Header>
        <Modal.Body>
          {
            students &&
            students.map((student) => (
              <pre key={ student.studentId }>
                <b style={{ color: student.grade ? '' : 'red' }}>
                  { student.studentId }
                </b>
                <br />
                <b>Grade:</b> { student.grade }<br />
                { student.bonus && '+1 Early turn-in bonus\n' }
                <b>Errors:</b><br />
                {
                  student.errorList || ''
                }
                <br />
                <b>Comments:</b><br />
                {
                  student.comment || ''
                }
                <br /><br />
                <b>*WARNINGS*</b><br />
                Note: These warnings may not apply to you but keep them in mind for future reference.<br />
                { warnings }
              </pre>
            ))
          }
        </Modal.Body>
        <Modal.Footer>
          <div className="form-group">
            <label>BCC Email:</label>
            <div className="input-group">
              <input ref="bbcEmail" type="text" className="form-control"/>
              <OverlayTrigger placement="bottom" overlay={ this.getEmailTooltip() }>
                <span className="input-group-addon">
                    <i className="fa fa-question-circle" rel="help"></i>
                </span>
              </OverlayTrigger>
            </div>
          </div>
          {
            submitting &&
            <i className="fa fa-spinner fa-pulse" style={{ marginRight: 10 }}/>
          }
          <Button className="btn btn-secondary" onClick={ onClose }>
            Close
          </Button>
          <button
            disabled={ submitting }
            className="btn btn-primary"
            onClick={ this.handleSubmit }
          >
            Submit Grades
          </button>
          <OverlayTrigger placement="bottom" overlay={ this.getVerificationTooltip() }>
            <button
              disabled={ submitting }
              className="btn btn-primary"
              onClick={ this.handleVerification }
            >
              Verify Grades
            </button>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>
    );
  }
}
