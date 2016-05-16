import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { OutputContainer, GraderForm, SSHLoginForm } from 'components';
import { isLoaded, load, save, submit, update, destroy } from 'redux/modules/grade';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: (options) => {
    const { store: { dispatch, getState }, params: { repoId, assignmentId, graderId } } = options;

    if (!isLoaded(getState(), repoId, assignmentId)) {
      return dispatch(load(repoId, assignmentId, graderId));
    }
  }
}])
@connect(
  state => ({
    repo: state.repo.repo,
    students: state.grade.students,
    error: state.grade.error
  }), {
    save,
    submit,
    destroy,
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
    update: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired
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
  }

  handleChange = (event) => {
    event.preventDefault();

    const { students } = this.props;
    const studentIndex = this.refs.student.value;

    this.setState({
      currentStudent: students[studentIndex],
      studentIndex
    });
  }

  handleSave = (grade, comment) => {
    const { assignmentId, repoId } = this.props.params;
    const { currentStudent, studentIndex } = this.state;

    this.props.save({
      assignment: assignmentId,
      repo: repoId,
      studentId: currentStudent.studentId,
      grade: grade,
      comment: comment
    });

    this.props.update(studentIndex, {
      ...currentStudent,
      grade: grade,
      comment: comment
    });
  }

  handleClick = () => {
    this.setState({
      showOutput: !this.state.showOutput
    });
  }

  handleSubmit = () => {
    if (confirm('Are you sure you want to email the students and Susan these grades?')) {
      const { assignmentId, repoId, graderId } = this.props.params;

      this.props.submit({
        assignmentId,
        graderId,
        repoId
      });
    }
  }

  render() {
    const { assignmentId, repoId, graderId } = this.props.params;
    const { currentStudent, showOutput } = this.state;
    const { error, repo, students } = this.props;

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
                <div className="row">
                  <div className="col-lg-12">
                    <OutputContainer
                      viewHeight="35"
                      multireducerKey="correctOutput"
                      assignmentId={ assignmentId }
                      graderId={ graderId }
                      fileName="output.txt"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <OutputContainer
                      viewHeight="35"
                      multireducerKey="studentOutput"
                      assignmentId={ assignmentId }
                      graderId={ graderId }
                      fileName={ `${ fileName }`}
                    />
                    <button className="btn btn-primary" onClick={this.handleClick}>
                      { showOutput ? 'Display Code' : 'Display Output'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <select
                  ref="student"
                  style={{ margin: '20px 20px 10px 0', fontSize: '20px' }}
                  onChange={ this.handleChange }
                >
                  {
                    students.map((student, studentIndex) =>
                      <option key={ student.studentId } value={ studentIndex }>{ student.studentId }</option>
                    )
                  }
                </select>

                <button className="btn btn-primary" onClick={this.handleSubmit}>
                  Submit Grades
                </button>

                <GraderForm
                  studentId={ currentStudent.studentId }
                  bonus={ currentStudent.bonus }
                  comment={ currentStudent.comment }
                  grade={ currentStudent.grade }
                  onSave={ this.handleSave }
                />
              </div>
            </div> ||
            <SSHLoginForm repoId={ repoId } />
          }
        </div>
      </div>
    );
  }
}
