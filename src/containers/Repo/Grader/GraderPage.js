import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { OutputContainer, GraderForm, SSHLoginForm } from 'components';

@connect(
  state => ({
    repo: state.repo.repo
  }), {
  }
)
export default class GraderPage extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    repo: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      studentId: 'cs5waa'
    };
  }

  render() {
    const { assignmentId, repoId } = this.props.params;
    const { studentId } = this.state;
    const { repo } = this.props;

    return (
      <div>
        <Helmet title={ assignmentId }/>
        <div className="container">
          {
            repo && repo.username === repoId &&
            <div className="row">
              <div className="col-lg-7">
                <div className="row">
                  <div className="col-lg-12">
                    <OutputContainer
                      viewHeight="35"
                      multireducerKey="correctOutput"
                      fileName="output.html"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <OutputContainer
                      viewHeight="35"
                      multireducerKey="studentOutput"
                      fileName={ `${ studentId }.out.html`}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <select style={{ margin: '10px 0', fontSize: '20px' }}>
                </select>
                <GraderForm studentId={ studentId } />
              </div>
            </div> ||
            <SSHLoginForm repoId={ repoId } />
          }
        </div>
      </div>
    );
  }
}
