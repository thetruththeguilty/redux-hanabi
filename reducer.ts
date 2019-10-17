
/**
 * ignore the action that match the test,
 * i.e. use a key to ignore some scope.
 * skip some action that is generat by rx.
 * @param reducer 
 * @param ignoreTest 
 */
export function reducerIgnore<S, A>(
  reducer: (state: S, action: A) => S,
  ignoreTest: (action: A) => boolean,
) {
  return function (state: S, action: A) {
    if (ignoreTest(action)) {
      return state
    }
    return reducer(state, action)
  }
}