/*global giant */
giant.postpone(giant, 'RoutingEvent', function () {
    "use strict";

    var base = giant.Event,
        self = base.extend();

    /**
     * Creates a RoutingEvent instance. A RoutingEvent will be created when Event is instantiated,
     * passing giant.eventSpace as the event space.
     * @name giant.RoutingEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {giant.EventSpace} eventSpace Event space associated with event
     * @returns {giant.RoutingEvent}
     */

    /**
     * Represents an event traversing the routing event space.
     * Carries information about the different route(s) involved.
     * @class
     * @extends giant.Event
     */
    giant.RoutingEvent = self
        .addMethods(/** @lends giant.RoutingEvent# */{
            /**
             * @param {string} eventName Event name
             * @param {giant.EventSpace} eventSpace Event space associated with event
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Route path before navigation.
                 * @type {giant.Route}
                 */
                this.beforeRoute = undefined;

                /**
                 * Route path after navigation.
                 * @type {giant.Route}
                 */
                this.afterRoute = undefined;
            },

            /**
             * Sets 'before' route path.
             * @param {giant.Route} beforeRoute
             * @returns {giant.RoutingEvent}
             */
            setBeforeRoute: function (beforeRoute) {
                $assertion.isRoute(beforeRoute, "Invalid before route");
                this.beforeRoute = beforeRoute;
                return this;
            },

            /**
             * Sets 'after' route path.
             * @param {giant.Route} afterRoute
             * @returns {giant.RoutingEvent}
             */
            setAfterRoute: function (afterRoute) {
                $assertion.isRoute(afterRoute, "Invalid after route");
                this.afterRoute = afterRoute;
                return this;
            },

            /**
             * Clones event.
             * @param {giant.Path} [currentPath]
             */
            clone: function (currentPath) {
                return base.clone.call(this, currentPath)
                    .setBeforeRoute(this.beforeRoute)
                    .setAfterRoute(this.afterRoute);
            }
        });
});

giant.amendPostponed(giant, 'Event', function () {
    "use strict";

    giant.Event
        .addSurrogate(giant, 'RoutingEvent', function (eventName) {
            var prefix = 'route';
            return eventName && eventName.substr(0, prefix.length) === prefix;
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends giant */{
        /**
         * Determines whether the specified expression is a routing event.
         * @param {giant.RoutingEvent} expr
         */
        isRoutingEvent: function (expr) {
            return giant.RoutingEvent.isBaseOf(expr);
        },

        /**
         * Determines whether the specified expression is a routing event. (optional)
         * @param {giant.RoutingEvent} expr
         */
        isRoutingEventOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   giant.RoutingEvent.isBaseOf(expr);
        }
    });
}());
