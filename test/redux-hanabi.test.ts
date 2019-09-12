import {
  createHanabi,
  // composeTypes,
  createAction,
  createFetchAction,
  ActionType,
  ReturnState,
  createFetchMiddleware,
  TFetchAction,
} from '../index';

import { createHanabiFetchAction } from '../hanabiFetch'
import { composeTypes } from '../hanabiTypes'

import { createStore, combineReducers, applyMiddleware, Action } from 'redux'

/**
 * 定义 types
 */

// 前缀
const prefix = 'testHanabi/';

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

class InitialState1 {
  num = 0;
  keyword = '';
}

class InitialState2 {
  fetchData = 1;
}

/**
 * reducer
 */
function reducer1(
  state = new InitialState1(),
  action: ActionType<typeof actions>
): InitialState1 {
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
  }
  return {... state}
}

function reducer2(
  state = new InitialState2(),
  action: ActionType<typeof fetchAction>
): InitialState2 {
  switch (action.type) {
    case Types.fetchData.success:
      // let a = (action as ReturnType<typeof fetchAction.fetchData>)
      return {...state, fetchData: action.payload}
  }
  return state
}

let rootReducer = combineReducers({
  reducer1, reducer2
})

let store = createStore(
  rootReducer, 
  applyMiddleware(

    createHanabi(),

    createFetchMiddleware(async (action) => {
      console.log("fetch", action.method, action.url, action.params)

      if (action.params === "to fail") {
        action.type = action.types.error
        return action
      }

      action.type = action.types.success
      return action
    })
  )
)

describe("test iron redux", () => {

  it("test types", () => {
    console.log(Types.addNum)
    console.log(Types.changeKeyword)
    console.log(Types.fetchData.loading)
    console.log(Types.fetchData.success)
    console.log(Types.fetchData.error)
    console.log(Types.fetchData.refresh)
    console.log(Types.fetchData.save)
    console.log(Types.fetchData.clear)
  })

  it("test reducer", () => {
    let state = new InitialState1()
    expect(state.num).toBe(0)
    state = reducer1(state, actions.addNum(2))
    expect(state.num).toBe(2)
  })

  it("fetch action", () => {
    let action = fetchAction.fetchData('asdf')
    expect(action).toStrictEqual(expect.objectContaining({
      type: "@fetch"
    }))
  })

  it("hanabi loop", () => {
    store.dispatch(actions.loopTrigger())
  })

  it("fetch middleware", async () => {
    let t = await store.dispatch(actions.fetchTrigger())
    expect(t.type).toBe("testHanabi/fetchData_success")
    let d = await store.dispatch(fetchAction.fetchData('to fail'))
    expect(d.type).toBe("testHanabi/fetchData_error")
  })
})