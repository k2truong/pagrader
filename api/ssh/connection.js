/**
 * Singleton to keep the SSH Connections alive with each connection
 */
const connections = {};

export function saveSSHConnection(socketId, connection) {
  connections[socketId] = connection;
}

export function getSSHConnection(socketId) {
  return connections[socketId];
}

export function closeSSHConnection(socketId) {
  if (connections[socketId] && connections[socketId].end) {
    connections[socketId].end();
  }
}
