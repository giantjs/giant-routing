$oop.postpone($routing, 'Router', function () {
    "use strict";

    /**
     * Creates or returns the only Router instance that exists in the application.
     * @name $routing.Router.create
     * @function
     * @returns {$routing.Router}
     */

    /**
     * Deals with application routing according to changes in either URL hash, or location pushstate.
     * Triggers routing events in the global routing event space.
     * Singleton.
     * @class
     * @extends $oop.Base
     */
    $routing.Router = $oop.Base.extend()
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addConstants(/** @lends $routing.Router */{
            /**
             * Width of time window in which a new debounced navigation may override the previous one.
             * (Milliseconds)
             * @type {number}
             * @constant
             */
            NAVIGATION_DEBOUNCE_DELAY: 100
        })
        .addPrivateMethods(/** @lends $routing.Router */{
            /**
             * Applies route change as specified by the routing event.
             * @param {$routing.RoutingEvent} routingEvent
             * @private
             */
            _applyRouteChange: function (routingEvent) {
                var beforeRoute = routingEvent.beforeRoute,
                    afterRoute = routingEvent.afterRoute;

                if (!afterRoute.equals(beforeRoute)) {
                    // when route has changed
                    // setting route
                    this.currentRoute = afterRoute;

                    // triggering events for changed route
                    routingEvent.triggerSync(afterRoute.eventPath);
                }
            }
        })
        .addMethods(/** @lends $routing.Router# */{
            /** @ignore */
            init: function () {
                this.elevateMethod('navigateToRoute');

                /**
                 * Current application route.
                 * @type {$routing.Route}
                 */
                this.currentRoute = [].toRoute();

                /** @type {$routing.LocationProxy} */
                this.locationProxy = $routing.LocationProxy.create();

                /**
                 * Used in debounced navigation.
                 * @type {$utils.Debouncer}
                 */
                this.navigationDebouncer = this.navigateToRoute.toDebouncer();
            },

            /**
             * Retrieves the current hash as route path.
             * @returns {$routing.Route}
             */
            getCurrentRoute: function () {
                return this.locationProxy.getRoute();
            },

            /**
             * Sets the application route.
             * If route has nextOriginalEvent or nextPayload set, they will be transferred to the event.
             * @param {$routing.Route} route
             * @returns {$routing.Router}
             */
            navigateToRoute: function (route) {
                $assertion.isRoute(route, "Invalid route");

                if (!route.equals(this.currentRoute)) {
                    $routing.routingEventSpace.spawnEvent($routing.EVENT_ROUTE_LEAVE)
                        .setBeforeRoute(this.currentRoute)
                        .setAfterRoute(route)
                        .triggerSync(route.eventPath);
                }

                return this;
            },

            /**
             * Sets application route without altering the browser hash.
             * If route has nextOriginalEvent or nextPayload set, they will be transferred to the event.
             * @param {$routing.Route} route
             * @returns {$routing.Router}
             */
            navigateToRouteSilent: function (route) {
                $assertion.isRoute(route, "Invalid route");

                var routingEvent;

                if (!route.equals(this.currentRoute)) {
                    routingEvent = $routing.routingEventSpace.spawnEvent($routing.EVENT_ROUTE_CHANGE)
                        .setBeforeRoute(this.currentRoute)
                        .setAfterRoute(route);

                    this._applyRouteChange(routingEvent);
                }

                return this;
            },

            /**
             * Navigates to the specified route asynchronously.
             * Asynchronous navigation allows the application to complete any operation
             * before leaving the current route.
             * @param {$routing.Route} route
             * @returns {$utils.Promise}
             */
            navigateToRouteAsync: function (route) {
                var that = this,
                    deferred = $utils.Deferred.create();

                setTimeout(function () {
                    that.navigateToRoute(route);
                    deferred.resolve();
                }, 0);

                return deferred.promise;
            },

            /**
             * Navigates to the specified route de-bounced. Subsequent calls to debounced navigation
             * within the allotted time frame will override previous ones.
             * @param {$routing.Route} route
             * @returns {$utils.Promise}
             */
            navigateToRouteDebounced: function (route) {
                return this.navigationDebouncer.schedule(this.NAVIGATION_DEBOUNCE_DELAY, route);
            },

            /**
             * @param {$routing.RoutingEvent} event
             * @ignore
             */
            onRouteLeave: function (event) {
                if (event.defaultPrevented) {
                    return;
                }

                // resuming default behavior
                // modifying browser hash
                this.locationProxy.setRoute(event.afterRoute);
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onRouteChange: function (event) {
                var link = $event.pushOriginalEvent(event),
                    newRoute = this.locationProxy.getRoute(),
                    routingEvent = $routing.routingEventSpace.spawnEvent($routing.EVENT_ROUTE_CHANGE)
                        .setBeforeRoute(this.currentRoute)
                        .setAfterRoute(newRoute);

                this._applyRouteChange(routingEvent);

                link.unlink();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onDocumentLoad: function (event) {
                var link = $event.pushOriginalEvent(event),
                    routingEvent = $routing.routingEventSpace.spawnEvent($routing.EVENT_ROUTE_CHANGE)
                        .setAfterRoute(this.locationProxy.getRoute())
                        .setOriginalEvent(event);

                this._applyRouteChange(routingEvent);

                link.unlink();
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($routing, /** @lends $routing */{
        /**
         * Signals a route change.
         * @constant
         */
        EVENT_ROUTE_CHANGE: 'route.change',

        /**
         * Signals that a route was left.
         * @constant
         */
        EVENT_ROUTE_LEAVE: 'route.leave'
    });
}());

$oop.amendPostponed($routing, 'Route', function () {
    "use strict";

    [].toRoute()
        .subscribeTo($routing.EVENT_ROUTE_LEAVE, function (/**$routing.RoutingEvent*/event) {
            $routing.Router.create().onRouteLeave(event);
        });
});

$oop.postpone($routing, 'logRoutingEvents', function () {
    "use strict";

    $routing.logRoutingEvents = function () {
        [].toRoute()
            .subscribeTo($routing.EVENT_ROUTE_LEAVE, function (event) {
                console.info("route left", event.beforeRoute.toString(), event);
            })
            .subscribeTo($routing.EVENT_ROUTE_CHANGE, function (event) {
                console.info("route changed", event.afterRoute.toString(), event);
            });
    };
});

(function () {
    "use strict";

    if (document) {
        // running hash change handler when document loads
        document.addEventListener('DOMContentLoaded', function (event) {
            $routing.Router.create().onDocumentLoad(event);
        }, false);
    }
}());
