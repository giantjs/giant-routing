/*global giant */
giant.postpone(giant, 'HashProxy', function () {
    "use strict";

    var base = giant.LocationProxy,
        self = base.extend();

    /**
     * Creates a HashProxy instance.
     * You may create a HashProxy instance by instantiating LocationProxy under a browser environment,
     * and when the config variable giant.usePushState is set to false (default).
     * @name giant.HashProxy.create
     * @function
     * @returns {giant.HashProxy}
     */

    /**
     * Implements low-level routing for URL hash-based applications.
     * @class
     * @extends giant.LocationProxy
     */
    giant.HashProxy = self
        .addPrivateMethods(/** @lends giant.HashProxy# */{
            /**
             * Effectuates the specified hash in the URL.
             * @param {string} hash Valid hash expression ("#foo")
             * @private
             */
            _hashSetterProxy: function (hash) {
                window.location.hash = hash;
            },

            /**
             * @param {string} location
             * @private
             */
            _documentLocationSetterProxy: function (location) {
                document.location = location;
            }
        })
        .addMethods(/** @lends giant.HashProxy# */{
            /**
             * Sets the current application state via the URL hash.
             * @param {giant.Route} route
             * @returns {giant.HashProxy}
             */
            setRoute: function (route) {
                $assertion.isRoute(route, "Invalid route");

                var currentRoute = this.getRoute(),
                    hash = '#' + route.toString();

                if (!currentRoute.equals(route)) {
                    if (this.isHashBased()) {
                        // current route is hash-based
                        // setting new route as hash
                        this._hashSetterProxy(hash);
                    } else {
                        // hard re-directing to application root, with full route specified as hash
                        this._documentLocationSetterProxy('/' + hash);
                    }
                }

                return this;
            },

            /**
             * TODO: Handler should not call another handler.
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
        .addSurrogate(giant, 'HashProxy', function () {
            return window && giant.usePushState === false;
        });
});

(function () {
    "use strict";

    if (window) {
        // reacting to hash changes
        window.addEventListener('hashchange', function (event) {
            if (!giant.usePushState) {
                giant.LocationProxy.create().onRouteChange(event);
            }
        });
    }
}());
