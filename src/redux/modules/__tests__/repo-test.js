import { expect } from 'chai';
import reducer, * as ducks from '../repo';

describe('Repo Tests', () => {
  describe('Reducers', () => {
    const mockRepo = {
      name: 'CSE5 Winter 2016',
      username: 'repoUser'
    };

    it('should return the initial state', () => {
      expect(
        reducer(undefined, {})
      ).to.deep.equal({
        loaded: false
      });
    });

    it('should handle creating repo', () => {
      expect(
        reducer({}, {
          type: ducks.CONNECT
        })
      ).to.deep.equal({
        loading: true
      });

      expect(
        reducer({}, {
          type: ducks.CONNECT_SUCCESS,
          result: mockRepo
        })
      ).to.deep.equal({
        loading: false,
        repo: mockRepo
      });

      const error = {
        message: 'Repository name already taken'
      };
      expect(
        reducer({}, {
          type: ducks.CONNECT_FAIL,
          error: error
        })
      ).to.deep.equal({
        repo: null,
        loading: false,
        error: error
      });
    });

    it('should handle loading repos', () => {
      expect(
        reducer({}, {
          type: ducks.LOAD
        })
      ).to.deep.equal({
        loading: true
      });

      expect(
        reducer({
          loading: true
        }, {
          type: ducks.LOAD_SUCCESS,
          result: [mockRepo]
        })
      ).to.deep.equal({
        loaded: true,
        loading: false,
        repos: [mockRepo]
      });

      const error = {
        message: 'Error'
      };
      expect(
        reducer({
          loading: true
        }, {
          type: ducks.LOAD_FAIL,
          error: error
        })
      ).to.deep.equal({
        loaded: false,
        loading: false,
        repos: null,
        error: error
      });
    });
  });
});
