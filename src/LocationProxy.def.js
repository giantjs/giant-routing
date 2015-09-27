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
        .addMethods(/** @lends $routing.LocationProxy# */{
            /** @ignore */
            init: function () {
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
