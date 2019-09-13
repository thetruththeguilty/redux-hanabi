"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOADING_SUFFIX = '_loading';
const SUCCESS_SUFFIX = '_success';
const ERROR_SUFFIX = '_error';
const CLEAR_SUFFIX = '_clear';
const REFRESH_SUFFIX = '_refresh';
const SAVE_SUFFIX = '_save';
/**
 * create types
 */
function composeTypes(config) {
    const { prefix, BasicTypes: actionTypes = {}, FetchTypes: fetchActionTypes = {} } = config;
    const types = Object.assign({}, actionTypes, fetchActionTypes);
    const res = {};
    Object.keys(types).forEach(property => {
        if (fetchActionTypes.hasOwnProperty(property)) {
            let result = {};
            result.loading = prefix + property + LOADING_SUFFIX;
            result.success = prefix + property + SUCCESS_SUFFIX;
            result.error = prefix + property + ERROR_SUFFIX;
            result.clear = prefix + property + CLEAR_SUFFIX;
            result.refresh = prefix + property + REFRESH_SUFFIX;
            result.save = prefix + property + SAVE_SUFFIX;
            res[property] = result;
            return;
        }
        res[property] = prefix + property;
    });
    return res;
}
exports.composeTypes = composeTypes;
