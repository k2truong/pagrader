import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

@connect(
  state => ({
    repos: state.repo.repos,
  }), {}
)
export default class RepoList extends Component {
  static propTypes = {
    repos: PropTypes.array,
  }

  render() {
    const { repos } = this.props;

    return (
      <div>
        { repos && repos.length &&
          <div>
            <h1>Repositories</h1>
            <ul className="list-group">
              {
                repos.map((repo) =>
                  <LinkContainer key={repo.username} to={`/repo/${repo.username}`}>
                    <a className="list-group-item">{repo.username} | {repo.description}</a>
                  </LinkContainer>
                )
              }
            </ul>
          </div> ||
          <h1>No repositories added yet!</h1>
        }
      </div>
    );
  }
}
