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

    test("Route getter", function () {
        $routing.HashProxy.addMocks({
            _hashGetterProxy: function () {
                ok(true, "should fetch URL hash");
                return '#foo';
            }
        });

        var route = $routing.HashProxy.create().getRoute();

        ok(route.isA($routing.Route), "should return Route instance");
        equal(route.toString(), 'foo', "should set route content");

        $routing.HashProxy.removeMocks();
    });

    test("Changing route", function () {
        expect(4);

        var hashProxy = $routing.HashProxy.create();

        throws(function () {
            hashProxy.setRoute();
        }, "should raise exception on missing arguments");

        throws(function () {
            hashProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        hashProxy.addMocks({
            _hashSetterProxy: function (hash) {
                equal(hash, '#foo', "should set URL hash");
            }
        });

        strictEqual(hashProxy.setRoute('foo'.toRoute()), hashProxy, "should be chainable");
    });
}());
