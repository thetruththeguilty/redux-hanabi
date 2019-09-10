import {
  createHanabi,
  composeTypes,
  createAction,
  createFetchAction,
  ActionType,
  ReturnState,
} from '../index';

import { createStore, combineReducers, applyMiddleware } from 'redux'

/**
 * 定义 types
 */

// 前缀
const prefix = 'testIron/';

// 基本action
enum BasicTypes {
  addNum,
  changeKeyword,
  fetchTrigger,
  loopTrigger,
}

// fetchAction
enum FetchTypes {
  fetchData
}

// 合成types
const Types = composeTypes({
  prefix,
  BasicTypes,
  FetchTypes
});

/**
 * actions 和 InitialState
 */
const actions = {
  addNum: createAction(Types.addNum, 'num')<number>(),
  changeKeyword: createAction(Types.changeKeyword, 'keyword')<string>(),
  fetchTrigger: createAction(Types.fetchTrigger)(),
  loopTrigger: createAction(Types.loopTrigger)(),
};

const fetchAction = {
  fetchData: createFetchAction(Types.fetchData, '/api/data', "GET")<string, {message: true}>("statekey")
}

class InitialState {
  num = 0;
  keyword = '';
}

/**
 * reducer
 */
function reducer(
  state = new InitialState(),
  action: ActionType<typeof actions>
): InitialState {
  console.log(action)
  switch (action.type) {
    case Types.addNum:
      return {...state, num: state.num + action.payload}
    case Types.fetchTrigger:
      action.meta = () => fetchAction.fetchData('asdf')
      return state;
    case Types.loopTrigger:
      action.meta = () => actions.loopTrigger()
      return state;
    // default: {
    //   return AsyncTuple.handleAll(prefix, state, action);
    // }
  }
  return {... state}
}

let store = createStore(
  reducer, 
  applyMiddleware(
    createHanabi()
  )
)

describe("test iron redux", () => {

  it("test types", () => {
    console.log(Types.addNum)
    console.log(Types.changeKeyword)
    console.log(Types.fetchData.loading)
    console.log(Types.fetchData.success)
    console.log(Types.fetchData.error)
  })

  it("test reducer", () => {
    let state = new InitialState()
    expect(state.num).toBe(0)
    state = reducer(state, actions.addNum(2))
    expect(state.num).toBe(2)
  })

  it("fetch action", () => {
    let action = fetchAction.fetchData('asdf')
    expect(action).toStrictEqual(expect.objectContaining({
      type: "@fetch"
    }))
  })

  it("hanabi test", () => {
    store.dispatch(actions.fetchTrigger())
    store.dispatch(actions.loopTrigger())
  })
})