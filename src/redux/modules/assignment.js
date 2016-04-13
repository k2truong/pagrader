export const LOAD = 'pagrader/assignment/LOAD';
export const LOAD_SUCCESS = 'pagrader/assignment/LOAD_SUCCESS';
export const LOAD_FAIL = 'pagrader/assignment/LOAD_FAIL';

export const LOAD_LIST = 'pagrader/assignment/LOAD_LIST';
export const LOAD_LIST_SUCCESS = 'pagrader/assignment/LOAD_LIST_SUCCESS';
export const LOAD_LIST_FAIL = 'pagrader/assignment/LOAD_LIST_FAIL';

export const GET_GRADERS = 'pagrader/assignment/GET_GRADERS';
export const GET_GRADERS_SUCCESS = 'pagrader/assignment/GET_GRADERS_SUCCESS';
export const GET_GRADERS_FAIL = 'pagrader/assignment/GET_GRADERS_FAIL';

export const UPDATE = 'pagrader/assignment/UPDATE';
export const UPDATE_SUCCESS = 'pagrader/assignment/UPDATE_SUCCESS';
export const UPDATE_FAIL = 'pagrader/assignment/UPDATE_FAIL';

export const RUN_SCRIPT = 'pagrader/assignment/RUN_SCRIPT';
export const RUN_SUCCESS = 'pagrader/assignment/RUN_SUCCESS';
export const RUN_FAIL = 'pagrader/assignment/RUN_FAIL';

export const DESTROY = 'pagrader/assignment/DESTROY';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
        assignment: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error
      };

    case UPDATE:
      return {
        ...state,
        loading: true
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        hasChanged: true,
        loaded: true,
        loading: false,
        assignment: action.result
      };
    case UPDATE_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error
      };

    case LOAD_LIST:
      return {
        ...state,
        loading: true
      };
    case LOAD_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        assignments: action.result
      };
    case LOAD_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case GET_GRADERS:
      return {
        ...state,
        loading: true
      };
    case GET_GRADERS_SUCCESS:
      return {
        ...state,
        loading: false,
        graders: action.result.graders,
        samples: action.result.samples
      };
    case GET_GRADERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case RUN_SCRIPT:
      return {
        ...state,
        hasChanged: false,
        loading: true
      };
    case RUN_SUCCESS:
      return {
        ...state,
        loading: false,
        graders: action.result.graders,
        samples: action.result.samples
      };
    case RUN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
        graders: null,
        samples: null
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

export function isLoaded(globalState) {
  return globalState.assignment && globalState.assignment.loaded;
}

export function load(repoId, assignmentId) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/assignment/load/${ repoId }/${ assignmentId }`)
  };
}

export function loadList(repoId) {
  return {
    types: [LOAD_LIST, LOAD_LIST_SUCCESS, LOAD_LIST_FAIL],
    promise: (client) => client.get(`/assignment/load/${ repoId }`)
  };
}

export function getGraders(socketId, assignmentId) {
  return {
    types: [GET_GRADERS, GET_GRADERS_SUCCESS, GET_GRADERS_FAIL],
    promise: (client) => client.get(`/assignment/getGraders/${ socketId }/${ assignmentId }`)
  };
}

export function create(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.post('/assignment/create', {
      data: data
    })
  };
}

export function update(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.post('/assignment/update', {
      data: data
    })
  };
}

export function runScript(data) {
  return {
    types: [RUN_SCRIPT, RUN_SUCCESS, RUN_FAIL],
    promise: (client) => client.post('/ssh/runScript', {
      data: data
    })
  };
}

export function destroy() {
  return {
    type: DESTROY
  };
}
