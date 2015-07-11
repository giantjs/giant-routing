/*global giant */
giant.postpone(giant, 'SilentProxy', function () {
    "use strict";

    var base = giant.LocationProxy,
        self = base.extend();

    /**
     * Creates a SilentProxy instance.
     * You may create a SilentProxy instance by instantiating LocationProxy,
     * in an environment that has no window global object (eg. node).
     * @name giant.SilentProxy.create
     * @function
     * @returns {giant.SilentProxy}
     */

    /**
     * Silent location proxy for cases when neither HashProxy nor PushStateProxy is applicable (eg. under node).
     * @class
     * @extends giant.LocationProxy
     */
    giant.SilentProxy = self
        .addPublic(/** @lends giant.SilentProxy */{
            /**
             * Stores the current (fake) application route.
             * @type {giant.Route}
             */
            currentRoute: undefined
        })
        .addMethods(/** @lends giant.SilentProxy# */{
            /**
             * Retrieves the current (fake) application route.
             * @returns {giant.Route}
             */
            getRoute: function () {
                return self.currentRoute;
            },

            /**
             * Sets the current (fake) application route.
             * @param {giant.Route} route
             * @returns {giant.SilentProxy}
             */
            setRoute: function (route) {
                giant.isRoute(route, "Invalid route");

                self.currentRoute = route;

                // calling main location change handler with current last original event
                giant.Router.create().onRouteChange(giant.originalEventStack.getLastEvent());

                return this;
            }
        });
});

giant.amendPostponed(giant, 'LocationProxy', function () {
    "use strict";

    giant.LocationProxy
        .addSurrogate(giant, 'SilentProxy', function () {
            return !window;
        });
});
