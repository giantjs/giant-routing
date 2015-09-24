/*global giant */
$oop.postpone(giant, 'routingEventSpace', function () {
    "use strict";

    /**
     * Dedicated event space for routing events.
     * @type {$event.EventSpace}
     */
    giant.routingEventSpace = $event.EventSpace.create();
});
