import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { OutputContainer, GraderForm, SSHLoginForm } from 'components';
import { isLoaded, load, save, submit, update, destroy } from 'redux/modules/grade';
import { isLoaded as isAssignmentLoaded, load as loadAssignment,
         destroy as destroyAssignment } from 'redux/modules/assignment';
import { asyncConnect } from 'redux-async-connect';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

@asyncConnect([{
  promise: (options) => {
    const { store: { dispatch, getState }, params: { repoId, assignmentId, graderId } } = options;

    if (!isLoaded(getState(), repoId, assignmentId)) {
      return dispatch(load(repoId, assignmentId, graderId));
    }
  }
}, {
  promise: (options) => {
    const { store: { dispatch, getState }, params: { repoId, assignmentId } } = options;

    if (!isAssignmentLoaded(getState())) {
      return dispatch(loadAssignment(repoId, assignmentId));
    }
  }
}])
@connect(
  state => ({
    repo: state.repo.repo,
    students: state.grade.students,
    warnings: state.assignment.assignment.warnings,
    paguide: state.assignment.assignment.paguide,
    error: state.grade.error
  }), {
    save,
    submit,
    destroy,
    destroyAssignment,
    update
  }
)
export default class GraderPage extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    students: PropTypes.array,
    repo: PropTypes.object,
    save: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    error: PropTypes.object,
    warnings: PropTypes.string,
    paguide: PropTypes.string,
    update: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
    destroyAssignment: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { students } = props;
    this.state = {
      currentStudent: students && students.length ? students[0] : null,
      studentIndex: 0,
      showOutput: true
    };
  }

  componentWillUnmount() {
    this.props.destroy();
    this.props.destroyAssignment();
  }


  getEmailTooltip() {
    return (<Tooltip id="bbcEmail">
      This is the email that should be bcc'd for a copy. (Hidden from the student)
    </Tooltip>);
  }

  getVerificationTooltip() {
    return (<Tooltip id="verificationTooltip">
      This will email only you and Susan for her to verify grades first.
    </Tooltip>);
  }

  handleChange = (event) => {
    event.preventDefault();

    const { students } = this.props;
    const studentIndex = +this.refs.student.value;

    this.setState({
      currentStudent: students[studentIndex],
      showOutput: true,
      studentIndex
    });
  }

  handleSave = (grade, comment, errors) => {
    const { assignmentId, repoId } = this.props.params;
    const { currentStudent, studentIndex } = this.state;

    this.props.save({
      assignment: assignmentId,
      repo: repoId,
      studentId: currentStudent.studentId,
      grade: grade,
      comment: comment,
      errorList: errors
    });

    this.props.update(studentIndex, {
      ...currentStudent,
      grade: grade,
      comment: comment,
      errorList: errors
    });
  }

  handleClick = () => {
    this.setState({
      showOutput: !this.state.showOutput
    });
  }

  handleSubmit = () => {
    const bbcEmail = this.refs.bbcEmail.value;
    if (!bbcEmail) {
      alert('Please add an email to bcc to get a copy');
    } else if (confirm('Are you sure you want to email the students and Susan these grades?')) {
      const { assignmentId, repoId, graderId } = this.props.params;

      this.props.submit({
        bbcEmail,
        assignmentId,
        graderId,
        repoId
      });
    }
  }

  handleVerification = () => {
    const bbcEmail = this.refs.bbcEmail.value;
    if (!bbcEmail) {
      alert('Please add an email to bcc to get a copy');
    } else if (confirm('Are you sure you want to email Susan these grades for verification?')) {
      const { warnings, params } = this.props;
      const { assignmentId, repoId, graderId } = params;

      this.props.submit({
        verification: true,
        bbcEmail,
        assignmentId,
        graderId,
        repoId,
        warnings
      });
    }
  }

  render() {
    const { assignmentId, repoId, graderId } = this.props.params;
    const { currentStudent, showOutput } = this.state;
    const { error, repo, students, paguide } = this.props;

    // Determine if we should show the student's code or output
    const fileName = currentStudent && currentStudent.studentId + (showOutput ? '.out.html' : '.txt');

    return (
      <div>
        <Helmet title={ assignmentId }/>
        <div className="container">
          {
            error &&
            <h1 className="alert alert-danger">
              Error: { error.message }
            </h1> ||
            // TODO: Need to add 404 page here if there is no currentStudent
            repo && repo.username === repoId &&
            <div className="row">
              <div className="col-lg-7">
                {
                  showOutput &&
                  <div className="row">
                    <div className="col-lg-12">
                      <OutputContainer
                        viewHeight="30"
                        multireducerKey="correctOutput"
                        assignmentId={ assignmentId }
                        graderId={ graderId }
                        fileName="output.txt"
                      />
                    </div>
                  </div>
                }
                <div className="row">
                  <div className="col-lg-12">
                    <OutputContainer
                      viewHeight={ showOutput ? '35' : '70' }
                      multireducerKey="studentOutput"
                      assignmentId={ assignmentId }
                      graderId={ graderId }
                      fileName={ `${ fileName }`}
                    />
                    <button className="btn btn-primary" onClick={ this.handleClick }>
                      { showOutput ? 'Display Code' : 'Display Output'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 style={ { fontWeight: 'bold', color: '#1371D1' } }>
                      { currentStudent.studentId }
                    </h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-10">
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

                    <div className="form-group">
                      <button
                        className="btn btn-primary"
                        onClick={ this.handleSubmit }
                        style={ { marginRight: '10px' } }
                      >
                        Submit Grades
                      </button>
                      <OverlayTrigger placement="bottom" overlay={ this.getVerificationTooltip() }>
                        <button className="btn btn-primary" onClick={ this.handleVerification }>
                          Verify Grades
                        </button>
                      </OverlayTrigger>
                    </div>

                    <GraderForm
                      paguide={ paguide }
                      studentId={ currentStudent.studentId }
                      bonus={ currentStudent.bonus }
                      comment={ currentStudent.comment }
                      errors={ currentStudent.errorList }
                      grade={ currentStudent.grade }
                      onSave={ this.handleSave }
                    />
                  </div>
                  <div className="col-sm-2">
                    <select
                      ref="student"
                      style={ { fontSize: '18px' } }
                      size="10"
                      defaultValue={ 0 }
                      onChange={ this.handleChange }
                    >
                      {
                        students.map((student, studentIndex) =>
                          <option
                            key={ studentIndex }
                            value={ studentIndex }
                          >
                            { student.studentId }
                          </option>
                        )
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div> ||
            <SSHLoginForm repoId={ repoId } />
          }
        </div>
      </div>
    );
  }
}
