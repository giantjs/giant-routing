/*global giant, flock */
(function () {
    "use strict";

    module("SilentProxy", {
        setup: function () {
            giant.SilentProxy.currentRoute = undefined;
        }
    });

    test("Route getter", function () {
        var locationProxy = giant.SilentProxy.create(),
            currentRoute = {};

        giant.SilentProxy.currentRoute = currentRoute;

        strictEqual(locationProxy.getRoute(), currentRoute, "should return route instance stored on class");
    });

    test("Route setter", function () {
        expect(6);

        var locationProxy = giant.SilentProxy.create();

        throws(function () {
            locationProxy.setRoute();
        }, "should raise exception on missing arguments");

        throws(function () {
            locationProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        giant.Router.addMocks({
            onRouteChange: function (event) {
                strictEqual(event, $event.originalEventStack.getLastEvent(),
                    "should call main route change handler with last original event");
            }
        });

        strictEqual(locationProxy.setRoute('foo'.toRoute()), locationProxy, "should be chainable");

        giant.Router.removeMocks();

        ok(giant.SilentProxy.currentRoute.isA(giant.Route), "should set current route as Route instance");
        equal(giant.SilentProxy.currentRoute.toString(), 'foo', "should set current route on class");
    });
}());
