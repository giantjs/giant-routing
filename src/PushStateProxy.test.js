(function () {
    "use strict";

    module("PushStateProxy", {
        setup   : function () {
            $routing.usePushState = true;
        },
        teardown: function () {
            $routing.usePushState = false;
        }
    });

    test("Conversion from LocationHash", function () {
        var locationProxy = $routing.LocationProxy.create();
        ok(locationProxy.isA($routing.PushStateProxy), "should return PushStateProxy instance");
    });

    test("Changing push state path", function () {
        expect(6);

        var pushStateProxy = $routing.PushStateProxy.create();

        throws(function () {
            pushStateProxy.setRoute();
        }, "should raise exception on missing arguments");

        throws(function () {
            pushStateProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        pushStateProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch current route");
                return ''.toRoute();
            },

            _pushStateProxy: function (state, title, url) {
                equal(url, '/bar', "should push history state with correct URL");
            },

            _triggerFauxPopState: function () {
                ok(true, "should trigger faux popstate");
            }
        });

        strictEqual(pushStateProxy.setRoute('bar'.toRoute()), pushStateProxy, "should be chainable");
    });
}());
