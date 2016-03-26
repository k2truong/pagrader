import {expect} from 'chai';
import reducer, * as ducks from '../auth';

describe('Auth Tests', () => {
  describe('Actions', () => {
    // This only test synchronous actions
    it('should create an action to destroy state', () => {
      const expectedAction = {
        type: ducks.DESTROY
      };
      expect(ducks.destroy()).to.deep.equal(expectedAction);
    });
  });

  describe('Reducers', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).to.deep.equal({
        loaded: false
      });
    });

    it('should handle login', () => {
      expect(
        reducer({}, {
          type: ducks.LOGIN
        })
      ).to.deep.equal({
        loading: true
      });

      const mockUser = {
        username: 'test'
      };
      expect(
        reducer({
          loading: true
        }, {
          type: ducks.LOGIN_SUCCESS,
          result: mockUser
        })
      ).to.deep.equal({
        loading: false,
        user: mockUser
      });

      const error = {
        message: 'Incorrect username or password'
      };
      expect(
        reducer({
          loading: true
        }, {
          type: ducks.LOGIN_FAIL,
          error: error
        })
      ).to.deep.equal({
        loading: false,
        user: null,
        error: error
      });
    });
  });
});
