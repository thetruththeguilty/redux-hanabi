"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const hanabiTypes_1 = require("../hanabiTypes");
const redux_1 = require("redux");
/**
 * 定义 types
 */
// 前缀
const prefix = 'testHanabi/';
// 基本action
var BasicTypes;
(function (BasicTypes) {
    BasicTypes[BasicTypes["addNum"] = 0] = "addNum";
    BasicTypes[BasicTypes["changeKeyword"] = 1] = "changeKeyword";
    BasicTypes[BasicTypes["fetchTrigger"] = 2] = "fetchTrigger";
    BasicTypes[BasicTypes["loopTrigger"] = 3] = "loopTrigger";
})(BasicTypes || (BasicTypes = {}));
// fetchAction
var FetchTypes;
(function (FetchTypes) {
    FetchTypes[FetchTypes["fetchData"] = 0] = "fetchData";
})(FetchTypes || (FetchTypes = {}));
// 合成types
const Types = hanabiTypes_1.composeTypes({
    prefix,
    BasicTypes,
    FetchTypes
});
/**
 * actions 和 InitialState
 */
const actions = {
    addNum: index_1.createAction(Types.addNum, 'num')(),
    changeKeyword: index_1.createAction(Types.changeKeyword, 'keyword')(),
    fetchTrigger: index_1.createAction(Types.fetchTrigger)(),
    loopTrigger: index_1.createAction(Types.loopTrigger)(),
};
const fetchAction = {
    fetchData: index_1.createFetchAction(Types.fetchData, '/api/data', "GET")("statekey")
};
class InitialState1 {
    constructor() {
        this.num = 0;
        this.keyword = '';
    }
}
class InitialState2 {
    constructor() {
        this.fetchData = 1;
    }
}
/**
 * reducer
 */
function reducer1(state = new InitialState1(), action) {
    console.log(action);
    switch (action.type) {
        case Types.addNum:
            return Object.assign({}, state, { num: state.num + action.payload });
        case Types.fetchTrigger:
            action.meta = () => fetchAction.fetchData('asdf');
            return state;
        case Types.loopTrigger:
            action.meta = () => actions.loopTrigger();
            return state;
    }
    return Object.assign({}, state);
}
function reducer2(state = new InitialState2(), action) {
    switch (action.type) {
        case Types.fetchData.success:
            // let a = (action as ReturnType<typeof fetchAction.fetchData>)
            return Object.assign({}, state, { fetchData: action.payload });
    }
    return state;
}
let rootReducer = redux_1.combineReducers({
    reducer1, reducer2
});
let store = redux_1.createStore(rootReducer, redux_1.applyMiddleware(index_1.createHanabi(), index_1.createFetchMiddleware((action) => __awaiter(this, void 0, void 0, function* () {
    console.log("fetch", action.method, action.url, action.params);
    if (action.params === "to fail") {
        action.type = action.types.error;
        return action;
    }
    action.type = action.types.success;
    return action;
}))));
describe("test iron redux", () => {
    it("test types", () => {
        console.log(Types.addNum);
        console.log(Types.changeKeyword);
        console.log(Types.fetchData.loading);
        console.log(Types.fetchData.success);
        console.log(Types.fetchData.error);
        console.log(Types.fetchData.refresh);
        console.log(Types.fetchData.save);
        console.log(Types.fetchData.clear);
    });
    it("test reducer", () => {
        let state = new InitialState1();
        expect(state.num).toBe(0);
        state = reducer1(state, actions.addNum(2));
        expect(state.num).toBe(2);
    });
    it("fetch action", () => {
        let action = fetchAction.fetchData('asdf');
        expect(action).toStrictEqual(expect.objectContaining({
            type: "@fetch"
        }));
    });
    it("hanabi loop", () => {
        store.dispatch(actions.loopTrigger());
    });
    it("fetch middleware", () => __awaiter(this, void 0, void 0, function* () {
        let t = yield store.dispatch(actions.fetchTrigger());
        expect(t.type).toBe("testHanabi/fetchData_success");
        let d = yield store.dispatch(fetchAction.fetchData('to fail'));
        expect(d.type).toBe("testHanabi/fetchData_error");
    }));
});
