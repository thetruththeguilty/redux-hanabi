"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createHanabiFetchAction(opts) {
    let types = opts.types;
    let url = opts.url;
    let method = opts.method || 'GET';
    let fetchTypeName = opts.fetchTypeName || '@fetch';
    return (stateKey) => (params, meta) => {
        return {
            type: fetchTypeName, stateKey, types, meta, params, url, method, payload: undefined,
        };
    };
}
exports.createHanabiFetchAction = createHanabiFetchAction;
function createHanabiFetchMiddleware(typeName, fn) {
    return (store) => (next) => (action) => {
        if (action.type === typeName) {
            // dispatch a loading action
            action.type = action.types.loading;
            store.dispatch(action);
            return fn(action)
                .then(ret => {
                if (ret.type === ret.types.success || ret.type === ret.types.error) {
                    return store.dispatch(ret);
                }
                ret.type === ret.types.error;
                ret.payload = `${typeName} error, return type must be success or error`;
                return store.dispatch(ret);
            });
        }
        else {
            return next(action);
        }
    };
}
exports.createHanabiFetchMiddleware = createHanabiFetchMiddleware;
