/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'src/namespace.js',
            'src/routingEventSpace.js',
            'src/Route.js',
            'src/RoutingEvent.js',
            'src/LocationProxy.js',
            'src/HashProxy.js',
            'src/PushStateProxy.js',
            'src/SilentProxy.js',
            'src/Router.js',
            'src/exports.js'
        ],

        test: [
            'src/jsTestDriver.conf'
        ],

        globals: {}
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
