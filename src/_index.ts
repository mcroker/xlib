/// <reference path="./types/xlib-globals/index.d.ts" />



/** need to do init work serially, at least until after promise initializtaion, so taht bluebird can initialize properly  (it can't initialize once a promise has been created) */
const serialInits: Array<( ( args: init.IInitArgs ) => void )> = [];

import jsShims = require( "./core/jsshims" );
serialInits.push( jsShims.initialize );

export import environment = require( "./core/environment" );
serialInits.push( environment.initialize );

export import promise = require( "./core/promise" );
serialInits.push( promise.initialize );

//////////////////////  initialization section
import init = require( "./.internal/init" );
let isInitializeStarted = false;
export async function initialize( args?: init.IInitArgs ) {
    args = { ...args };

    if ( isInitializeStarted === true ) {
        log.warn( "xlib.initialize() already called, we are ignoring further calls" );
        return;
    }
    isInitializeStarted = true;
    serialInits.forEach( ( initWork ) => initWork( args ) );
    return init.initialize( args );

}

setTimeout( () => {
    if ( init.isInitializeStarted() !== true ) {
        throw new Error( "xlib.initialize() was not called within 10 seconds of startup.   To use xlib we expect initialization logic to be performed. " );
    }
}, 10000 )


export import lodash = require( "lodash" );

export import exception = require( "./core/exception" );

///** low-level javascript helpers, to smooth over warts in the language */
export import jsHelper = require( "./core/jshelper" );


///** allows embeding mocha tests (unit tests) in your code, no-oping them if mocha is not present.  */
import mockMocha = require( "./.internal/mockmocha" );
serialInits.push( mockMocha.initialize );

export import lolo = require( "./core/lolo" );
export import arrayHelper = require( "./core/arrayhelper" );
export import ClassBase = require( "./core/classbase" );
export import diagnostics = require( "./core/diagnostics" );
const log = new diagnostics.Logger( __filename );
export import collections = require( "./core/collections" );

/** various math and numerical conversion/manipulation related helper functions */
export import numHelper = require( "./core/numhelper" );
export import stringHelper = require( "./core/stringhelper" );
export import reflection = require( "./core/reflection" );


export import dateTime = require( "./core/datetime" );

export import validation = require( "./core/validation" );
export import serialization = require( "./core/serialization" );

//export import compression = require( "./core/compression" );
export import threading = require( "./core/threading" );



export import net = require( "./core/net" );

export import cache = require( "./core/cache" );

/** templates for various design patterns */
export import designPatterns = require( "./core/design-patterns/design-patterns" );

/** security and cryptographic helpers.   (cross-platform)
 *  note:  our ```KDF``` is nodejs only, and can be found in the ```nlib.security``` module.
 * */
export import security = require( "./core/security" );
// /** decimal.js: high precision numbers
// https://www.npmjs.com/package/decimal.js
// */
// export import decimal = require( "decimal.js" );



/** cross-platform implementation of the nodejs module: http://nodejs.org/api/events.html
 * -------------------
 * Many objects in Node emit events: a net.Server emits an event each time a peer connects to it, 
 * a fs.readStream emits an event when the file is opened. All objects which emit events are instances of events.EventEmitter. 
 * You can access this module by doing: require("events");
 * Typically, event names are represented by a camel-cased string, however, 
 * there aren't any strict restrictions on that, as any string will be accepted.
 * Functions can then be attached to objects, to be executed when an event is emitted. 
 * These functions are called listeners. Inside a listener function, 
 * this refers to the EventEmitter that the listener was attached to.
 */
export import events = require( "events" );

/** cross-platform implementation of the nodejs module: http://nodejs.org/api/buffer.html 
 * -----------------
 * Pure JavaScript is Unicode friendly but not nice to binary data. When dealing with TCP streams or the file system, 
 * it's necessary to handle octet streams. Node has several strategies for manipulating, creating, 
 * and consuming octet streams.
 * Raw data is stored in instances of the Buffer class. 
 * A Buffer is similar to an array of integers but corresponds to a raw memory allocation outside the V8 heap. 
 * A Buffer cannot be resized.

The Buffer class is a global, making it very rare that one would need to ever require('buffer').
 */
export import buffer = require( "buffer" );

/** cross-platform implementation of the nodejs module: http://nodejs.org/api/path.html
 * -------------------
 * This module contains utilities for handling and transforming file paths. 
 * Almost all these methods perform only string transformations. 
 * The file system is not consulted to check whether paths are valid.
 */
export import path = require( "path" );

/** cross-platform implementation of the nodejs module: http://nodejs.org/api/punycode.html
 * -------------------
 * Punycode is a way to represent Unicode with the limited character subset of ASCII supported by the Domain Name System. 
 * For example "münich" would be encoded as "mnich-kva".
 */
export import punycode = require( "punycode" );


/** cross-platform implementation of the nodejs module: http://nodejs.org/api/querystring.html
 * -------------------
 * This module provides utilities for dealing with query strings.
 */
export import querystring = require( "querystring" );

/** cross-platform implementation of the nodejs module: http://nodejs.org/api/stream.html
 * -------------------
 * A stream is an abstract interface implemented by various objects in Node. 
 * For example a request to an HTTP server is a stream, as is stdout. 
 * Streams are readable, writable, or both. All streams are instances of EventEmitter
 */
export import stream = require( "stream" );

/** cross-platform implementation of the nodejs module: http://nodejs.org/api/string_decoder.html
 * -------------------
 * StringDecoder decodes a buffer to a string. 
 * It is a simple interface to buffer.toString() but provides additional support for utf8.
 */
export import string_decoder = require( "string_decoder" );

/** cross-platform implementation of the nodejs module: http://nodejs.org/api/url.html
 * -------------------
 * This module has utilities for URL resolution and parsing. 
 */
export import url = require( "url" );

export import definitions = require( "./definitions/definitions" );



/**
 * allows describing user input as a Class instead of a POJO, and enforces conformance of the class via templates.
 */
export abstract class PayloadTemplate<TThis>{

    constructor( jsonPayload?: string | Buffer, templateObj?: TThis,
        /** defaults: {parseOrphans:false,pruneOrphans:true,sanitizeStrings:true,maxInputLength:5000} 
        set to FALSE to not parse
        */
        templateParseOptions?: {
            reviver?: ( key: any, value: any ) => any;
            /** if true, an object can be passed in, not just a string or Buffer */
            allowObjectInput?: boolean;
            /** if true, attempts to parse any additional strings found in the input (and does this recursively) */
            parseOrphans?: boolean;
            /** if true, deletes any orphans found.  default = TRUE */
            pruneOrphans?: boolean;
            /** if true, will escape strings to prevent injection attacks.  default false.   to ignore pruning of a node's children, set that node to null.  ex: ```myTemplate.userTags=null``` */
            escapeStrings?: boolean,
            /** if set, throws an exception if the input is too long.  default=5000 */
            maxInputLength?: number;
            /** true to not validate that all template fields are present.  default=false*/
            skipValidation?: boolean;
        }
    ) {

        if ( jsonPayload == null ) {
            return;
        }

        if ( templateParseOptions == null ) {
            templateParseOptions = {}
        }
        lodash.defaults( templateParseOptions, { parseOrphans: false, pruneOrphans: true, escapeStrings: false, maxInputLength: 5000, skipValidation: false, } );

        let parsedObj: any;
        if ( templateObj != null ) {
            parsedObj = serialization.JSONX.parseUsingTemplate( templateObj, jsonPayload, templateParseOptions );
        } else {
            parsedObj = serialization.JSONX.parse( jsonPayload );
        }
        lodash.assign( this, parsedObj );
        if ( templateParseOptions.skipValidation !== true ) {
            validation.scrub( this ).isTemplatePopulated( templateObj ).failThrow();
        }
    }


}


serialInits.push( ( args: init.IInitArgs ) => {

    mockMocha.initialize();


    if ( lolo.env.isDebug === true ) {
        //try {
        ///** https://www.npmjs.com/package/source-map-support
        // * This module provides source map support for stack traces in node via the V8 stack trace API. It uses the source-map module to replace the paths and line numbers of source-mapped files with their original paths and line numbers. The output mimics node's stack trace format with the goal of making every compile-to-JS language more of a first-class citizen. Source maps are completely general (not specific to any one language) so you can use source maps with multiple compile-to-JS languages in the same node process.
        //  */
        if ( args.suppressStartupMessage !== true ) {
            console.log( "loading sourcemap support (in logLevel.DEBUG or TRACE" );
        }
        var source_map_support = require( "source-map-support" );
        source_map_support.install( { handleUncaughtExceptions: false } );
        //} catch (ex) {
        //	console.log("eating sourcemap support call");
        //}
    }


    //set lodash as a global if it's not.
    if ( environment.getGlobal()[ "_" ] == null ) {
        environment.getGlobal()[ "_" ] = lodash;
    }


    if ( environment.getGlobal()[ "moment" ] == null ) {
        //define momentStatic
        environment.getGlobal()[ "moment" ] = dateTime.moment;
    }
} );


describe( __filename + " basic xlib unit tests", () => {

    before( async () => {
        await initialize();
    } );





    it( "logger basic console output", async () => {

        const testLogger = new diagnostics.Logger( "test logging" );

        testLogger.trace( "traced" );
        testLogger.info( "infoed" );
        testLogger.warn( "warned" );
        testLogger.error( "errored" );

    } );

    it( "should fail, test log.assert()", () => {
        log.assert( false, "assert condition" );
    } )


    it( "read env", () => {

        log.assert( environment.envLevel != null );

    } );


} );