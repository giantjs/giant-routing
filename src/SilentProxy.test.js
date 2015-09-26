(function () {
    "use strict";

    module("SilentProxy", {
        setup: function () {
            $routing.SilentProxy.currentRoute = undefined;
        }
    });

    test("Route getter", function () {
        var locationProxy = $routing.SilentProxy.create(),
            currentRoute = {};

        $routing.SilentProxy.currentRoute = currentRoute;

        strictEqual(locationProxy.getRoute(), currentRoute, "should return route instance stored on class");
    });

    test("Route setter", function () {
        expect(6);

        var locationProxy = $routing.SilentProxy.create();

        throws(function () {
            locationProxy.setRoute();
        }, "should raise exception on missing arguments");

        throws(function () {
            locationProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        $routing.Router.addMocks({
            onRouteChange: function (event) {
                strictEqual(event, $event.originalEventStack.getLastEvent(),
                    "should call main route change handler with last original event");
            }
        });

        strictEqual(locationProxy.setRoute('foo'.toRoute()), locationProxy, "should be chainable");

        $routing.Router.removeMocks();

        ok($routing.SilentProxy.currentRoute.isA($routing.Route), "should set current route as Route instance");
        equal($routing.SilentProxy.currentRoute.toString(), 'foo', "should set current route on class");
    });
}());
