export const LOAD = 'pagrader/assignment/LOAD';
export const LOAD_SUCCESS = 'pagrader/assignment/LOAD_SUCCESS';
export const LOAD_FAIL = 'pagrader/assignment/LOAD_FAIL';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        output: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    default:
      return state;
  }
}

export function load(socketId, assignmentId, graderId, fileName) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) =>
      client.get(`/ssh/getFile/${ socketId }/${ assignmentId }/${ graderId }/${ fileName }`)
  };
}
