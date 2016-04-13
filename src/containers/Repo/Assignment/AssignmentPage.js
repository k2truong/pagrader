import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { AssignmentForm, SSHLoginForm, GraderList, OutputContainer } from 'components';
import { asyncConnect } from 'redux-async-connect';
import { destroy, isLoaded, load, runScript, update, getGraders } from 'redux/modules/assignment';

@asyncConnect([{
  promise: (options) => {
    const { store: { dispatch, getState }, params: { repoId, assignmentId } } = options;

    if (!isLoaded(getState(), repoId, assignmentId)) {
      return dispatch(load(repoId, assignmentId));
    }
  }
}])
@connect(
  state => ({
    repo: state.repo.repo,
    assignment: state.assignment.assignment,
    hasChanged: state.assignment.hasChanged,
    samples: state.assignment.samples,
    loading: state.assignment.loading,
    error: state.assignment.error
  }), {
    runScript,
    destroy,
    getGraders,
    update
  }
)
export default class AssignmentPage extends Component {
  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool,
    params: PropTypes.object.isRequired,
    destroy: PropTypes.func.isRequired,
    assignment: PropTypes.object,
    repo: PropTypes.object,
    runScript: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    getGraders: PropTypes.func.isRequired,
    samples: PropTypes.array
  }

  componentWillMount() {
    if (this.props.repo) {
      this.props.getGraders(socket.id, this.props.params.assignmentId);
    }
  }

  componentWillReceiveProps(nextProps) {
    // We just logged into the repository so we can fetch from the SSH folder
    if (!this.props.repo && nextProps.repo) {
      this.props.getGraders(socket.id, this.props.params.assignmentId);
    }

    if (nextProps.hasChanged) {
      this.props.runScript({
        socketId: socket.id,
        assignment: this.props.assignment
      });
    }
  }

  componentWillUnmount() {
    this.props.destroy();
  }

  handleSubmit = (data) => {
    if (confirm('Are you sure you want to re-run the script?')) {
      this.props.update(data);
    }
  }

  render() {
    const { assignmentId, repoId } = this.props.params;
    const { assignment, error, repo, loading, samples } = this.props;

    return (
      <div>
        <Helmet title={ assignmentId } />
        <div className="container">
          { repo && repo.username === repoId &&
            <div>
              <h2>
                { repoId }
              </h2>
              <div className="row">
                <div className="col-lg-8">
                <GraderList
                  assignmentId={ assignmentId }
                  repoId={ repoId }
                  loading={ loading }
                />
                {
                  samples && samples.length &&
                  <div>
                    <h3>
                      Preview
                    </h3>
                    {
                      samples.map((sample) =>
                        <OutputContainer
                          key={ sample }
                          viewHeight="30"
                          multireducerKey="studentOutput"
                          assignmentId={ assignmentId }
                          graderId={ sample.split('/')[0] }
                          fileName={ sample.split('/')[1] }
                        />
                      )
                    }
                  </div> ||
                  <h1 className="text-center">
                    No assignments found! Please try running the script again
                    or make sure the repository path is correct!
                  </h1>
                }
                </div>
                <div className="col-lg-4">
                  <AssignmentForm
                    repo={ repo }
                    error={ error }
                    loading={ loading }
                    folderDisabled
                    assignment={ assignment }
                    submitText="Re-Run Script"
                    onSubmit={ this.handleSubmit }
                  />
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
