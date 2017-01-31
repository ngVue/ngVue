# Plugins

> this is an experimental feature and still under development

What if I want to use Angular filters in VueJS templates? Is it possible to use vuex to manage the state? How can I reuse the business code in VueJS when the application is too deep into Angular 1.x? ... 

There are more complicated problems when we try to integrate Angular 1.x with VueJS. It is impossible to solve them all but it's important to provide flexibility for enhancement while keeping **ngVue** small and simple. So we introduce a new module **ngVue.plugins**.

## Table of Contents

- [the `$ngVue` factory](#the-ngvue-factory)
	- [available plugins](#available-plugins)
	- [API: `install(callback)`](#api-install-callback)
- [install a plugin](#install-a-plugin)
- [set up a plugin](#set-up-a-plugin)
- [write a plugin](#write-a-plugin)

## Usage

**ngVue.plugins** is a UMD module and you can use it in AMD, CommonJS and browser globals.

Make sure that AngularJS 1.x, VueJS and ngVue are loaded and then the plugins module. Register thees module as dependencies in your app: ngVue and ngVue.plugins:

```javascript
import Angular from 'angular'
import Vue from 'vue'
import 'ngVue'
import 'ngVue/build/plugins.js'

angular.module('yourApp', ['ngVue', 'ngVue.plugins'])
```

## the `$ngVue` factory

**ngVue.plugins** creates the Angular provider `$ngVue`. This provider is responsible for registering **plugins**. Those **plugins** control the Vue instances with the lifecycle hooks, so you can simply use VueJS plugins or retrieve Angular modules resolved by the inject service and then apply them to VueJS.

### available plugins

| name | description |
| --- | --- |
| [filters](./plugins.filters.md) | *(built-in)* register Angular filters to VueJS |

### API: `install(callback)`

The provider `$ngVue` has only one method `install` to use a plugin during the configuration phase of Angular.

**Arguments**

- `callback` (*Function*): the callback function receives the inject service `$injector` and this service injects the provider instances only. The callback should return a plain object `{$name[, $config, $vue, $plugin]}`: 

	- `$name` (*String*): required to avoid name collisions in the provider, it is used as the namespace in the `$ngVue` provider
	- `$config` (*Object*): optional, it contains the methods for users to set up the plugin and those methods will be exposed only to the namespace object created by `$name` in the `$ngVue` provider
	- `$vue` (*Object*): optional, it contains the lifecycle hooks of the Vue instances
	- `$plugin` (*Object*): optional, it contains the lifecycle hooks of the ngVue plugins

### lifecycle hooks

There are two types of lifecycle hooks:

| type | hook name |
| --- | --- |
| ngVue plugins | init |
| Vue instances | beforeCreated, created, beforeMount, mounted, beforeUpdate, updated, beforeDestroy, destroyed |

For the ngVue plugin hook `init`, it is invoked when the service `$ngVue` is instantiated by the inject service. It is when you can add global-level functionality to VueJS.

The Vue instance hooks will be invoked when any Vue instance in Angular application calls its own lifecycle hooks. You can subscribe those hooks to do anything with Angular services (it is not recommended to use Angular services in Vue components).

Those hooks share the same signature `($injector, Vue, context) => void`:

- ``$injector`` the injector service that can access to all the instantiated services
- ``Vue`` the base class of Vue instances
- ``context`` only useful for the Vue instance hooks, the context points to the Vue instance invoking it

## install a plugin

Require `ngVue.plugins` and the plugin module. That's it :-)

```javascript
angular.module('app', ['ngVue.plugins', 'custom.plugin'])
```

## set up a plugin

Each ngVue plugin has a namespace object (defined by the plugin's `$name`) and all the configuration options are contained there

```javascript
angular.module('app', ['ngVue.plugins', 'custom.plugin'])
	.config(function($ngVueProvider) {
		$ngVueProvider.namespace.configMethod()
	})
```

## write a plugin

Require the module `ngVue.plugins` and then install the plugin in `$ngVue` provider during the configuration phase:

```javascript
angular.module('custom.plugin', ['ngVue.plugins'])
	.config(function($ngVueProvider) {
		$ngVueProvider.install(($injector) => {
			// do something with other providers injected by `$injector`
			return {
				$name: 'namespace',
				$config: { ...configMethod },
				$plugin: { ...pluginHooks },
				$vue: { ...vueHooks }
			}
		})
	})
```