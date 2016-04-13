import React, { Component, PropTypes } from 'react';
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
    error: PropTypes.object,
    viewHeight: PropTypes.string.isRequired,
    assignmentId: PropTypes.string.isRequired,
    graderId: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { assignmentId, graderId, fileName } = this.props;

    this.props.load(socket.id, assignmentId, graderId, fileName);
  }

  createMarkup = () => {
    return { __html: this.props.output };
  }

  render() {
    const styles = require('./OutputContainer.scss');
    const { fileName, viewHeight } = this.props;

    return (
      <div className= { styles.outputContainer }>
        <h4>
          { fileName.replace(/\.[^/.]+$/, '') }
        </h4>
        <pre
          style={{ height: `${ viewHeight }vh` }}
          dangerouslySetInnerHTML={ this.createMarkup() }
        >
        </pre>
      </div>
    );
  }
}
