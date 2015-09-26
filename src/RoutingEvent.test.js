(function () {
    "use strict";

    module("Routing Event");

    test("Instantiation", function () {
        var eventSpace = $event.EventSpace.create(),
            event = $routing.RoutingEvent.create('foo', eventSpace);

        ok(event.hasOwnProperty('beforeRoute'), "should add beforeRoute property");
        equal(typeof event.beforeRoute, 'undefined', "should set beforeRoute to undefined");
        ok(event.hasOwnProperty('afterRoute'), "should add afterRoute property");
        equal(typeof event.afterRoute, 'undefined', "should set afterRoute to undefined");
    });

    test("Conversion from Event", function () {
        var eventSpace = $event.EventSpace.create(),
            event;

        event = $event.Event.create('foo', eventSpace);
        ok(!event.isA($routing.RoutingEvent),
            "should not return RoutingEvent instance for event names with non-matching prefix");

        event = $event.Event.create('route.foo', eventSpace);
        ok(event.isA($routing.RoutingEvent),
            "should return RoutingEvent instance for event names with mathching prefix");
    });

    test("Before route setter", function () {
        var event = $routing.RoutingEvent.create('foo', $event.EventSpace.create());

        throws(function () {
            event.setBeforeRoute('foo');
        }, "should raise exception on invalid argument");

        strictEqual(event.setBeforeRoute('foo/bar'.toRoute()), event, "should be chainable");

        equal(event.beforeRoute.toString(), 'foo/bar', "should set beforeRoute property");
    });

    test("After route setter", function () {
        var event = $routing.RoutingEvent.create('foo', $event.EventSpace.create());

        throws(function () {
            event.setAfterRoute('foo');
        }, "should raise exception on invalid argument");

        strictEqual(event.setAfterRoute('foo/bar'.toRoute()), event, "should be chainable");

        equal(event.afterRoute.toString(), 'foo/bar', "should set afterRoute property");
    });

    test("Cloning", function () {
        var eventSpace = $event.EventSpace.create(),
            beforeRoute = 'foo'.toRoute(),
            afterRoute = 'bar'.toRoute(),
            event = $routing.RoutingEvent.create('foo', eventSpace)
                .setBeforeRoute(beforeRoute)
                .setAfterRoute(afterRoute),
            clonedEvent = event.clone('hello>world'.toPath());

        strictEqual(clonedEvent.beforeRoute, event.beforeRoute,
            "should set before route");
        strictEqual(clonedEvent.afterRoute, event.afterRoute,
            "should set after route");
    });
}());
