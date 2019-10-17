import { pageStateReducer, PageState, fetchStateReducer, FetchState } from '../state'
import { createFetchTypes } from '../actionTypes'

describe("test fetch state", () => {

  let state = new FetchState("foo")

  beforeEach(() => {
    state = new FetchState("foo")
  })

  it("test state", () => {

  })
})

describe("test page state", () => {

  let state = new PageState("foo", 1, 10)

  beforeEach(() => {
    state = new PageState("foo", 1, 10)
  })


})