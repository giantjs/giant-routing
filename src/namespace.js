/*jshint node:true */

/** @namespace */
var giant = giant || require('giant-namespace');

/** @namespace */
var $assertion = $assertion || require('giant-assertion');

/** @namespace */
var $oop = $oop || require('giant-oop');

/** @namespace */
var $utils = $utils || require('giant-utils');

// TODO: Document.
giant.usePushState = false;

if (typeof require === 'function') {
    require('giant-data');
    require('giant-event');
}

/**
 * @namespace
 * @see https://github.com/kriskowal/q
 */
var Q = Q || require('q', 'Q');

if (typeof window === 'undefined') {
    /**
     * Built-in global window object.
     * @type {Window}
     */
    window = undefined;
}

if (typeof document === 'undefined') {
    /**
     * Built-in global document object.
     * @type {Document}
     */
    document = undefined;
}

/**
 * Native string class.
 * @name String
 * @class
 */

/**
 * Native array class.
 * @name Array
 * @class
 */
