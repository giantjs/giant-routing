$oop.postpone($routing, 'HashProxy', function () {
    "use strict";

    var base = $routing.LocationProxy,
        self = base.extend();

    /**
     * Creates a HashProxy instance.
     * You may create a HashProxy instance by instantiating LocationProxy under a browser environment,
     * and when the config variable $routing.usePushState is set to false (default).
     * @name $routing.HashProxy.create
     * @function
     * @returns {$routing.HashProxy}
     */

    /**
     * Implements low-level routing for URL hash-based applications.
     * @class
     * @extends $routing.LocationProxy
     */
    $routing.HashProxy = self
        .addPrivateMethods(/** @lends $routing.HashProxy# */{
            /**
             * Effectuates the specified hash in the URL.
             * @param {string} hash Valid hash expression ("#foo")
             * @private
             */
            _hashSetterProxy: function (hash) {
                window.location.hash = hash;
            },

            /**
             * Retrieves the current hash from the URL.
             * @returns {string}
             * @private
             */
            _hashGetterProxy: function () {
                return window.location.hash;
            },

            /**
             * @param {string} location
             * @private
             */
            _documentLocationSetterProxy: function (location) {
                document.location = location;
            }
        })
        .addMethods(/** @lends $routing.HashProxy# */{
            /**
             * Fetches the current application route based on URL hash.
             * @returns {$routing.Route}
             */
            getRoute: function () {
                var hash = this._hashGetterProxy(),
                    path = hash.substr(1);
                return path.toRoute();
            },

            /**
             * Sets the current application state via the URL hash.
             * @param {$routing.Route} route
             * @returns {$routing.HashProxy}
             */
            setRoute: function (route) {
                $assertion.isRoute(route, "Invalid route");
                var hash = '#' + route.toString();
                this._hashSetterProxy(hash);
                return this;
            },

            /**
             * TODO: Handler should not call another handler.
             * @param {Event} event
             * @ignore
             */
            onRouteChange: function (event) {
                $routing.Router.create().onRouteChange(event);
            }
        });
});

$oop.amendPostponed($routing, 'LocationProxy', function () {
    "use strict";

    $routing.LocationProxy
        .addSurrogate($routing, 'HashProxy', function () {
            return window && $routing.usePushState === false;
        });
});

(function () {
    "use strict";

    if (window) {
        // reacting to hash changes
        window.addEventListener('hashchange', function (event) {
            if (!$routing.usePushState) {
                event.originalEvent = $event.originalEventStack.getLastEvent();
                $routing.LocationProxy.create().onRouteChange(event);
            }
        });
    }
}());
