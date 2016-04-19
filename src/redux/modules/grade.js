export const SAVE = 'pagrader/grade/SAVE';
export const SAVE_SUCCESS = 'pagrader/grade/SAVE_SUCCESS';
export const SAVE_FAIL = 'pagrader/grade/SAVE_FAIL';

export const LOAD = 'pagrader/grade/LOAD';
export const LOAD_SUCCESS = 'pagrader/grade/LOAD_SUCCESS';
export const LOAD_FAIL = 'pagrader/grade/LOAD_FAIL';

export const DESTROY = 'pagrader/grade/DESTROY';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SAVE:
      return {
        ...state,
        loading: true
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case SAVE_FAIL:
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
        loading: false,
        loaded: true,
        students: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false
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
  return globalState.grade && globalState.grade.loaded;
}

export function load(repoId, assignmentId, graderId) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) =>
      client.get(`/grade/getStudents/${ repoId }/${ assignmentId }/${ graderId }`)
  };
}

export function save(grades) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post('/grade/save', {
      data: grades
    })
  };
}

export function destroy() {
  return {
    type: DESTROY
  };
}
