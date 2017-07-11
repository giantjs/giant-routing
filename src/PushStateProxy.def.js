$oop.postpone($routing, 'PushStateProxy', function () {
    "use strict";

    var base = $routing.LocationProxy,
        self = base.extend();

    /**
     * Creates a PushStateProxy instance.
     * You may create a HashProxy instance by instantiating LocationProxy under a browser environment,
     * and when the config variable $routing.usePushState is set to true (false by default).
     * @name $routing.PushStateProxy.create
     * @function
     * @returns {$routing.PushStateProxy}
     */

    /**
     * Implements low-level routing for pushstate-based applications.
     * @class
     * @extends $routing.LocationProxy
     */
    $routing.PushStateProxy = self
        .addPrivateMethods(/** @lends $routing.PushStateProxy# */{
            /**
             * @returns {string}
             * @private
             */
            _pathNameGetterProxy: function () {
                return window.location.pathname;
            },

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
                customEvent.originalEvent = $event.originalEventStack.getLastEvent();
                this._dispatchEventProxy(customEvent);
            }
        })
        .addMethods(/** @lends $routing.PushStateProxy# */{
            /**
             * Retrieves the current application route based on location path.
             * @returns {$routing.Route}
             */
            getRoute: function () {
                var path = this._pathNameGetterProxy();
                path = path.substr(1);
                return path.toRoute();
            },

            /**
             * Sets the current application route based on pushstate.
             * @param {$routing.Route} route
             * @returns {$routing.PushStateProxy}
             */
            setRoute: function (route) {
                $assertion.isRoute(route, "Invalid route");

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
                $routing.Router.create().onRouteChange(event);
            }
        });
});

$oop.amendPostponed($routing, 'LocationProxy', function () {
    "use strict";

    $routing.LocationProxy
        .addSurrogate($routing, 'PushStateProxy', function () {
            return window && $routing.usePushState === true;
        });
});

(function () {
    "use strict";

    if (window) {
        // reacting to hash changes
        window.addEventListener('popstate', function (event) {
            if ($routing.usePushState) {
                event.originalEvent = $event.originalEventStack.getLastEvent();
                $routing.LocationProxy.create().onRouteChange(event);
            }
        });
    }

    if (document) {
        document.addEventListener('faux-popstate', function (event) {
            if ($routing.usePushState) {
                $routing.LocationProxy.create().onRouteChange(event);
            }
        });
    }
}());
