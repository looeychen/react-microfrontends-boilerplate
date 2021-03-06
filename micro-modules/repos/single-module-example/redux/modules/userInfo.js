import { handleActions } from 'redux-actions'
import { RSAA } from 'redux-api-middleware'

// Action Types
const FETCH_REQUEST = '@@UserInfo/FETCH_REQUEST'
const FETCH_SUCCESS = '@@UserInfo/FETCH_SUCCESS'
const FETCH_FAILURE = '@@UserInfo/FETCH_FAILURE'

// Action Creator
export const myAction = () => ({
  [RSAA]: {
    endpoint: 'https://xxx.com/api/xxx',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [
      FETCH_REQUEST,
      FETCH_SUCCESS,
      FETCH_FAILURE
    ]
  }
})

export const actions = {
  myAction
}

// Reducer
const initialState = {

}

export default handleActions(
  {
    [FETCH_REQUEST](state) {
      return {
        ...state
      }
    },

    [FETCH_SUCCESS](state) {
      return {
        ...state
      }
    },

    [FETCH_FAILURE](state) {
      return {
        ...state
      }
    }
  },
  initialState
)
