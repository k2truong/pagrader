import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { OutputContainer, GraderForm, SSHLoginForm } from 'components';
import { isLoaded, load, save, destroy } from 'redux/modules/grade';
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
    destroy
  }
)
export default class GraderPage extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    students: PropTypes.array,
    repo: PropTypes.object,
    save: PropTypes.func.isRequired,
    error: PropTypes.object,
    destroy: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const { students } = props;
    this.state = {
      currentStudent: students && students.length ? students[0] : null
    };
  }

  componentWillUnmount() {
    this.props.destroy();
  }

  handleChange = (event) => {
    event.preventDefault();

    const { students } = this.props;
    const { studentId } = this.refs;

    let studentIndex = 0;
    for (; studentIndex < students.length; studentIndex++) {
      if (students[studentIndex].studentId === studentId.value) {
        break;
      }
    }

    this.setState({
      currentStudent: students[studentIndex]
    });
  }

  handleSave = (grade, comment) => {
    const { assignmentId, repoId } = this.props.params;
    const { currentStudent } = this.state;

    this.props.save({
      assignment: assignmentId,
      repo: repoId,
      studentId: currentStudent.studentId,
      grade: grade,
      comment: comment
    });
  }

  render() {
    const { assignmentId, repoId, graderId } = this.props.params;
    const { currentStudent } = this.state;
    const { error, repo, students } = this.props;

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
                      fileName="output.html"
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
                      fileName={ `${ currentStudent.studentId }.out.html`}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <select
                  ref="studentId"
                  style={{ margin: '20px 0 10px 0', fontSize: '20px' }}
                  onChange={ this.handleChange }
                >
                  {
                    students.map((student) =>
                      <option key={ student.studentId }>{ student.studentId }</option>
                    )
                  }
                </select>
                <GraderForm
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
