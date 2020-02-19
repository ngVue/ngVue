!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? factory(exports, require("angular"), require("vue")) : "function" == typeof define && define.amd ? define("ngVue", [ "exports", "angular", "vue" ], factory) : factory(global.ngVue = global.ngVue || {}, global.angular, global.Vue);
}(this, function(exports, angular, Vue) {
    "use strict";
    var angular__default = "default" in angular ? angular.default : angular;
    Vue = "default" in Vue ? Vue.default : Vue;
    var nestRE = /^(attrs|props|on|nativeOn|class|style|hook)$/, babelHelperVueJsxMergeProps = function(objs) {
        return objs.reduce(function(a, b) {
            var aa, bb, key, nestedKey, temp;
            for (key in b) if (aa = a[key], bb = b[key], aa && nestRE.test(key)) if ("class" === key && ("string" == typeof aa && (temp = aa, 
            a[key] = aa = {}, aa[temp] = !0), "string" == typeof bb && (temp = bb, b[key] = bb = {}, 
            bb[temp] = !0)), "on" === key || "nativeOn" === key || "hook" === key) for (nestedKey in bb) aa[nestedKey] = mergeFn(aa[nestedKey], bb[nestedKey]); else if (Array.isArray(aa)) a[key] = aa.concat(bb); else if (Array.isArray(bb)) a[key] = [ aa ].concat(bb); else for (nestedKey in bb) aa[nestedKey] = bb[nestedKey]; else a[key] = b[key];
            return a;
        }, {});
    };
    function mergeFn(a, b) {
        return function() {
            a && a.apply(this, arguments), b && b.apply(this, arguments);
        };
    }
    function extractExpressions(exprType, attributes) {
        var objectExprKey = {
            props: "vProps",
            data: "vData",
            on: "vOn"
        }[exprType], objectPropExprRegExp = new RegExp(objectExprKey, "i"), objectExpr = attributes[objectExprKey];
        if (angular__default.isDefined(objectExpr)) return objectExpr;
        var expressions = void 0;
        if (0 === (expressions = "htmlAttributes" === exprType ? function(attributes) {
            return Object.keys(attributes).filter(function(attr) {
                var isSpecialAttr = /^(vProps|vData|vOn|vDirectives|watchDepth|ng)/i.test(attr), isJqliteProperty = "$" === attr[0];
                return !isSpecialAttr && !isJqliteProperty && "class" !== attr && "style" !== attr;
            });
        }(attributes) : Object.keys(attributes).filter(function(attr) {
            return objectPropExprRegExp.test(attr);
        })).length) return null;
        var exprsMap = {};
        return expressions.forEach(function(attrExprName) {
            if (objectExprKey) {
                var exprName = function(attrPropName, removedKey) {
                    if (!new RegExp("^" + removedKey).test(attrPropName)) return null;
                    var letter, propName = attrPropName.slice(removedKey.length);
                    return (letter = propName).charAt(0).toLowerCase() + letter.slice(1);
                }(attrExprName, objectExprKey);
                if (!exprName) return;
                exprsMap[exprName] = attributes[attrExprName], "vOn" === objectExprKey && (exprsMap[exprName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()] = attributes[attrExprName]);
            } else {
                var attrName = attributes.$attr[attrExprName], attrValue = void 0;
                attrValue = "" === attributes[attrExprName] ? "'" + attrExprName + "'" : attributes[attrExprName], 
                exprsMap[attrName] = attrValue;
            }
        }), exprsMap;
    }
    var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }, toConsumableArray = function(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        }
        return Array.from(arr);
    };
    function notify(setter, inQuirkMode) {
        return function(newVal) {
            var value = newVal;
            inQuirkMode && (value = angular.isArray(newVal) ? [].concat(toConsumableArray(newVal)) : angular.isObject(newVal) ? _extends({}, newVal) : newVal), 
            setter(value);
        };
    }
    function watchExpressions(dataExprsMap, reactiveData, options, scope, type) {
        var expressions = void 0;
        if ("props" === type ? expressions = dataExprsMap.props ? dataExprsMap.props : dataExprsMap.data : "attrs" === type && (expressions = dataExprsMap.htmlAttributes), 
        expressions) {
            var depth = options.depth, quirk = options.quirk, watcher = function(expressions, reactiveData, type) {
                return function(watchFunc) {
                    angular.isString(expressions) ? watchFunc(expressions, Vue.set.bind(Vue, reactiveData._v, type)) : Object.keys(expressions).forEach(function(name) {
                        watchFunc(expressions[name], Vue.set.bind(Vue, reactiveData._v[type], name));
                    });
                };
            }(expressions, reactiveData, type);
            switch (depth) {
              case "value":
                watcher(function(expression, setter) {
                    scope.$watch(expression, notify(setter, quirk), !0);
                });
                break;

              case "collection":
                watcher(function(expression, setter) {
                    scope.$watchCollection(expression, notify(setter, quirk));
                });
                break;

              case "reference":
              default:
                watcher(function(expression, setter) {
                    scope.$watch(expression, notify(setter, quirk));
                });
            }
        }
    }
    function evaluateValues(expr, scope) {
        if (!expr) return null;
        if (angular__default.isString(expr)) return scope.$eval(expr);
        var evaluatedValues = {};
        return Object.keys(expr).forEach(function(key) {
            evaluatedValues[key] = scope.$eval(expr[key]);
        }), evaluatedValues;
    }
    var transformers = {
        Object: function(value) {
            return [ value ];
        },
        Array: function(value) {
            return value;
        },
        String: function(value) {
            return value.split(/\s*,\s*/g).filter(Boolean).map(function(name) {
                return {
                    name: name
                };
            });
        }
    };
    var SPECIAL_ATTRIBUTE_KEYS = [ "class", "style" ];
    function ngVueLinker(componentName, jqElement, elAttributes, scope, $injector) {
        if (!jqElement.parent().length) throw new Error("ngVue components must have a parent tag or they will not render");
        var attributes, $ngVue = $injector.has("$ngVue") ? $injector.get("$ngVue") : null, dataExprsMap = {
            data: extractExpressions("data", attributes = elAttributes),
            props: extractExpressions("props", attributes),
            events: extractExpressions("on", attributes),
            htmlAttributes: extractExpressions("htmlAttributes", attributes)
        }, Component = function(name, $injector) {
            return angular__default.isFunction(name) ? name : $injector.get(name);
        }(componentName, $injector), directives = function(attributes, scope) {
            var directivesExpr = attributes.vDirectives;
            if (angular__default.isUndefined(directivesExpr)) return null;
            var directives = scope.$eval(directivesExpr), transformer = transformers[directives.constructor.name];
            return transformer ? transformer(directives) : null;
        }(elAttributes, scope) || [], reactiveData = {
            _v: {
                props: evaluateValues(dataExprsMap.props || dataExprsMap.data, scope) || {},
                attrs: evaluateValues(dataExprsMap.htmlAttributes, scope) || {},
                special: function(attributes) {
                    return SPECIAL_ATTRIBUTE_KEYS.reduce(function(specialAttributes, key) {
                        var value = attributes[key];
                        return (value || attributes[attributes.$normalize("ng-" + key)]) && (specialAttributes[key] = value), 
                        specialAttributes;
                    }, {});
                }(elAttributes)
            }
        }, on = function(dataExprsMap, scope) {
            var events = dataExprsMap.events;
            if (!events || !angular__default.isObject(events)) return null;
            var evaluatedEvents = {};
            return Object.keys(events).forEach(function(eventName) {
                evaluatedEvents[eventName] = scope.$eval(events[eventName]);
                var fn = evaluatedEvents[eventName];
                angular__default.isFunction(fn) && (evaluatedEvents[eventName] = function() {
                    var _arguments = arguments;
                    return scope.$evalAsync(function() {
                        return fn.apply(null, _arguments);
                    });
                });
            }), evaluatedEvents;
        }(dataExprsMap, scope) || {}, inQuirkMode = !!$ngVue && $ngVue.inQuirkMode(), rootProps = $ngVue ? $ngVue.getRootProps() : {}, parent = $ngVue && $ngVue.getDefaultParent(), mounted = rootProps.mounted;
        rootProps.mounted = function() {
            var element = jqElement[0];
            if (element.innerHTML.trim()) {
                var html = void 0;
                if (0 === element.children.length) {
                    var span = document.createElement("span");
                    span.innerHTML = element.innerHTML.trim(), html = span;
                } else html = element.children[0];
                var slot = this.$refs.__slot__;
                slot.parentNode.replaceChild(html, slot);
            }
            angular__default.isFunction(mounted) && mounted.apply(this, arguments);
        };
        var watchOptions = {
            depth: elAttributes.watchDepth,
            quirk: inQuirkMode
        };
        watchExpressions(dataExprsMap, reactiveData, watchOptions, scope, "props"), watchExpressions(dataExprsMap, reactiveData, watchOptions, scope, "attrs"), 
        function(reactiveData, element, scope) {
            Object.keys(reactiveData._v.special).forEach(function(key) {
                scope.$watch(function() {
                    return element.attr(key);
                }, function(newValue) {
                    Vue.set(reactiveData._v.special, key, newValue);
                });
            });
        }(reactiveData, jqElement, scope);
        var vueInstance = new Vue(_extends({
            name: "NgVue",
            el: jqElement[0],
            data: reactiveData,
            parent: parent,
            render: function(h) {
                return h(Component, babelHelperVueJsxMergeProps([ {
                    directives: directives
                }, {
                    props: reactiveData._v.props,
                    on: on,
                    attrs: reactiveData._v.attrs
                }, reactiveData._v.special ]), [ h("span", {
                    ref: "__slot__"
                }) ]);
            }
        }, rootProps));
        scope.$on("$destroy", function() {
            vueInstance.$destroy(), angular__default.element(vueInstance.$el).remove(), vueInstance = null;
        });
    }
    var isEnvTestOrProduction = "undefined" != typeof process && void 0 !== process.env && ("test" === process.env.BABEL_ENV || "production" === process.env.NODE_ENV), warn = "undefined" == typeof console || "function" != typeof console.warn || isEnvTestOrProduction ? void 0 : console.warn.bind(console), logger = {
        warn: "function" == typeof warn ? warn : function() {}
    };
    var ngVue = angular__default.module("ngVue", []).run(function() {
        logger.warn("camelCase syntax for events name (in $emit function) will be deprecated in a future release.\nPlease, make sure to use kebab-case syntax when emitting events from Vue.");
    }).directive("vueComponent", [ "$injector", function($injector) {
        return {
            restrict: "E",
            link: function(scope, elem, attrs) {
                ngVueLinker(attrs.name, elem, attrs, scope, $injector);
            }
        };
    } ]).factory("createVueComponent", [ "$injector", function($injector) {
        return function(componentName, ngDirectiveConfig) {
            var config = {
                restrict: "E",
                link: function(scope, elem, attrs) {
                    ngVueLinker(componentName, elem, attrs, scope, $injector);
                }
            };
            return angular__default.extend(config, ngDirectiveConfig);
        };
    } ]);
    exports.ngVue = ngVue, Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
