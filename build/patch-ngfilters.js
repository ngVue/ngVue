!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? factory(require("angular")) : "function" == typeof define && define.amd ? define("ngVue", [ "angular" ], factory) : factory(global.angular);
}(this, function(angular) {
    "use strict";
    angular = "default" in angular ? angular.default : angular;
    var originalModule = angular.module;
    function evaluateFilterFunction(name, def) {
        return obj = {}, key = name, value = def(), key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
        var obj, key, value;
    }
    function _hasDependence($injector, ngDef) {
        return 0 < $injector.annotate(ngDef).length;
    }
    angular.module = function(moduleName) {
        for (var _len = arguments.length, otherArgs = Array(1 < _len ? _len - 1 : 0), _key = 1; _key < _len; _key++) otherArgs[_key - 1] = arguments[_key];
        var module = originalModule.apply(void 0, [ moduleName ].concat(otherArgs)), $injector = angular.injector([ "ng", moduleName ]);
        if (!$injector.has("$ngVue")) throw new Error("ngVue.plugins should be required as a dependency in your application");
        var originalFilter = module.filter, filters = [];
        return module.provider("$ngVueFilter", [ "$filterProvider", "$ngVueProvider", function($filterProvider, $ngVueProvider) {
            this.register = function(name, ngDef) {
                $filterProvider.register(name, ngDef), _hasDependence($injector, ngDef) || $ngVueProvider.filters.register(evaluateFilterFunction(name, ngDef));
            }, this.$get = function() {};
        } ]), module.filter = function(name, ngDef) {
            return _hasDependence($injector, ngDef) || filters.push(evaluateFilterFunction(name, ngDef)), 
            originalFilter.apply(this, arguments);
        }, module.config([ "$ngVueProvider", function($ngVueProvider) {
            filters.forEach(function(f) {
                return $ngVueProvider.filters.register(f);
            }), filters = [];
        } ]), module;
    };
});
