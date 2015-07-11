/*global giant, giant, giant, giant, giant */
giant.postpone(giant, 'PushStateProxy', function () {
    "use strict";

    var base = giant.LocationProxy,
        self = base.extend();

    /**
     * Creates a PushStateProxy instance.
     * You may create a HashProxy instance by instantiating LocationProxy under a browser environment,
     * and when the config variable giant.usePushState is set to true (false by default).
     * @name giant.PushStateProxy.create
     * @function
     * @returns {giant.PushStateProxy}
     */

    /**
     * Implements low-level routing for pushstate-based applications.
     * @class
     * @extends giant.LocationProxy
     */
    giant.PushStateProxy = self
        .addPrivateMethods(/** @lends giant.PushStateProxy# */{
            /**
             * @param {object} state
             * @param {string} title
             * @param {string} url
             * @private
             */
            _pushStateProxy: function (state, title, url) {
                return window.history.pushState(state, title, url);
            },

            /**
             * @param {string} eventName
             * @returns {Event}
             * @private
             */
            _createEventProxy: function (eventName) {
                return document.createEvent(eventName);
            },

            /**
             * @param {Event} event
             * @private
             */
            _dispatchEventProxy: function (event) {
                document.dispatchEvent(event);
            },

            /** @private */
            _triggerFauxPopState: function () {
                var customEvent = this._createEventProxy('CustomEvent');
                customEvent.initCustomEvent('faux-popstate', true, true, {});
                this._dispatchEventProxy(customEvent);
            }
        })
        .addMethods(/** @lends giant.PushStateProxy# */{
            /**
             * Sets the current application route based on pushstate.
             * @param {giant.Route} route
             * @returns {giant.PushStateProxy}
             */
            setRoute: function (route) {
                giant.isRoute(route, "Invalid route");

                var currentRoute = this.getRoute();
                if (!currentRoute.equals(route)) {
                    this._pushStateProxy(route.routePath, '', '/' + route.toString());
                    this._triggerFauxPopState();
                }

                return this;
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onRouteChange: function (event) {
                giant.Router.create().onRouteChange(event);
            }
        });
});

giant.amendPostponed(giant, 'LocationProxy', function () {
    "use strict";

    giant.LocationProxy
        .addSurrogate(giant, 'PushStateProxy', function () {
            return window && giant.usePushState === true;
        });
});

(function () {
    "use strict";

    if (window) {
        // reacting to hash changes
        window.addEventListener('popstate', function (event) {
            if (giant.usePushState) {
                giant.LocationProxy.create().onRouteChange(event);
            }
        });
    }

    if (document) {
        document.addEventListener('faux-popstate', function (event) {
            if (giant.usePushState) {
                giant.LocationProxy.create().onRouteChange(event);
            }
        });
    }
}());
