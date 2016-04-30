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
    graders: PropTypes.array
  }

  render() {
    const { repoId, assignmentId, graders } = this.props;

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
          </div>
        }
      </div>
    );
  }
}
