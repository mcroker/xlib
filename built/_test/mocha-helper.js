"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.it2 = exports.it1 = void 0;
const tslib_1 = require("tslib");
global.__xlibInitArgs = {
    logLevel: "DEBUG"
};
const xlib = (0, tslib_1.__importStar)(require("../_index"));
function it1(testFcn) {
    const testName = xlib.reflection.getTypeName(testFcn);
    return it(testName, testFcn);
}
exports.it1 = it1;
/** hack fix for mocha bug, unable to have a timeout for async tests */
function it2(testFcn) {
    const testName = xlib.reflection.getTypeName(testFcn);
    return it(testName, async function () {
        // tslint:disable-next-line: no-invalid-this
        const timeoutMs = this.timeout();
        // tslint:disable-next-line: no-invalid-this
        return xlib.promise.bluebird.resolve(testFcn.apply(this)).timeout(timeoutMs, new xlib.promise.bluebird.TimeoutError(`operation timed out.  Max of ${timeoutMs}ms exceeded`));
    });
}
exports.it2 = it2;
//# sourceMappingURL=mocha-helper.js.map