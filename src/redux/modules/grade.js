export const SAVE = 'pagrader/grade/SAVE';
export const SAVE_SUCCESS = 'pagrader/grade/SAVE_SUCCESS';
export const SAVE_FAIL = 'pagrader/grade/SAVE_FAIL';

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
        loading: false,
        loaded: true
      };
    case SAVE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false
      };
    default:
      return state;
  }
}

export function save(grades) {
  return (client) => client.post('/grade/save', {
    data: grades
  });
}
