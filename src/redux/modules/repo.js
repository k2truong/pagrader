export const CONNECT = 'pagrader/repo/CONNECT';
export const CONNECT_SUCCESS = 'pagrader/repo/CONNECT_SUCCESS';
export const CONNECT_FAIL = 'pagrader/repo/CONNECT_FAIL';
export const COMMAND = 'pagrader/repo/COMMAND';
export const COMMAND_SUCCESS = 'pagrader/repo/COMMAND_SUCCESS';
export const COMMAND_FAIL = 'pagrader/repo/COMMAND_FAIL';
export const LOAD = 'pagrader/repo/LOAD';
export const LOAD_SUCCESS = 'pagrader/repo/LOAD_SUCCESS';
export const LOAD_FAIL = 'pagrader/repo/LOAD_FAIL';
export const SAVE_PATH = 'pagrader/repo/SAVE_PATH';
export const DESTROY = 'pagrader/repo/DESTROY';

const initialState = {
  loaded: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        loading: true
      };
    case CONNECT_SUCCESS:
      return {
        ...state,
        repo: action.result,
        loading: false
      };
    case CONNECT_FAIL:
      return {
        ...state,
        repo: null,
        loading: false,
        error: action.error
      };

    case COMMAND:
      return {
        ...state,
        loading: true,
        stdout: action.result
      };
    case COMMAND_SUCCESS:
      return {
        ...state,
        loading: false,
        stdout: action.result
      };
    case COMMAND_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        repos: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        repos: null,
        loaded: false,
        loading: false,
        error: action.error
      };

    case DESTROY:
      return {
        ...state,
        loaded: false,
        error: null
      };
    default:
      return state;
  }
}

/**
 * Determine if SSH Connection is connected
 */
export function isConnected(globalState) {
  return globalState.repo && globalState.repo.repo;
}

export function isLoaded(globalState) {
  return globalState.repo && globalState.repo.loaded;
}

/**
 * Create repository and connect to SSH Shell
 */
export function create(repo) {
  return {
    types: [CONNECT, CONNECT_SUCCESS, CONNECT_FAIL],
    promise: (client) => client.post('/repo/create', {
      data: repo
    })
  };
}

export function connect(repo) {
  return {
    types: [CONNECT, CONNECT_SUCCESS, CONNECT_FAIL],
    promise: (client) => client.post('/ssh/connect', {
      data: repo
    })
  };
}

export function command(cmd) {
  return {
    types: [COMMAND, COMMAND_SUCCESS, COMMAND_FAIL],
    promise: (client) => client.post('/ssh/command', {
      data: cmd
    })
  };
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/repo/load')
  };
}

export function destroy() {
  return {
    type: DESTROY
  };
}
