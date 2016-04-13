import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { command as sshCommand } from 'redux/modules/repo';

@connect(
  state => ({
    stdout: state.repo.stdout,
    loading: state.repo.loading,
    error: state.repo.error
  }), {
    sshCommand
  }
)
export default class FolderSelector extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    path: PropTypes.string.isRequired,
    error: PropTypes.object,
    stdout: PropTypes.string,
    sshCommand: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedFolder: PropTypes.string,
    folderDisabled: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      selectedPath: this.props.path,
      selectedFolder: this.props.selectedFolder
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

    this.setState({ selectedPath: newPath });
    this.getDirectories(newPath);
  }

  open = () => {
    this.setState({ showModal: true });
    this.getDirectories(this.state.selectedPath);
  }

  close = () => {
    this.setState({ selectedPath: this.props.path, showModal: false });
  }

  save = () => {
    const path = this.state.selectedPath;
    const selectedFolder = path.match(/.*\/(.+?)\/?$/)[1];

    this.props.onChange(path, selectedFolder);
    this.setState({ selectedFolder: selectedFolder, showModal: false });
  }

  handleClick = (event) => {
    event.preventDefault();

    if (event.target.tagName === 'A') {
      this.changeDirectory(event.target.text);
    }
  }

  render() {
    const { error, loading, stdout, folderDisabled } = this.props;
    const { selectedPath, showModal, selectedFolder } = this.state;
    const files = stdout && stdout.split('\n');

    return (
      <div>
        <div className="input-group">
          {
            folderDisabled ||
            <span className="input-group-btn">
              <Button
                className="btn btn-primary"
                onClick={ this.open }
              >
                Select Folder
              </Button>
            </span>
          }
          <input
            type="text"
            className="form-control"
            value={ selectedFolder }
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
            {
              error && <h4>{ error.message }</h4> ||

              <FileList
                loading={ loading }
                selectedPath={ selectedPath }
                files={ files }
                handleClick={ this.handleClick }
              />
            }
          </Modal.Body>
          <Modal.Footer>
            {
              !error &&
              <Button className="btn btn-primary" onClick={this.save}>
                Select Folder
              </Button>
            }
            <Button className="btn btn-primary" onClick={this.close}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function FileList({loading, selectedPath, files, handleClick}) {
  return (
    <div>
      <h4>{ selectedPath }</h4>
      {
        loading && <i className="fa fa-spinner fa-pulse" /> ||

        <ul className="list-inline" onClick={ handleClick }>
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
    </div>
  );
}
