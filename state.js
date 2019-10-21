"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const i = __importStar(require("immutable"));
// export interface IAction<P> {
//   type: string,
//   types: {
//     refreshing: string
//     loading: string
//     success: string
//     error: string
//     clear: string
//     save: string
//     finish: string
//   },
//   payload: P,
//   stateKey?: string,
//   meta?: any,
// }
const FetchStateRecord = i.Record({
    data: undefined,
    isRefreshing: false,
    isLoading: false,
    isFinished: false,
    isSaving: false,
    error: false,
    message: "",
    stateKey: "",
});
class FetchState extends FetchStateRecord {
    constructor(stateKey) {
        // use this to distinct those actions for this state
        super({ stateKey });
    }
}
exports.FetchState = FetchState;
function createStateSelectors(stateSelector) {
    let t = stateSelector;
    t.data = (state) => stateSelector(state).data;
    t.isFinished = (state) => stateSelector(state).isFinished || false;
    t.isLoading = (state) => stateSelector(state).isLoading || false;
    t.isRefreshing = (state) => stateSelector(state).isRefreshing || false;
    t.isSaving = (state) => stateSelector(state).isSaving || false;
    return t;
}
exports.createStateSelectors = createStateSelectors;
function fetchStateReducer(state, action) {
    if (state.stateKey !== action.stateKey)
        return state;
    switch (action.type) {
        case action.types.refreshing:
            return state.merge({
                data: undefined,
                isRefreshing: true,
            });
        // do not clear current data
        case action.types.loading:
            return state.set("isLoading", true);
        case action.types.finish:
            return state.set("isFinished", true);
        case action.types.success:
            return state.merge({
                isRefreshing: false,
                isLoading: false,
                error: false,
                message: "",
                data: action.payload,
            });
        case action.types.error:
            return state.merge({
                error: true,
                isRefreshing: false,
                isLoading: false,
                message: action.payload,
            });
        // isSaving state is controlled by user
        case action.types.save:
            return state.set("isSaving", action.payload);
        case action.types.clear:
            return new FetchState(state.stateKey);
        default:
            return state;
    }
}
exports.fetchStateReducer = fetchStateReducer;
const PageStateRecord = i.Record({
    list: i.List(),
    isRefreshing: false,
    isLoading: false,
    isFinished: false,
    isSaving: false,
    startPage: 0,
    currentPage: 0,
    pageSize: 10,
    error: false,
    message: "",
    stateKey: "",
});
class PageState extends PageStateRecord {
    constructor(stateKey, startPage, pageSize) {
        // use stateKey to distinct those actions for this state
        // use startPage for there may be some fucking shit page start with index 1
        super({ stateKey, pageSize, startPage, currentPage: startPage });
    }
}
exports.PageState = PageState;
function createPageSelectors(stateSelector) {
    let t = stateSelector;
    t.list = (state) => stateSelector(state).list || i.List();
    t.currentPage = (state) => stateSelector(state).currentPage || 1;
    t.pageSize = (state) => stateSelector(state).pageSize || 10;
    t.startPage = (state) => stateSelector(state).startPage || 10;
    t.isFinished = (state) => stateSelector(state).isFinished || false;
    t.isLoading = (state) => stateSelector(state).isLoading || false;
    t.isRefreshing = (state) => stateSelector(state).isRefreshing || false;
    t.isSaving = (state) => stateSelector(state).isSaving || false;
    return t;
}
exports.createPageSelectors = createPageSelectors;
function pageStateReducer(state, action) {
    if (state.stateKey !== action.stateKey)
        return state;
    switch (action.type) {
        case action.types.refreshing:
            return state.merge({
                isRefreshing: true,
            });
        case action.types.loading:
            return state.set("isLoading", true);
        case action.types.finish:
            return state.set("isFinished", true);
        case action.types.success:
            return state.merge({
                isRefreshing: false,
                isLoading: false,
                currentPage: state.currentPage + 1,
                error: false,
                message: "",
                list: state.list.concat(i.List(action.payload)),
            });
        case action.types.error:
            return state.merge({
                error: true,
                isRefreshing: false,
                isLoading: false,
                message: action.payload,
            });
        case action.types.save:
            return state.set("isSaving", action.payload);
        case action.types.clear:
            return new PageState(state.stateKey, state.startPage, state.pageSize);
        default:
            return state;
    }
}
exports.pageStateReducer = pageStateReducer;
