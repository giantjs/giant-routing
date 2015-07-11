/*global giant, flock */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("PushStateProxy", {
        setup   : function () {
            giant.usePushState = true;
        },
        teardown: function () {
            giant.usePushState = false;
        }
    });

    test("Conversion from LocationHash", function () {
        var locationProxy = giant.LocationProxy.create();
        ok(locationProxy.isA(giant.PushStateProxy), "should return PushStateProxy instance");
    });

    test("Changing push state path", function () {
        expect(6);

        var pushStateProxy = giant.PushStateProxy.create();

        raises(function () {
            pushStateProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
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
