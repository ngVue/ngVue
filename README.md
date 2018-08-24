# ngVue

[![Build status](https://api.travis-ci.org/ngVue/ngVue.svg)](https://travis-ci.org/ngVue/ngVue) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![npm version](https://badge.fury.io/js/ngVue.svg)](https://badge.fury.io/js/ngVue) [![Dependency Status](https://david-dm.org/ngVue/ngVue.svg)](https://david-dm.org/ngVue/ngVue/) [![Monthly npm downloads](https://img.shields.io/npm/dm/ngVue.svg)](https://img.shields.io/npm/dm/ngVue.svg)

[**VueJS**](https://vuejs.org/) is a library to build web interfaces with composable view components and reactive data binding. **ngVue**, inspired by [ngReact](https://github.com/ngReact/ngReact), is an Angular module that allows you to develop/use Vue components in AngularJS applications. ngVue can be used in the existing Angular applications and helps migrate the view parts of the application from Angular 1.x to Vue 2.

The motivation for this is similar to ngReact's:

- The AngularJS application suffers from a performance bottleneck due to a huge amount of scope watchers on the page, but VueJS offers an amazing reactive data-binding mechanism and other optimizations
- Instead of two-way data flow between controllers and views, VueJS defaults to a one-way, parent-to-child data flow between components which makes the application more predictable
- VueJS offers a much easier way to compose the web interfaces, and you can take advantage of the functional reactive programming in VueJS 2. Angular directives introduce a high learning barrier, such as the compile and link function, and the directives are prone to get confused with the components
- The VueJS community offers a component or a UI framework that you would like to try out
- Too deep into an AngularJS application to move it away from the code but you would like to experiment with VueJS

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Features](#features)
	- [The vue-component directive](#the-vue-component-directive)
	- [The createVueComponent factory](#the-createvuecomponent-factory)
- [Caveats](#caveats)
- [Plugins](#plugins)

## Install

via npm:

```
npm install ngVue
```

## Usage

**ngVue** is a UMD module (known as Universal Module Definition), so it's CommonJS and AMD compatible, as well as supporting browser global variable definition.

First of all, remember to load AngularJS 1.x, VueJS and ngVue:

```html
// load on the page with the `script` tag
<script src="./node_modules/angular/angular.js"></script>
<script src="./node_modules/vue/dist/vue.js"></script>
<script src="./node_modules/ngVue/build/index.js"></script>
```

or ...

```javascript
// the CommonJS style
const ng = require('angular')
const vue = require('vue')
require('ngVue')

// the AMD style
require(['angular', 'vue', 'ngVue'], function(ng, Vue) {
})

// the ECMAScript module style
import angular from 'angular'
import vue from 'vue'
import 'ngVue'
```

and then require `ngVue` as a dependency for the Angular app:

```javascript
angular.module('yourApp', ['ngVue'])
```

## Features

**ngVue** is composed of a directive `vue-component`, a factory `createVueComponent` and a directive helper `v-directives`. It also provides some plugins for enhancement.

- `vue-component` is a directive that delegates data to a Vue component so VueJS can compile it with the corresponding nodes
- `createVueComponent` is a factory that converts a Vue component into a `vue-component` directive

**ngVue** does support VueJS directives but currently they only work with a Vue component in AngularJS templates.

- `v-directives` is a directive to apply the vue directives to the vue components

```html
<!-- This won't work -->
<div v-directives="hello"></div>

<!-- But this will work ... -->
<vue-component name="HelloComponent" v-directives="hello"></vue-component>
<!-- Or ... -->
<hello-component v-directives="hello"></hello-component>
```

### The vue-component directive

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

```javascript
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
                   v-props="ctrl.person"
                   watch-depth="value" />
  </div>
</body>
```

The `vue-component` directive provides three main attributes:

- `name` attribute checks for Angular injectable of that name

- `v-props` attribute is a string expression evaluated to an object as the data exposed to Vue component

- `v-props-*` attribute allows you to name the partial data extracted from the angular scope. `vue-component` wraps them into a new object and pass it to the Vue component. For example `props-first-name` and `props-last-name` will create two properties `firstName` and `lastName` in a new object as the component data

```html
<vue-component v-props="ctrl.person" />
<!-- equals to -->
<vue-component v-props-first-name="ctrl.person.firstName" v-props-last-name="ctrl.person.lastName" />
```

- `watch-depth` attribute indicates which watch strategy AngularJS will use to detect the changes on the scope objects. The possible values as follows:

| value | description |
| --- | --- |
| reference | *(default)* watches the object reference |
| collection | *(rarely used)* same as angular `$watchCollection`, shallow watches the properties of the object: for arrays, it watches the array items; for object maps, it watches the properties |
| value | *(rarely used)* deep watches every property inside the object |

**NOTES**

- `watch-depth` cannot propagate all the changes on the scope objects to VueJS due to the limitation of the reactivity system, but you can read about several solutions in [Caveats](docs/caveats.md#limitations--solutions).
- The `collection` strategy and the `value` strategy are rarely used. The scope object will be converted into a reactive object by VueJS and so any changes on the reactive scope object will trigger the view updates.
- The `value` strategy is **not recommended** because it causes a heavy computation. To detect the change, Angular copies the entire object and traverses every property insides in each digest cycle.

#### Handling events

Events can be handled from Vue to AngularJS components by binding functions references as `v-on-*`:

```javascript
app.controller('MainController', function ($scope) {
  this.handleHelloEvent = function (greetings) {
    console.log(greetings); // "Hello, World!"
  }
})
```

```html
<vue-component v-on-hello="ctrl.handleHelloEvent"></vue-component>
```

```javascript
const VComponent = Vue.component('hello-component', {
  methods: {
    helloFromVue() {
      this.$emit('hello', 'Hello, World!');
    }
  },
  render (h) {
    return (
      <button onClick={this.helloFromVue}></button>
    )
  }
})
```

### Handling HTML attributes

Just like regular Vue components, you can pass HTML attributes from the parent Angular component to your Vue component.
Keep in mind that when you pass down literal strings, they must be surrounded by quotes, e.g. `data-value="'enabled'"`

```javascript
angular.module("app")
  .directive("myCustomButton", createVueComponent => {
    return createVueComponent(Vue.component("MyCustomButton", MyCustomButton))
  })
```

```html
<my-custom-button
  disabled="ctrl.isDisabled"
  tabindex="3"
  type="'submit'"
  v-props-button-text="'Click me'" />
```

```vue
<template>
<!-- tabindex, type, and disabled will appear on the button element -->
<button>
  {{ buttonText }}
</button>
</template>

<script>
export default {
  name: "my-custom-button",
  props: ["buttonText"],
}
</script>
```

Note that using `inheritAttrs: false` and binding `$attrs` to another element is also supported:

```vue
<template>
<div>
  <!-- tabindex and type should appear on the button element instead of the parent div -->
  <button v-bind="$attrs">
    {{ buttonText }}
  </button>
  <span>Other elements</span>
</div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "my-custom-button",
  props: ["buttonText"],
}
</script>
```

### The createVueComponent factory

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

## Caveats

ngVue brings the reactivity system to the dirty checking mechanism and you should therefore understand how they work together and how to avoid some common gotchas. Please read more in the [Caveats](docs/caveats.md).

## Plugins

ngVue is simple but flexible for enhancement. Please read more in the [Plugins](docs/plugins.md).

## TODO

- [x] vue components
- [x] vue directives
- [x] unit tests
- [x] docs + simple examples
- [x] ng filters in VueJS
- [x] supports vuex
- [ ] performance optimization
