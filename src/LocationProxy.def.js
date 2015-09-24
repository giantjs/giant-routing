/*global $routing */
$oop.postpone($routing, 'LocationProxy', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates a LocationProxy instance.
     * Depending on the environment (window global), and config settings ($routing.usePushState),
     * different subclasses of LocationProxy may be returned: SilentProxy under node,
     * HashProxy, or PushStateProxy under browsers.
     * @name $routing.LocationProxy.create
     * @function
     * @returns {$routing.LocationProxy}
     */

    /**
     * Base class for low level routing.
     * @class
     * @extends $oop.Base
     */
    $routing.LocationProxy = self
        .addPrivateMethods(/** @lends $routing.LocationProxy# */{
            /**
             * @returns {string}
             * @private
             */
            _pathNameGetterProxy: function () {
                return window.location.pathname;
            },

            /**
             * Retrieves the current hash from the URL.
             * @returns {string}
             * @private
             */
            _hashGetterProxy: function () {
                return window.location.hash;
            }
        })
        .addMethods(/** @lends $routing.LocationProxy# */{
            /** @ignore */
            init: function () {
            },

            /**
             * Tests whether it is only the location path name contributing to the route.
             * @returns {boolean}
             */
            isPathNameBased: function () {
                return !this._hashGetterProxy();
            },

            /**
             * Tests whether it is only the location hash contributing to the route.
             * @returns {boolean}
             */
            isHashBased: function () {
                return this._pathNameGetterProxy().length <= 1;
            },

            /**
             * Fetches the current application route based on the current path and hash.
             * @returns {$routing.Route}
             */
            getRoute: function () {
                var pathName = this._pathNameGetterProxy().substr(1),
                    hash = this._hashGetterProxy().substr(1),
                    asArray = [];

                if (pathName) {
                    asArray.push(pathName);
                }

                if (hash) {
                    asArray.push(hash);
                }

                return asArray.join('/').toRoute();
            }
        });

    /**
     * Sets the current route.
     * @name $routing.LocationProxy#setRoute
     * @param {$routing.Route} route
     * @returns {$routing.LocationProxy}
     */

    /**
     * Triggered when the route changes.
     * @name $routing.LocationProxy#onRouteChange
     * @function
     * @param {Event} event
     */
});
