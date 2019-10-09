"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOADING_SUFFIX = '_loading';
const SUCCESS_SUFFIX = '_success';
const ERROR_SUFFIX = '_error';
const CLEAR_SUFFIX = '_clear'; // clear-able state
const REFRESH_SUFFIX = '_refresh';
const SAVE_SUFFIX = '_save'; // get a dump
const FINISH_SUFFIX = "_finish"; // this normally means the page reach the end
function createBasicTypes(prefix, types) {
    const res = {};
    Object.keys(types).forEach(property => {
        if (typeof types[property] !== 'number')
            return;
        res[property] = prefix + property;
    });
    return res;
}
exports.createBasicTypes = createBasicTypes;
function createFetchTypes(prefix, types) {
    const res = {};
    Object.keys(types).forEach(property => {
        if (typeof types[property] !== 'number')
            return;
        let result = {};
        result.loading = prefix + property + LOADING_SUFFIX;
        result.success = prefix + property + SUCCESS_SUFFIX;
        result.error = prefix + property + ERROR_SUFFIX;
        result.clear = prefix + property + CLEAR_SUFFIX;
        result.refresh = prefix + property + REFRESH_SUFFIX;
        result.save = prefix + property + SAVE_SUFFIX;
        result.finish = prefix + property + FINISH_SUFFIX;
        res[property] = result;
    });
    return res;
}
exports.createFetchTypes = createFetchTypes;
/**
 * create types
 */
function composeTypes(config) {
    const { prefix, BasicTypes: actionTypes = {}, FetchTypes: fetchActionTypes = {} } = config;
    const types = Object.assign({}, createBasicTypes(prefix, actionTypes), createFetchTypes(prefix, fetchActionTypes));
    return types;
}
exports.composeTypes = composeTypes;
