/*global giant */
(function () {
    "use strict";

    var router;

    module("Router", {
        setup: function () {
            giant.Router.clearInstanceRegistry();
            router = giant.Router.create();
        }
    });

    test("Applying route change", function () {
        expect(2);

        var routingEvent = giant.routingEventSpace.spawnEvent('giant.Router.route.foo')
            .setBeforeRoute('hello'.toRoute())
            .setAfterRoute('world'.toRoute());

        routingEvent.addMocks({
            triggerSync: function (targetPath) {
                strictEqual(targetPath, routingEvent.afterRoute.eventPath, "should fire event on before path");
            }
        });

        router._applyRouteChange(routingEvent);

        strictEqual(router.currentRoute, routingEvent.afterRoute,
            "should set currentRoute to the afterRoute property of the event");
    });

    test("Re-applying route change", function () {
        expect(1);

        giant.Router.clearInstanceRegistry();

        var routingEvent = giant.routingEventSpace.spawnEvent('giant.Router.route.foo')
            .setBeforeRoute('hello'.toRoute())
            .setAfterRoute('hello'.toRoute());

        routingEvent.addMocks({
            triggerSync: function () {
                ok(true, "should not fire event");
            }
        });

        router._applyRouteChange(routingEvent);

        equal(router.currentRoute.toString(), '', "should not alter the current route");
    });

    test("Pushing first routing event", function () {
        expect(4);

        var routingEvent = giant.routingEventSpace.spawnEvent('giant.Router.route.hello');

        router._nextRoutingEvents.addMocks({
            getItem: function (itemName) {
                equal(itemName, 'foo', "should fetch queue from collection");
            },

            setItem: function (itemName, itemValue) {
                equal(itemName, 'foo', "should set queue in collection");
                deepEqual(itemValue, [], "should pass empty queue to item setter");
                return giant.Collection.setItem.apply(this, arguments);
            }
        });

        router._pushRoutingEvent('foo', routingEvent);

        router._nextRoutingEvents.removeMocks();

        deepEqual(router._nextRoutingEvents.getItem('foo'), [routingEvent],
            "should add event to specified queue");
    });

    test("Pushing subsequent routing events", function () {
        expect(2);

        var routingEvent1 = giant.routingEventSpace.spawnEvent('giant.Router.route.hello'),
            routingEvent2 = giant.routingEventSpace.spawnEvent('giant.Router.route.world');

        router._pushRoutingEvent('foo', routingEvent1);

        router._nextRoutingEvents.addMocks({
            getItem: function (itemName) {
                equal(itemName, 'foo', "should fetch queue from collection");
                return giant.Collection.getItem.apply(this, arguments);
            }
        });

        router._pushRoutingEvent('foo', routingEvent2);

        router._nextRoutingEvents.removeMocks();

        deepEqual(router._nextRoutingEvents.getItem('foo'), [routingEvent1, routingEvent2],
            "should add event to specified queue");
    });

    test("Shifting routing event in queue", function () {
        expect(2);

        var queue = [1, 2, 3, 4];

        router._nextRoutingEvents.addMocks({
            getItem: function (itemName) {
                equal(itemName, 'foo', "should fetch queue from collection");
                return queue;
            }
        });

        router._shiftRoutingEvent('foo');

        router._nextRoutingEvents.removeMocks();

        deepEqual(queue, [2, 3, 4], "should shift specified queue contents by 1");
    });

    test("Instantiation", function () {
        giant.Router.clearInstanceRegistry();

        var router = giant.Router.create();

        ok(router.currentRoute.isA(giant.Route), "should set currentRoute property");
        ok(router.currentRoute.equals([].toRoute()), "should set currentRoute property to empty route");
        ok(router._nextRoutingEvents.isA(giant.Collection), "should set _nextRoutingEvents property");
        deepEqual(router._nextRoutingEvents.items, {},
            "should set contents of _nextRoutingEvents property to empty object");

        strictEqual(giant.Router.create(), router, "should be singleton");
    });

    test("Current route getter", function () {
        giant.HashProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch route from proxy");
                return 'foo/bar'.toRoute();
            }
        });

        var route = router.getCurrentRoute();

        giant.HashProxy.removeMocks();

        ok(route.isA(giant.Route), "should return a Route instance");
        ok(route.routePath.equals('foo>bar'.toPath()), "should set route path to current route's path");
    });

    test("Navigation", function () {
        expect(5);

        var route = 'foo/bar'.toRoute();

        router.currentRoute = 'foo/baz'.toRoute();

        giant.RoutingEvent.addMocks({
            setBeforeRoute: function (beforeRoute) {
                strictEqual(beforeRoute, router.currentRoute,
                    "should set before route to current route on router");
                return this;
            },

            setAfterRoute: function (afterRoute) {
                strictEqual(afterRoute, route, "should set after route to specified route");
                return this;
            },

            triggerSync: function (targetPath) {
                equal(this.eventName, giant.Router.EVENT_ROUTE_LEAVE, "should trigger route-leave event");
                strictEqual(targetPath, route.eventPath, "should trigger event on specified route");
                return this;
            }
        });

        strictEqual(router.navigateToRoute(route), router, "should be chainable");

        giant.RoutingEvent.removeMocks();
    });

    test("Navigation to the same route", function () {
        expect(0);

        var route = 'foo/bar'.toRoute();

        router.currentRoute = 'foo/bar'.toRoute();

        giant.RoutingEvent.addMocks({
            triggerSync: function () {
                ok(true, "should NOT trigger event");
            }
        });

        router.navigateToRoute(route);

        giant.RoutingEvent.removeMocks();
    });

    test("Silent navigation", function () {
        expect(4);

        var route = 'foo/bar'.toRoute(),
            routingEvent;

        router.currentRoute = 'foo/baz'.toRoute();

        giant.RoutingEvent.addMocks({
            setBeforeRoute: function (beforeRoute) {
                strictEqual(beforeRoute, router.currentRoute,
                    "should set before route to current route on router");
                return this;
            },

            setAfterRoute: function (afterRoute) {
                strictEqual(afterRoute, route, "should set after route to specified route");
                return routingEvent;
            }
        });

        router.addMocks({
            _applyRouteChange: function (leaveEvent) {
                strictEqual(leaveEvent, routingEvent, "should apply routing event");
            }
        });

        strictEqual(router.navigateToRouteSilent(route), router, "should be chainable");

        giant.RoutingEvent.removeMocks();
    });

    test("Silent navigation to the same route", function () {
        expect(0);

        var route = 'foo/bar'.toRoute();

        router.currentRoute = 'foo/bar'.toRoute();

        router.addMocks({
            _applyRouteChange: function () {
                ok(true, "should NOT apply route change");
            }
        });

        router.navigateToRouteSilent(route);
    });

    asyncTest("Asynchronous navigation", function () {
        var targetRoute = 'foo/bar'.toRoute();

        router.addMocks({
            navigateToRoute: function (route) {
                strictEqual(route, targetRoute, "should navigate to specified route");
            }
        });

        router.navigateToRouteAsync(targetRoute)
            .then(function () {
                ok(true, "should return promise that eventually resolves");
                start();
            });
    });

    asyncTest("Debounced navigation", function () {
        expect(2);

        giant.Router.clearInstanceRegistry();

        giant.Router.addMocks({
            navigateToRoute: function (route) {
                strictEqual(this, router, "should call navigation on router instance");
                strictEqual(route, targetRoute3, "should navigate to last route route");
            }
        });

        var router = giant.Router.create();

        var targetRoute1 = 'foo'.toRoute(),
            targetRoute2 = 'bar'.toRoute(),
            targetRoute3 = 'baz'.toRoute();

        router.navigateToRouteDebounced(targetRoute1)
            .then(function () {
                start();
            });

        router.navigateToRouteDebounced(targetRoute2);

        router.navigateToRouteDebounced(targetRoute3);

        giant.Router.removeMocks();
    });

    test("Route leave handler", function () {
        expect(8);

        var leaveEvent = giant.routingEventSpace.spawnEvent(giant.Router.EVENT_ROUTE_LEAVE)
                .setBeforeRoute('foo/bar'.toRoute())
                .setAfterRoute('hello/world'.toRoute()),
            routingEvent;

        giant.RoutingEvent.addMocks({
            setOriginalEvent: function (originalEvent) {
                routingEvent = this;

                equal(this.eventName, giant.Router.EVENT_ROUTE_CHANGE, "should spawn a route-leave event");
                strictEqual(originalEvent, leaveEvent,
                    "should set original event to leave event");
                return this;
            },

            setPayloadItems: function (payload) {
                strictEqual(payload, leaveEvent.payload,
                    "should set payload to leave event's payload");
                return this;
            },

            setBeforeRoute: function (beforeRoute) {
                strictEqual(beforeRoute, leaveEvent.beforeRoute,
                    "should set before route to leave event's before route");
                return this;
            },

            setAfterRoute: function (afterRoute) {
                strictEqual(afterRoute, leaveEvent.afterRoute,
                    "should set after route to leave event's after route");
                return this;
            }
        });

        giant.HashProxy.addMocks({
            setRoute: function (route) {
                equal(route.toString(), 'hello/world', "should set the current route");
            }
        });

        router.addMocks({
            _pushRoutingEvent: function (route, event) {
                equal(route.toString(), 'hello/world', "should pass right route to event pusher");
                strictEqual(event, routingEvent, "should push route change event to queue");
            }
        });

        router.onRouteLeave(leaveEvent);

        giant.RoutingEvent.removeMocks();
        giant.HashProxy.removeMocks();
    });

    test("Route change handler when URL has hash", function () {
        var event = giant.routingEventSpace.spawnEvent('giant.Router.route.foo');

        giant.HashProxy.addMocks({
            getRoute: function () {
                ok(true, "should get route from proxy");
                return 'foo/bar'.toRoute();
            }
        });

        router.addMocks({
            _shiftRoutingEvent: function (route) {
                equal(route.toString(), 'foo/bar', "should get next event matching route");
                return event;
            },

            _applyRouteChange: function (routingEvent) {
                strictEqual(routingEvent, event, "should apply routing event");
            }
        });

        router.onRouteChange();

        giant.HashProxy.removeMocks();
    });

    test("Hash change handler with no hash", function () {
        expect(5);

        var event = giant.routingEventSpace.spawnEvent('giant.Router.route.foo'),
            hashChangeEvent = {};

        giant.HashProxy.addMocks({
            getRoute: function () {
                return 'hello/world'.toRoute();
            }
        });

        router.addMocks({
            _shiftRoutingEvent: function () {
                ok(true, "should get next event matching hash");
                return undefined;
            },

            _applyRouteChange: function (routingEvent) {
                ok(routingEvent.isA(giant.RoutingEvent), "should apply a routing event");
                ok(routingEvent.beforeRoute.equals('foo/bar'.toRoute()), "should set before route to old hash");
                ok(routingEvent.afterRoute.equals('hello/world'.toRoute()), "should set after route to new hash");
                strictEqual(routingEvent.originalEvent, hashChangeEvent,
                    "should set original event to DOM hash event");
            }
        });

        giant.Router.create().currentRoute = 'foo/bar'.toRoute();

        router.onRouteChange(hashChangeEvent);

        giant.HashProxy.removeMocks();
    });

    test("Document load handler", function () {
        expect(5);

        var event = giant.routingEventSpace.spawnEvent('giant.Router.route.foo'),
            documentLoadEvent = {};

        giant.HashProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch the current route");
                return 'foo/bar'.toRoute();
            }
        });

        router.addMocks({
            _applyRouteChange: function (routingEvent) {
                ok(routingEvent.isA(giant.RoutingEvent), "should apply a routing event");
                equal(typeof routingEvent.beforeRoute, 'undefined', "should leave before route as undefined");
                ok(routingEvent.afterRoute.equals('foo/bar'.toRoute()), "should set after route to current hash");
                strictEqual(routingEvent.originalEvent, documentLoadEvent,
                    "should set original event to DOM hash event");
            }
        });

        router.onDocumentLoad(documentLoadEvent);

        giant.HashProxy.removeMocks();
    });

    test("Global route-leave handler", function () {
        expect(1);

        giant.Router.addMocks({
            onRouteLeave: function () {
                ok(true, "should call router's route-leave handler");
            }
        });

        giant.routingEventSpace.spawnEvent(giant.Router.EVENT_ROUTE_LEAVE)
            .triggerSync('foo/bar'.toRoute().eventPath);

        giant.Router.removeMocks();
    });
    //
    //    test("Global route-change handler", function () {
    //        expect(1);
    //
    //        function onRouteChange(event) {
    //            ok(event.originalPath.equals('route>hello>world'.toPath()), "should capture route changes");
    //        }
    //
    //        [].toRoute()
    //            .subscribeTo(giant.Router.EVENT_ROUTE_CHANGE, onRouteChange);
    //
    //        router.navigateToRoute('hello/world'.toRoute());
    //
    //        [].toRoute()
    //            .unsubscribeFrom(giant.Router.EVENT_ROUTE_CHANGE, onRouteChange);
    //    });
}());
