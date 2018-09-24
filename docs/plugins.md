# Plugins

> this is an experimental feature and still under development

What if I want to use Angular filters in Vue.js templates? Is it possible to use Vuex to manage the state? How can I reuse 
the business code in Vue.js when the application is too deep into Angular 1.x? ... 

There are more complicated problems when we try to integrate Angular 1.x with Vue.js. It is impossible to solve them all 
but it's important to provide flexibility for enhancement while keeping `ngVue` small and simple. So we introduce a 
new module `ngVue.plugins`.

## Table of Contents

- [the $ngVue factory](#the-ngvue-factory)
- [Plugins](#plugins)
	- [Available plugins](#available-plugins)
	- [API: install(callback)](#api-install-callback)
	- [How to install a plugin](#how-to-install-a-plugin)
	- [How to set up a plugin](#how-to-set-up-a-plugin)
	- [How to write a plugin](#how-to-write-a-plugin)
- [Quirk Mode](#quirk-mode)
- [Root Vue instance props](#Root-Vue-instance-props)
  - [Example: Vuex](#Example-Vuex)

## Usage

`ngVue.plugins` is a UMD module and you can use it in AMD, CommonJS and browser globals.

Make sure that AngularJS 1.x, Vue.js and ngVue are loaded and then the plugins module. Register thees module as dependencies in your app: ngVue and ngVue.plugins:

```javascript
import Angular from 'angular'
import Vue from 'vue'
import 'ngVue'
import 'ngVue/build/plugins.js'

angular.module('yourApp', ['ngVue', 'ngVue.plugins'])
```

## The `$ngVue` factory

`ngVue.plugins` creates an Angular service `$ngVue`. This service implements a **plugins** system and other functionality.
For the **plugins**, they will control the Vue instances with the lifecycle hooks, so you can use Vue.js plugins or use 
Angular factories/services resolved by the inject service to Vue.js.

## Plugins

### Available plugins

| name | description |
| --- | --- |
| [filters](./plugins.filters.md) | *(built-in)* register Angular filters to Vue.js |

### API: `install(callback)`

The provider `$ngVue` has only one method `install` to use a plugin during the configuration phase of Angular.

**Arguments**

- `callback` (*`Function`*): the callback function receives the inject service `$injector` and this service injects the 
  provider instances only. The callback should return a plain object `{$name[, $config, $vue, $plugin]}`: 
	- `$name` (*String*): required to avoid name collisions in the provider, it is used as the namespace in the `$ngVue` provider
	- `$config` (*Object*): optional, it contains the methods for users to set up the plugin and those methods will be exposed only to the namespace object created by `$name` in the `$ngVue` provider
	- `$vue` (*Object*): optional, it contains the lifecycle hooks of the Vue instances
	- `$plugin` (*Object*): optional, it contains the lifecycle hooks of the ngVue plugins

### Lifecycle hooks

There are two types of lifecycle hooks:

| type | hook name |
| --- | --- |
| ngVue plugins | init |
| Vue instances | beforeCreated, created, beforeMount, mounted, beforeUpdate, updated, beforeDestroy, destroyed |

For the ngVue plugin hook `init`, it is invoked when the service `$ngVue` is instantiated by the inject service. It is when you can add global-level functionality to Vue.js.

The Vue instance hooks will be invoked when any Vue instance in Angular application calls its own lifecycle hooks. You can subscribe those hooks to do anything with Angular services (it is not recommended to use Angular services in Vue components).

Those hooks share the same signature `($injector, Vue, context) => void`:

- ``$injector`` the injector service that can access to all the instantiated services
- ``Vue`` the base class of Vue instances
- ``context`` only useful for the Vue instance hooks, the context points to the Vue instance invoking it

### How to install a plugin

Require `ngVue.plugins` and the plugin module. That's it :-)

```javascript
angular.module('app', ['ngVue.plugins', 'custom.plugin'])
```

### How to set up a plugin

Each ngVue plugin has a namespace object (defined by the plugin's `$name`) and all the configuration options are contained there

```javascript
angular.module('app', ['ngVue.plugins', 'custom.plugin'])
  .config(function($ngVueProvider) {
    $ngVueProvider.namespace.configMethod()
  })
```

### How to write a plugin

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

## Quirk Mode

Vue.js cannot detect these changes on the scope objects while AngularJS can -- read about their differences in [Caveats](./caveats.md).

- dynamically add a new property to the reactive object: `vm.b = 'a'`
- delete a property from the object: `delete vm.b`
- set an array element with the index: `array[0] = newElement`
- modify the length of the array: `array.length = 0`

You have to mutate the scope object in a reactive way to trigger the view updates in Vue.js. You are likely to refactor all the controller code. So we introduce the quirk mode.

The quirk mode enables AngularJS to propagate all the watched changes to Vue.js and so you will not have to refactor any controller code to trigger the reactivity system to re-render the components.

You can activate it with `$ngVueProvider` during the config phase:

```javascript
angular.module('yourApp', ['ngVue', 'ngVue.plugins'])
  .config(($ngVueProvider) => {
    $ngVueProvider.activeQuirkMode()
  })
```

## Root Vue instance props
Sometimes a plugin requires you to pass extra properties to the root Vue instance in order to access its features on
any child component. You can use `$ngVueProvider` at a configuration phase of your Angular.js application to
pass such extra properties. This way you can inject Vuex's `store`, [Vue i18n](https://github.com/kazupon/vue-i18n)'s `i18n`, or your own [custom Vue.js 
plugin](https://vuejs.org/v2/guide/plugins.html) object.

```javascript
// app.js
import Vue from 'vue'
import myPlugin from './myPlugin'

Vue.use(myPlugin)
const myPluginFeature = new myPlugin.Feature()

angular.module('yourApp', ['ngVue', 'ngVue.plugins'])
  .config(($ngVueProvider) => {
    $ngVueProvider.setRootVueInstanceProps({
      myPluginFeature: myPluginFeature
    })
  })
```

> Note: Vue's instance [lifecycle hooks](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks) will be discarded when
> passed through `$ngVueProvider.setRootVueInstanceProps()` as there is already [a mechanism to handle lifecycle hooks](#Lifecycle-hooks)

### Example: Vuex
Vuex support is a bit opinionated and its implementation focuses on simplicity. You _must_ use `Vue.use(Vuex)`
to enable automatic injection of the store into child components.
Then, import (or define) your `Vuex.Store` instance and tell `ngVue` to use it on all Vue instances created by it.

You can enabled it during the configuration phase of the Angular.js app, using `$ngVueProvider.setRootVueInstanceProps()`:

```javascript
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: 'Hello from ngVue!'
  }
})
```

```javascript
// app.js
import store from './store'

angular.module('yourApp', ['ngVue', 'ngVue.plugins'])
  .config(($ngVueProvider) => {
    $ngVueProvider.setRootVueInstanceProps({
      store: store
    })
  })
```

All components created by `ngVue` will have access to `this.$store`, as described in the 
[Vuex documentation](https://vuex.vuejs.org/en/state.html)
