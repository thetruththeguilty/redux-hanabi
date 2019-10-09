"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../state");
describe("test fetch state", () => {
    let state = new state_1.FetchState("foo");
    beforeEach(() => {
        state = new state_1.FetchState("foo");
    });
    it("test state");
});
describe("test page state", () => {
    let state = new state_1.PageState("foo", 1, 10);
    beforeEach(() => {
        state = new state_1.PageState("foo", 1, 10);
    });
});
