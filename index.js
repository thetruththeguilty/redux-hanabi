"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("./actionTypes");
exports.composeTypes = actionTypes_1.composeTypes;
const hanabiFetch_1 = require("./hanabiFetch");
/**
 * the reducer use action.meta to add a function, to dispatch action,
 * for triggering the state change by state self.
 *
 * some thing like that:
 *
 * - tabReducer
 *   - pageReducer1
 *   - pageReducer2
 *   - pageReducer3
 *
 * so, a certain reducer may generate an action with it's own state.
 * like fetchNext(page1, currentIndex, fetchNum).
 *
 * @param {{stackMaxCount: number}} opts
 */
function createHanabi(opts = {}) {
    const stackMaxCount = opts.stackMaxCount || 5;
    const isHanabiAlive = (action) => {
        if (!action.__stack)
            action.__stack = 0;
        return action.__stack < stackMaxCount;
    };
    return ({ dispatch, getState }) => (next) => (action) => {
        let ret = next(action);
        if (action.meta && (action.meta instanceof Function) && isHanabiAlive(action)) {
            let hanabi = action.meta(dispatch, getState);
            if (hanabi && (typeof hanabi === "object") && hanabi.type) {
                hanabi.__stack = action.__stack + 1;
                // if u use rx-observable, a new action will appear in stream
                return dispatch(hanabi);
            }
            else if (hanabi instanceof Promise) {
                // if the return is a promise then replace the return value
                return hanabi.then(ret => {
                    ret.__stack = action.__stack + 1;
                    return dispatch(ret);
                });
            }
        }
        return ret;
    };
}
exports.createHanabi = createHanabi;
function createFetchMiddleware(fn) {
    return hanabiFetch_1.createHanabiFetchMiddleware("@fetch", fn);
}
exports.createFetchMiddleware = createFetchMiddleware;
const LOADING_SUFFIX = '_loading';
const SUCCESS_SUFFIX = '_success';
const ERROR_SUFFIX = '_error';
const identify = (arg) => arg;
/**
 * create action
 */
function createAction(type, stateKey = '') {
    return (fn = identify) => function (params, meta) {
        if (stateKey) {
            return {
                type, stateKey, payload: fn(params), meta
            };
        }
        return {
            type, payload: fn(params), meta
        };
    };
}
exports.createAction = createAction;
// let fetchAction = {
//   stateKey: 'state key',
//   types: {
//     loading: 'testIron/fetchData_LOADING',
//     success: 'testIron/fetchData_SUCCESS',
//     error: 'testIron/fetchData_ERROR'
//   },
//   meta: undefined,
//   params: 'asdf',
//   url: '/api/data',
//   method: 'GET'
// }
/**
 * create fetch action,
 */
function createFetchAction(types, url, method = 'GET', fetchTypeName = '@fetch') {
    return (stateKey) => (params, meta) => {
        return {
            stateKey, types, meta, params, url, method, type: fetchTypeName, payload: undefined,
        };
        // return action // as typeof action & { type: Key; payload?: Response }
    };
}
exports.createFetchAction = createFetchAction;
