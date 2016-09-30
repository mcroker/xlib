(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../exception"], factory);
    }
})(function (require, exports) {
    "use strict";
    //import * as logging from "./logging";
    var ex = require("../exception");
    /** allows embeding mocha tests (unit tests) in your code, no-oping them if mocha is not present.
     * usage notes: as long as this module is loaded
     *		(which it is unless your minifer is expecting pure functions)
     *		then it's enabled automatically.  if your minifier truncates this, execute this function.
     * why use? otherwise your unit tests will throw type error when running mocha "describe" calls
     */
    function _initialize() {
        if (typeof (global["describe"]) === "undefined") {
            //var log = new logging.Logger(__filename);
            //log.trace("mocha not present.  nooping describe function");
            /* tslint:disable */
            var noop = function () { };
            /* tslint:enable */
            global["describe"] = noop;
            if (typeof (global["describe"]) === "undefined") {
                throw new ex.CorelibException("unable to sham describe.  files containing mocha unit tests will fail, thus we failfast here.");
            }
        }
    }
    exports._initialize = _initialize;
});
///** auto called when including this module, but you may explicitly call it if your minifier/compiler requires explicit use of imports.*/
//_initialize();
//# sourceMappingURL=mockmocha.js.map