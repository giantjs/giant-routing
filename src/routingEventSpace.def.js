/*global giant */
giant.postpone(giant, 'routingEventSpace', function () {
    "use strict";

    /**
     * Dedicated event space for routing events.
     * @type {giant.EventSpace}
     */
    giant.routingEventSpace = giant.EventSpace.create();
});
