import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

@connect(
  state => ({
    graders: state.assignment.graders
  }), {}
)
export default class GraderList extends Component {
  static propTypes = {
    repoId: PropTypes.string.isRequired,
    assignmentId: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    graders: PropTypes.array
  }

  render() {
    const { repoId, assignmentId, graders, loading } = this.props;

    return (
      <div>
        { graders && graders.length &&
          <div>
            <ul className="list-group">
              {
                graders.map((grader) =>
                  <LinkContainer key={grader} to={`/repo/${ repoId }/${ assignmentId }/${ grader }`}>
                    <a className="list-group-item">{ grader }</a>
                  </LinkContainer>
                )
              }
            </ul>
          </div> ||
          (loading && <i className="fa fa-spinner fa-pulse" />)
        }
      </div>
    );
  }
}
