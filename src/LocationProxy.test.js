(function () {
    "use strict";

    module("LocationProxy");

    test("Path name based tester", function () {
        var locationProxy = $routing.LocationProxy.create();

        locationProxy.addMocks({
            _pathNameGetterProxy: function () {
                return '/';
            },

            _hashGetterProxy: function () {
                return '';
            }
        });

        ok(locationProxy.isPathNameBased(), "should return true when there is no hash component");

        locationProxy
            .removeMocks()
            .addMocks({
                _pathNameGetterProxy: function () {
                    return '/foo';
                },

                _hashGetterProxy: function () {
                    return '#bar';
                }
            });

        ok(!locationProxy.isPathNameBased(), "should return false when there is hash component");
    });

    test("Hash based tester", function () {
        var locationProxy = $routing.LocationProxy.create();

        locationProxy.addMocks({
            _pathNameGetterProxy: function () {
                return '/';
            },

            _hashGetterProxy: function () {
                return '';
            }
        });

        ok(locationProxy.isHashBased(), "should return true when there is no path name component");

        locationProxy
            .removeMocks()
            .addMocks({
                _pathNameGetterProxy: function () {
                    return '/foo';
                },

                _hashGetterProxy: function () {
                    return '#bar';
                }
            });

        ok(!locationProxy.isHashBased(), "should return false when there is path name component");
    });

    test("Route getter", function () {
        var locationProxy = $routing.LocationProxy.create(),
            route;

        locationProxy.addMocks({
            _pathNameGetterProxy: function () {
                return '/foo/bar';
            },

            _hashGetterProxy: function () {
                return '';
            }
        });

        route = locationProxy.getRoute();
        ok(route.isA($routing.Route), "should return Route instance");
        ok(route.equals('foo/bar'.toRoute()), "should include path name when only path name is populated");

        locationProxy
            .removeMocks()
            .addMocks({
                _pathNameGetterProxy: function () {
                    return '/';
                },

                _hashGetterProxy: function () {
                    return '#baz/qux';
                }
            });

        route = locationProxy.getRoute();
        ok(route.equals('baz/qux'.toRoute()), "should include hash when only hash is populated");

        locationProxy
            .removeMocks()
            .addMocks({
                _pathNameGetterProxy: function () {
                    return '/foo/bar';
                },

                _hashGetterProxy: function () {
                    return '#baz/qux';
                }
            });

        route = locationProxy.getRoute();
        ok(route.equals('foo/bar/baz/qux'.toRoute()),
            "should include both path name and hash when both are populated");
    });
}());
