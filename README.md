# ngVue

[![Build status](https://api.travis-ci.org/ngVue/ngVue.svg)](https://travis-ci.org/ngVue/ngVue) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![npm version](https://badge.fury.io/js/ngVue.svg)](https://badge.fury.io/js/ngVue) [![Dependency Status](https://david-dm.org/ngVue/ngVue.svg)](https://david-dm.org/ngVue/ngVue/)

[**VueJS**](https://vuejs.org/) is a library to build web interfaces with composable view components and reactive data binding. **ngVue**, inspired by [ngReact](https://github.com/ngReact/ngReact), is an Angular module that allows you to develop/use Vue components in AngularJS applications. ngVue can be used in the existing Angular applications and helps migrate the view parts of the application from Angular 1.x to Vue 2.

The motivation for this is similar to ngReact's:

- The AngularJS application suffers from a performance bottleneck due to a huge amount of scope watchers on the page, but VueJS offers an amazing reactive data-binding mechanism and other optimizations
- Instead of two-way data flow between controllers and views, VueJS defaults to a one-way, parent-to-child data flow between components which makes the application more predictable
- VueJS offers a much easier way to compose the web interfaces, and you can take advantage of the functional reactive programming in VueJS 2. Angular directives introduce a high learning barrier, such as the compile and link function, and the directives are prone to get confused with the components
- The VueJS community offers a component or a UI framework that you would like to try out
- Too deep into an AngularJS application to move it away from the code but you would like to experiment with VueJS

## Features

**ngVue** is composed of a directive `vue-component`, a factory `createVueComponent` and a directive helper `vdirectives`. It also provides some plugins for enhancement.

- `vue-component` is a directive that delegates data to a Vue component so VueJS can compile it with the corresponding nodes
- `createVueComponent` is a factory that converts a Vue component into a `vue-component` directive

**ngVue** does support VueJS directives but currently they only work with a Vue component in AngularJS templates.

- `vdirectives` is a directive to apply the vue directives to the vue components

```javascript
// This won't work
<div vdirectives="hello"></div>

// But this will work ...
<vue-component name="HelloComponent" vdirectives="hello"></vue-component>
// Or ...
<hello-component vdirectives="hello"></hello-component>
```

### the `vue-component` directive

The `vue-component` directive wraps the vue component into an angular directive so that the vue component can be created and initialized while the angular is compiling the templates.

At first an **Angular controller** needs creating to declare the view data like this:

```javascript
const app = angular.module('vue.components', ['ngVue'])
  .controller('MainController', function () {
    this.person = {
      firstName: 'The',
      lastName: 'World'
    }
  })
```

Then declare **a Vue component** like this:

```jsx
const VComponent = Vue.component('hello-component', {
  props: {
    firstName: String,
    lastName: String
  },
  render (h) {
    return (
      <span>Hi, { this.firstName } { this.lastName }</span>
    )
  }
})
```

In the end, **register the Vue component** to the Angular module with `value` method like this:

```javascript
app.value('HelloComponent', VComponent);
```

Now you can use `hello-component` in Angular templates:

```html
<body ng-app="vue.components">
  <div class="hello-card"
       ng-controller="MainController as ctrl">
    <vue-component name="HelloComponent"
                   vprops="ctrl.person"
                   watch-depth="value" />
  </div>
</body>
```

The `vue-component` directive provides three main attributes:

- `name` attribute checks for Angular injectable of that name

- `vprops` attribute is a string expression evaluated to an object as the data exposed to Vue component

- `vprops-*` attribute allows you to name the partial data extracted from the angular scope. `vue-component` wraps them into a new object and pass it to the Vue component. For example `props-first-name` and `props-last-name` will create two properties `firstName` and `lastName` in a new object as the component data

```html
<vue-component vprops="ctrl.person" />
// equals to
<vue-component vprops-first-name="ctrl.person.firstName" vprops-last-name="ctrl.person.lastName" />
```

- `watch-depth` attribute indicates which watch strategy to detect the changes of the scope. The possible values as follows:

  | value                 | description                              |
  | --------------------- | ---------------------------------------- |
  | reference *(default)* | watches the object reference             |
  | collection            | same as angular `$watchCollection`, shallow watches the properties of the object: for arrays, it watches the array items; for object maps, it watches the properties |
  | value                 | deep watches every property inside the object |

**NOTE** the `value` strategy is not recommended because Angular copies the entire object and traverses every property insides to detect the changes in each digest cycle and it therefore causes a heavy computation.

### the `createVueComponent` factory

The `createVueComponent` factory creates a reusable Angular directive which is bound to a specific Vue component.

For example, with the `vue-component` directive as mentioned above, you have to register each Vue component with a string name and then write `<vue-component name="TheRegisteredName"></vue-component>` repeatedly. With this `createVueComponent` factory, however, you can create `<name-of-vue-component></name-of-vue-component>` directives and simply apply the exported Vue components to them.

The factory returns a plain `$compile` options object which describes how to compile the Angular directive with VueJS, and it takes the Vue component as the first argument:

```javascript
app.directive('helloComponent', function (createVueComponent) {
  return createVueComponent(VComponent)
})
```

Alternatively, the name of the Vue component registered by `angular.value` can also be provided to the factory:

```javascript
app.directive('helloComponent', function (createVueComponent) {
  return createVueComponent('HelloComponent')
})
```

## Plugins

> this is an experimental feature

What if I want to use Angular filters in VueJS templates? Is it possible to use vuex to manage the state? How can I reuse the business code in VueJS when the application is too deep into Angular 1.x? ... 

There are more complicated problems when we try to integrate Angular 1.x with VueJS. It is impossible to solve them all but it's important to provide flexibility for enhancement while keeping **ngVue** small and simple. So we introduce a new module **ngVue.plugins**.

### the `$ngVue` provider

> `$ngVue` is a built-in module for now but will be moved out from the module `ngVue` at a later time

**ngVue.plugins** creates the Angular provider `$ngVue`. This provider is responsible for registering **plugins**. Those **plugins** control the Vue instances with the lifecycle hooks, so you can simply use VueJS plugins or retrieve Angular modules resolved by the inject service and then apply them to VueJS.

#### API: `install(callback)`

The provider `$ngVue` has only one method `install` to use a plugin during the configuration phase of Angular.

**Arguments**

- `callback` (*Function*): the callback function receives the inject service `$injector` and this service injects the provider instances only. The callback should return a plain object `{$name[, $config, $vue, $plugin]}`: 

	- `$name` (*String*): required to avoid name collisions in the provider, it is used as the namespace in the `$ngVue` provider
	- `$config` (*Object*): optional, it contains the methods for users to set up the plugin and those methods will be exposed only to the namespace object created by `$name` in the `$ngVue` provider
	- `$vue` (*Object*): optional, it contains the lifecycle hooks of the Vue instances
	- `$plugin` (*Object*): optional, it contains the lifecycle hooks of the ngVue plugins

#### lifecycle hooks

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

### available plugins

- *(built-in)* ngVue.plugins.filter

### install a plugin

Require `ngVue.plugins` and the plugin module. That's it :-)

```javascript
angular.module('app', ['ngVue.plugins', 'custom.plugin'])
```

### set up a plugin

Each ngVue plugin has a namespace object (defined by the plugin's `$name`) and all the configuration options are contained there

```javascript
angular.module('app', ['ngVue.plugins', 'custom.plugin'])
	.config(function($ngVueProvider) {
		$ngVueProvider.namespace.configMethod()
	})
```

### write a plugin

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

## TODO

- [x] vue components
- [x] vue directives
- [ ] unit tests
- [x] docs + simple examples
- [x] ng filters in VueJS
- [ ] supports vuex
- [ ] performance optimization
