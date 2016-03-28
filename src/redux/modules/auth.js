export const LOAD = 'pagrader/auth/LOAD';
export const LOAD_SUCCESS = 'pagrader/auth/LOAD_SUCCESS';
export const LOAD_FAIL = 'pagrader/auth/LOAD_FAIL';
export const LOGIN = 'pagrader/auth/LOGIN';
export const LOGIN_SUCCESS = 'pagrader/auth/LOGIN_SUCCESS';
export const LOGIN_FAIL = 'pagrader/auth/LOGIN_FAIL';
export const LOGOUT = 'pagrader/auth/LOGOUT';
export const LOGOUT_SUCCESS = 'pagrader/auth/LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'pagrader/auth/LOGOUT_FAIL';
export const SIGNUP = 'pagrader/auth/SIGNUP';
export const SIGNUP_FAIL = 'pagrader/auth/SIGNUP_FAIL';
export const DESTROY = 'pagrader/auth/DESTROY';

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
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loading: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.result
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        user: null,
        error: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loading: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case SIGNUP:
      return {
        ...state
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        loggingIn: false,
        error: action.error
      };
    case DESTROY:
      return {
        ...state,
        error: undefined
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

export function login(user) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/login', {
      data: user
    })
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/logout')
  };
}

export function signup(user) {
  return {
    types: [SIGNUP, LOGIN_SUCCESS, SIGNUP_FAIL],
    promise: (client) => client.post('/signup', {
      data: user
    })
  };
}

export function destroy() {
  return {
    type: DESTROY
  };
}
