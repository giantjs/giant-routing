$oop.postpone($routing, 'routingEventSpace', function () {
    "use strict";

    /**
     * Dedicated event space for routing events.
     * @type {$event.EventSpace}
     */
    $routing.routingEventSpace = $event.EventSpace.create();
});
