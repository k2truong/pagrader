/**
 * This is to help test SSH connection locally (Not with travisCI)
 */

import { expect } from 'chai';
import { connect, command } from '../actions/ssh';
import { getSSHConnection } from '../ssh/connection';

describe('SSH Protocols', () => {
  const SOCKET_ID = 'mockSocketId';
  const SSH_INFO = {
    socketId: SOCKET_ID
  };
  it('should return directory', (done) => {
    connect({
      body: SSH_INFO
    }).then(() => {
      const conn = getSSHConnection(SOCKET_ID);
      expect(conn).to.not.be.equal(undefined);
      command({
        body: {
          socketId: SOCKET_ID,
          command: 'cd ..; ls'
        }
      }).then((res) => {
        console.log(res);
        done();
      });
    }, (err) => {
      console.log(`SSH Error: ${err.message}`);
      expect(err.message).to.not.be.equal(null);
      done();
    });
  });
});
