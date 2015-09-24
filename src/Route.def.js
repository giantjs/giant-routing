/*global giant */
$oop.postpone(giant, 'Route', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTraitAndExtend($event.Evented);

    /**
     * Creates a Route instance.
     * You may create route instances by conversion from string, array, and $data.Path instances
     * by calling '.toRoute()' on them.
     * @example
     * 'user/joe'.toRoute().navigateTo();
     * // or to capture events
     * [].toRoute().subscribeTo(...);
     * @name giant.Route.create
     * @function
     * @param {$data.Path} routePath
     * @returns {giant.Route}
     */

    /**
     * Describes an application route, which reflects the current state of the application.
     * The same route should generally yield the same application state when applied via the routing
     * mechanism.
     * This is the class you'll ultimately use for routing, both for navigation and for intercepting routing events.
     * @class
     * @extends $oop.Base
     * @extends $event.Evented
     */
    giant.Route = self
        .addConstants(/** @lends giant.Route */{
            /**
             * Root path for all route event paths.
             * @constant
             * @type {string}
             */
            ROUTE_EVENT_PATH_ROOT: 'route'
        })
        .addMethods(/** @lends giant.Route# */{
            /**
             * @param {$data.Path} routePath
             * @ignore
             */
            init: function (routePath) {
                $assertion.isPath(routePath, "Invalid route path");

                /**
                 * Path associated with route.
                 * @type {$data.Path}
                 */
                this.routePath = routePath;

                var eventPath = routePath.clone()
                    .prependKey(this.ROUTE_EVENT_PATH_ROOT);

                // setting event path as self
                this.setEventSpace(giant.routingEventSpace)
                    .setEventPath(eventPath);
            },

            /**
             * Tells if the specified route is equivalent to the current one.
             * @param {giant.Route} route
             * @returns {boolean}
             */
            equals: function (route) {
                return route && this.routePath.equals(route.routePath);
            },

            /**
             * Navigates app to current route path.
             * @returns {giant.Route}
             */
            navigateTo: function () {
                giant.Router.create()
                    .navigateToRoute(this);
                return this;
            },

            /**
             * Navigates app to current route silently.
             * @returns {giant.Route}
             */
            navigateToSilent: function () {
                giant.Router.create()
                    .navigateToRouteSilent(this);
                return this;
            },

            /**
             * Navigates app to current route asynchronously.
             * Synchronous operations following the call to this method will complete before leaving the current route.
             * @returns {Q.Promise} Resolves eventually when the async call goes through.
             */
            navigateToAsync: function () {
                return giant.Router.create()
                    .navigateToRouteAsync(this);
            },

            /**
             * Navigates app to current route debounced. Subsequent calls to this method on equivalent routes
             * within the time window specified by `Router` will cancel and override previous ones.
             * @returns {Q.Promise} Resolves eventually when the last debounced call goes through.
             */
            navigateToDebounced: function () {
                return giant.Router.create()
                    .navigateToRouteDebounced(this);
            },

            /**
             * @returns {string}
             * @ignore
             */
            toString: function () {
                return this.routePath.asArray.join('/');
            }
        });
});

$oop.amendPostponed($data, 'Path', function () {
    "use strict";

    $data.Path.addMethods(/** @lends $data.Path */{
        /**
         * Converts normal path to route path.
         * @returns {giant.Route}
         */
        toRoute: function () {
            return giant.Route.create(this);
        }
    });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends giant */{
        /** @param {giant.Route} expr */
        isRoute: function (expr) {
            return giant.Route.isBaseOf(expr);
        },

        /** @param {giant.Route} [expr] */
        isRouteOptional: function (expr) {
            return typeof expr === 'undefined' ||
                giant.Route.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Creates a new Route instance based on the current string.
         * @returns {giant.Route}
         */
        toRoute: function () {
            return giant.Route.create(this.split('/').toPath());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new Route instance based on the current array.
         * @returns {giant.Route}
         */
        toRoute: function () {
            return giant.Route.create(this.toPath());
        }
    });
}());
