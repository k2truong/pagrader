import React, { Component, PropTypes } from 'react';
import { PrismCode } from 'react-prism';
import { connectMultireducer } from 'multireducer';
import { load } from 'redux/modules/output';

@connectMultireducer(
  (key, state) => ({
    loading: state.multireducer[key].loading,
    output: state.multireducer[key].output,
    error: state.multireducer[key].error
  }), {
    load
  }
)
export default class OutputContainer extends Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    output: PropTypes.string,
    loading: PropTypes.bool,
    language: PropTypes.string,
    error: PropTypes.object,
    viewHeight: PropTypes.string.isRequired,
    assignmentId: PropTypes.string.isRequired,
    graderId: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { assignmentId, graderId, fileName } = this.props;

    this.props.load(socket.id, assignmentId, graderId, fileName);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fileName !== nextProps.fileName) {
      const { assignmentId, graderId, fileName } = nextProps;

      this.props.load(socket.id, assignmentId, graderId, fileName);
    }
  }

  createMarkup = () => {
    // TODO: Fix this where the assignments we display can expose a vulnerability in their output
    return { __html: this.props.loading ? '' : this.props.output };
  }

  render() {
    const styles = require('./OutputContainer.scss');
    const { fileName, viewHeight, error, loading, language } = this.props;

    return (
      <div className= { styles.outputContainer }>
        { error &&
          <h1 className="alert alert-danger">{ error.message } "{ fileName }"</h1>
        }
        { !error &&
          <div>
            <h4>
              { fileName.replace(/\.[^\.]+$/, '') }
            </h4>
            { fileName.endsWith('txt') &&
              (
                language &&
                <pre className="line-numbers" style={{ height: `${ viewHeight }vh` }}>
                  <PrismCode className={ `language-${language}` }>
                    { !loading && this.props.output }
                  </PrismCode>
                </pre>
                ||
                <pre style={{ height: `${ viewHeight }vh` }}>
                    { !loading && this.props.output }
                </pre>
              )
              ||
              <pre
                style={{ height: `${ viewHeight }vh` }}
                dangerouslySetInnerHTML={ this.createMarkup() }
              >
              </pre>
            }
          </div>
        }
      </div>
    );
  }
}
