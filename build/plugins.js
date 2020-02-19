!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory(require("angular"), require("vue")) : "function" == typeof define && define.amd ? define("ngVue", [ "angular", "vue" ], factory) : global.ngVue = factory(global.angular, global.Vue);
}(this, function(angular, Vue) {
    "use strict";
    var angular__default = "default" in angular ? angular.default : angular;
    Vue = "default" in Vue ? Vue.default : Vue;
    var isEnvTestOrProduction = "undefined" != typeof process && void 0 !== process.env && ("test" === process.env.BABEL_ENV || "production" === process.env.NODE_ENV), warn = "undefined" == typeof console || "function" != typeof console.warn || isEnvTestOrProduction ? void 0 : console.warn.bind(console), logger = {
        warn: "function" == typeof warn ? warn : function() {}
    }, defineProperty = function(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }, _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }, pluginHooks = Object.create(null), defaultHooks = [ "beforeCreated", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed" ], vueHooks = Object.create(null);
    function addHooks(map, hooks) {
        hooks && Object.keys(hooks).forEach(function(h) {
            map[h] = map[h] ? map[h] : [], map[h].push(hooks[h]);
        });
    }
    function callHooks(map, name, callback) {
        var hooks = map[name];
        hooks && hooks.forEach(callback);
    }
    angular__default.module("ngVue.plugins", []).provider("$ngVue", [ "$injector", function($injector) {
        var _this = this, _inQuirkMode = !1, rootProps = {};
        this.activeQuirkMode = function() {
            _inQuirkMode = !0;
        }, this.enableVuex = function(store) {
            logger.warn("enableVuex() is deprecated and will be removed in a future release.\nConsider switching to setRootVueInstanceProps()."), 
            Object.assign(rootProps, {
                store: store
            });
        }, this.setRootVueInstanceProps = function(props) {
            Object.keys(props).filter(function(hookName) {
                return defaultHooks.includes(hookName);
            }).forEach(function(hookName) {
                return delete props[hookName];
            }), Object.assign(rootProps, props);
        };
        var defaultParent = void 0;
        this.setDefaultParent = function(parent) {
            defaultParent = parent;
        }, this.install = function(plugin) {
            var _plugin = plugin($injector), $name = _plugin.$name, $config = _plugin.$config, $plugin = _plugin.$plugin, $vue = _plugin.$vue;
            addHooks(pluginHooks, $plugin), addHooks(vueHooks, $vue), angular.extend(_this, defineProperty({}, $name, $config));
        }, this.$get = [ "$injector", function($injector) {
            var hookCallback, cb = function(hook) {
                hook($injector, Vue, this);
            };
            return callHooks(pluginHooks, "init", cb), Object.assign(rootProps, (hookCallback = cb, 
            Object.keys(vueHooks).reduce(function(available, name) {
                return _extends({}, available, defineProperty({}, name, function() {
                    var _cb = hookCallback.bind(this);
                    callHooks(vueHooks, name, _cb);
                }));
            }, {}))), {
                getRootProps: function() {
                    return rootProps;
                },
                getDefaultParent: function() {
                    return defaultParent;
                },
                inQuirkMode: function() {
                    return _inQuirkMode;
                }
            };
        } ];
    } ]);
    var registered = Object.create(null), lazyStringFilters = [];
    function addFilter(name, filter) {
        registered[name] = filter;
    }
    function registerFilters(filters) {
        angular.isArray(filters) ? lazyStringFilters = lazyStringFilters.concat(filters) : angular.isObject(filters) && Object.keys(filters).forEach(function(name) {
            addFilter(name, filters[name]);
        });
    }
    var ngFilters = function(Vue$$1) {
        Object.keys(registered).forEach(function(name) {
            return Vue$$1.filter(name, registered[name]);
        });
    }, onPluginInit = function($injector, Vue$$1) {
        !function($injector) {
            var $filter = $injector.get("$filter");
            lazyStringFilters.forEach(function(name) {
                addFilter(name, $filter(name));
            }), lazyStringFilters = [];
        }($injector), Vue$$1.use(ngFilters);
    };
    return angular__default.module("ngVue.plugins").config([ "$ngVueProvider", function($ngVueProvider) {
        $ngVueProvider.install(function() {
            return {
                $name: "filters",
                $config: {
                    register: registerFilters
                },
                $plugin: {
                    init: onPluginInit
                }
            };
        });
    } ]);
});
