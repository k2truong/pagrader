import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { AssignmentForm, SSHLoginForm, AssignmentList } from 'components';
import { create, loadList } from 'redux/modules/assignment';
import { routeActions } from 'react-router-redux';

@connect(
  state => ({
    repo: state.repo.repo,
    assignment: state.assignment.assignment,
    loading: state.assignment.loading,
    error: state.repo.error
  }), {
    create,
    loadList,
    pushState: routeActions.push
  }
)
export default class Repo extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool,
    params: PropTypes.object.isRequired,
    loadList: PropTypes.func.isRequired,
    assignment: PropTypes.object,
    repo: PropTypes.object,
    pushState: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.loadList(this.props.params.repoId);
  }

  componentWillReceiveProps(nextProps) {
    const currentAssignment = this.props.assignment;
    const nextAssignment = nextProps.assignment;

    if (!currentAssignment && nextAssignment ||
        (nextAssignment && nextAssignment.name !== currentAssignment.name)) {
      // Created new assignment so we run the script and go to assignment page
      this.props.pushState(`/repo/${ nextAssignment.repo }/${ nextAssignment.name }`);
    }
  }

  handleSubmit = (data) => {
    this.props.create(data);
  }

  render() {
    const styles = require('./Repo.scss');
    const { repoId } = this.props.params;
    const { repo, error, loading } = this.props;

    return (
      <div className={styles.repoPage}>
        <Helmet title="Repo"/>
        <div className="container">
          { repo && repo.username === repoId &&
            <div>
              <h2>
                { repoId }
              </h2>
              <div className="row">
                <div className="col-lg-8">
                  <AssignmentList />
                </div>
                <div className="col-lg-4">
                  <AssignmentForm
                    repo={ repo }
                    error={ error }
                    loading={ loading }
                    submitText="+New Assignment"
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
