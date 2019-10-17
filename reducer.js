"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ignore the action that match the test,
 * i.e. use a key to ignore some scope.
 * skip some action that is generat by rx.
 * @param reducer
 * @param ignoreTest
 */
function reducerIgnore(reducer, ignoreTest) {
    return function (state, action) {
        if (ignoreTest(action)) {
            return state;
        }
        return reducer(state, action);
    };
}
exports.reducerIgnore = reducerIgnore;
