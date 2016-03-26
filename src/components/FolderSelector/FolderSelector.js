import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { command as sshCommand, savePath } from 'redux/modules/repo';
// import { routeActions } from 'react-router-redux';

@connect(
  state => ({
    stdout: state.repo.stdout,
    path: state.repo.repo.path,
    loading: state.repo.loading
  }), {
    sshCommand,
    savePath
  }
)
export default class FolderSelector extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    path: PropTypes.string,
    stdout: PropTypes.string,
    sshCommand: PropTypes.func.isRequired,
    savePath: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      selectedPath: this.props.path,
      folderSelected: false
    };
  }

  /**
   * Show the directories for the given path
   */
  getDirectories(path) {
    this.props.sshCommand({
      socketId: socket.id,
      command: `cd ${path}; ls -d */`
    });
  }

  getHelpTooltip() {
    return (
      <Tooltip id="folderTooltip">
        This is the folder that contains the programming assignments
        to run the scripts on (i.e../GRADERS/PA1)
      </Tooltip>
    );
  }

  changeDirectory(dir) {
    const path = this.state.selectedPath;

    let newPath;
    if (dir === '..') {
      // if dir is .. we should remove the last directory to go up a directory
      newPath = path.replace(/(\/+.*)(?=\/.*).*$|(\/).*/, '$1$2');
    } else {
      newPath = (path.charAt(path.length - 1) === '/') ? path + dir : path + '/' + dir;
    }

    this.setState({
      ...this.state,
      selectedPath: newPath
    });
    this.getDirectories(newPath);
  }

  open = () => {
    this.setState({ ...this.state, showModal: true });
    this.getDirectories(this.state.selectedPath);
  }

  close = () => {
    this.setState({ ...this.state, selectedPath: this.props.path, showModal: false });
  }

  save = () => {
    this.props.savePath(this.state.selectedPath);
    this.setState({
      ...this.state,
      folderSelected: true,
      showModal: false
    });
  }

  handleClick = (event) => {
    event.preventDefault();

    if (event.target.tagName === 'A') {
      this.changeDirectory(event.target.text);
    }
  }

  render() {
    const { loading, stdout, path } = this.props;
    const { selectedPath, showModal, folderSelected } = this.state;
    const files = stdout && stdout.split('\n');

    return (
      <div>
        <div className="input-group">
          <span className="input-group-btn">
            <button className="btn btn-primary" onClick={ this.open }>Select Folder</button>
          </span>
          <input
            type="text"
            className="form-control"
            value={ folderSelected ? path.match(/.*\/(.*$)/)[1] : '' }
            readOnly
          />
          <OverlayTrigger placement="bottom" overlay={this.getHelpTooltip()} >
            <span className="input-group-addon">
                <i className="fa fa-question-circle" rel="help"></i>
            </span>
          </OverlayTrigger>
        </div>
        <Modal show={ showModal } onHide={ this.close }>
          <Modal.Header closeButton>
            <Modal.Title>
              Select Folder
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>
              { selectedPath }
            </h4>
            { loading &&
              <i className="fa fa-spinner fa-pulse" />
            }
            { !loading &&
              <ul className="list-inline" onClick={ this.handleClick }>
                { selectedPath !== '/' &&
                  <li><a href="#">..</a></li>
                }
                { files && files.length &&
                  files.map((file) =>
                    <li key={ file }>
                      <a href="#">
                        { file }
                      </a>
                    </li>
                  )
                }
              </ul>
            }
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={this.save}>
              Select Folder
            </button>
            <button className="btn btn-primary" onClick={this.close}>
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
