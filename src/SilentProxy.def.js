$oop.postpone($routing, 'SilentProxy', function () {
    "use strict";

    var base = $routing.LocationProxy,
        self = base.extend();

    /**
     * Creates a SilentProxy instance.
     * You may create a SilentProxy instance by instantiating LocationProxy,
     * in an environment that has no window global object (eg. node).
     * @name $routing.SilentProxy.create
     * @function
     * @returns {$routing.SilentProxy}
     */

    /**
     * Silent location proxy for cases when neither HashProxy nor PushStateProxy is applicable (eg. under node).
     * @class
     * @extends $routing.LocationProxy
     */
    $routing.SilentProxy = self
        .addPublic(/** @lends $routing.SilentProxy */{
            /**
             * Stores the current (fake) application route.
             * @type {$routing.Route}
             */
            currentRoute: undefined
        })
        .addMethods(/** @lends $routing.SilentProxy# */{
            /**
             * Retrieves the current (fake) application route.
             * @returns {$routing.Route}
             */
            getRoute: function () {
                return self.currentRoute;
            },

            /**
             * Sets the current (fake) application route.
             * @param {$routing.Route} route
             * @returns {$routing.SilentProxy}
             */
            setRoute: function (route) {
                $assertion.isRoute(route, "Invalid route");

                self.currentRoute = route;

                // calling main location change handler with current last original event
                $routing.Router.create().onRouteChange($event.originalEventStack.getLastEvent());

                return this;
            }
        });
});

$oop.amendPostponed($routing, 'LocationProxy', function () {
    "use strict";

    $routing.LocationProxy
        .addSurrogate($routing, 'SilentProxy', function () {
            return !window;
        });
});
