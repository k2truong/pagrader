import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

@connect(
  state => ({
    assignments: state.assignment.assignments,
    repoId: state.repo.repo.username,
    error: state.assignment.error
  }), {}
)
export default class AssignmentList extends Component {
  static propTypes = {
    repoId: PropTypes.string.isRequired,
    assignments: PropTypes.array,
    error: PropTypes.object
  }

  render() {
    const { repoId, assignments } = this.props;

    return (
      <div>
        { assignments && assignments.length &&
          <div>
            <ul className="list-group">
              {
                assignments.map((assignment) =>
                  <LinkContainer key={assignment.name} to={`/repo/${ repoId }/${ assignment.name }`}>
                    <a className="list-group-item">
                      {assignment.name} --- {assignment.bonusDate || 'No bonus'}
                    </a>
                  </LinkContainer>
                )
              }
            </ul>
          </div> ||
          <h1>No assignments added yet!</h1>
        }
      </div>
    );
  }
}
