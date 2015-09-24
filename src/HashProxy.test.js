/*global $routing, flock */
(function () {
    "use strict";

    module("HashProxy", {
        setup: function () {
            $routing.usePushState = false;
        }
    });

    test("Conversion from LocationHash", function () {
        var locationProxy = $routing.LocationProxy.create();

        ok(locationProxy.isA($routing.HashProxy), "should return HashProxy instance");
    });

    test("Changing route", function () {
        expect(6);

        var hashProxy = $routing.HashProxy.create();

        throws(function () {
            hashProxy.setRoute();
        }, "should raise exception on missing arguments");

        throws(function () {
            hashProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        hashProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch current route");
                return ''.toRoute();
            },

            isHashBased: function () {
                ok(true, "should check if route is purely hash based");
                return true;
            },

            _hashSetterProxy: function (hash) {
                equal(hash, '#foo', "should set URL hash");
            }
        });

        strictEqual(hashProxy.setRoute('foo'.toRoute()), hashProxy, "should be chainable");
    });

    test("Hard redirection", function () {
        expect(6);

        var hashProxy = $routing.HashProxy.create();

        throws(function () {
            hashProxy.setRoute();
        }, "should raise exception on missing arguments");

        throws(function () {
            hashProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        hashProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch current route");
                return ''.toRoute();
            },

            isHashBased: function () {
                ok(true, "should check if route is purely hash based");
                return false;
            },

            _documentLocationSetterProxy: function (hash) {
                equal(hash, '/#foo', "should redirect to new page with hash in it");
            }
        });

        strictEqual(hashProxy.setRoute('foo'.toRoute()), hashProxy, "should be chainable");
    });
}());
