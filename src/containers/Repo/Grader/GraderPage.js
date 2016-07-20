import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { OutputContainer, GraderForm, SSHLoginForm, GraderPreview } from 'components';
import { isLoaded, load, save, submit, update, destroy, complete } from 'redux/modules/grade';
import { isLoaded as isAssignmentLoaded, load as loadAssignment,
         destroy as destroyAssignment } from 'redux/modules/assignment';
import { asyncConnect } from 'redux-async-connect';

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
    submitting: state.grade.submitting,
    submitted: state.grade.submitted,
    warnings: state.assignment.assignment.warnings,
    paguide: state.assignment.assignment.paguide,
    error: state.grade.error
  }), {
    save,
    submit,
    destroy,
    complete,
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
    submitting: PropTypes.bool,
    submitted: PropTypes.bool,
    complete: PropTypes.func.isRequired,
    destroyAssignment: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { students } = props;
    this.state = {
      showPreview: false,
      currentStudent: students && students.length ? students[0] : null,
      studentIndex: 0,
      showOutput: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.submitted && nextProps.submitted) {
      alert('Emails successfully sent!');
      this.props.complete();
    }
  }

  componentWillUnmount() {
    this.props.destroy();
    this.props.destroyAssignment();
  }

  handleClose = () => {
    this.setState({ showPreview: false });
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

  handlePreview = (event) => {
    event.preventDefault();

    this.setState({
      showPreview: true
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

  handleSubmit = (verification, bbcEmail) => {
    const { warnings, params, students } = this.props;
    const { assignmentId, repoId, graderId } = params;

    const missingStudents = students && students.reduce((currentVal, student) => {
      if (student.grade) {
        return currentVal;
      }
      return (currentVal ? currentVal + ', ' : '') + student.studentId;
    }, '');

    if (!missingStudents) {
      this.props.submit({
        verification,
        bbcEmail,
        assignmentId,
        graderId,
        repoId,
        warnings
      });
    } else {
      alert(`Please finish grading all students before submitting!\n\n` +
        `Missing students:\n${ missingStudents }`);
    }
  }

  renderOutput() {
    const { assignmentId, graderId } = this.props.params;
    const { currentStudent, showOutput } = this.state;

    // Determine if we should show the student's code or output
    const fileName = currentStudent && currentStudent.studentId + (showOutput ? '.out.html' : '.txt');

    return (
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
    );
  }

  renderForm() {
    const { currentStudent } = this.state;
    const { students, paguide } = this.props;

    return (
      <div className="row">
        <div className="col-sm-10">
          <GraderForm
            paguide={ paguide }
            studentId={ currentStudent.studentId }
            bonus={ currentStudent.bonus }
            comment={ currentStudent.comment }
            errors={ currentStudent.errorList }
            grade={ currentStudent.grade }
            onSave={ this.handleSave }
          />
          <button
            className="btn btn-primary"
            onClick={ this.handlePreview }
          >
            Submit / Preview
          </button>
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
    );
  }

  renderPage() {
    const { currentStudent, showPreview } = this.state;
    const { students, warnings, submitting, submitted } = this.props;

    return (
      <div className="row">
        { this.renderOutput() }

        <div className="col-lg-5">
          <div className="row">
            <div className="col-lg-12">
              <h3 style={ { fontWeight: 'bold', color: '#1371D1' } }>
                { currentStudent.studentId }
              </h3>
            </div>
          </div>
          { this.renderForm() }
        </div>
        {
          showPreview &&
          <GraderPreview
            students={ students }
            warnings={ warnings }
            submitting={ submitting }
            submitted={ submitted }
            onClose={ this.handleClose }
            onSubmit={ this.handleSubmit }
          />
        }
      </div>
    );
  }

  render() {
    const { assignmentId, repoId } = this.props.params;
    const { error, repo } = this.props;

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
            this.renderPage()
            || <SSHLoginForm repoId={ repoId } />
          }
        </div>
      </div>
    );
  }
}

