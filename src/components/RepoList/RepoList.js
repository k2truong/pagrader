import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

@connect(
  state => ({
    repos: state.repo.repos,
    error: state.repo.error
  }), {}
)
export default class RepoList extends Component {
  static propTypes = {
    repos: PropTypes.array,
    error: PropTypes.object
  }

  render() {
    const { repos } = this.props;

    return (
      <div>
        { repos && repos.length &&
          repos.map((repo) =>
            <div key={repo.username}>
              <LinkContainer to={`/repo/${repo.username}`}>
                <a >{repo.username} | {repo.description}</a>
              </LinkContainer>
            </div>
          ) ||
          <h1>No repositories added yet!</h1>
        }
      </div>
    );
  }
}
