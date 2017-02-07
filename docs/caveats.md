# Caveats

**Table of Contents**

- [AngularJS: dirty checking mechanism](#angularjs-dirty-checking-mechanism)
- [VueJS: reactivity system](#vuejs-reactivity-system)
- [ngVue: reactive dirty checking](#ngvue-reactive-dirty-checking)
- [Limitations & Solutions](#limitations--solutions)
	- [Adding an additional property](#adding-an-additional-property)
	- [Mutating an array](#mutating-an-array)
	- [Activating the quirk mode](#activating-the-quirk-mode)

With ngVue integrating VueJS into AngularJS, to some extent, it makes the change detection efficient but complicated, especially when it comes to the difference between the dirty checking mechanism and the reactivity system. So it is necessary to understand how they work to avoid some gotchas.

## AngularJS: dirty checking mechanism

AngularJS 1.x uses dirty checking to detect the changes. By default, in the built-in directives, Angular runs a function called `$scope.$watch` to register the listeners for the changes, and in the directive controller, it runs another function called `$scope.$apply` to trigger the digest cycle to check if the data become *dirty*. During the digest cycle, the changes on the models or made by the views will be propagated to the matching views and reflected in the underlying models, which is known as a two-way data binding.

Let's take an example of `ng-model`. This built-in directive allows you to do a two-way binding on `input`, `select`, `textarea` and other custom form control. Angular internally uses `$scope.$watch` to watch the scope property when it changes, and uses `$scope.$apply` to trigger the digest cycle by attaching an event handler (such as `keydown`) to the form control. During the digest cycle, Angular loops through all the watchers on that directive and fires the watch functions defined by `$scope.$watch` to check the new value against the last known one. If the values are different, Angular will fire the corresponding listeners for the view updates.

So when you update the scope outside of Angular, for instance in a `window.setTimeout` function, you have to trigger the digest cycle to get Angular notified that the scope has been updated. That's why `$timeout` is preferable in AngularJS. Under the hood, `$timeout` runs `$rootScope.$digest` to trigger the digest cycle after the scheduled function call finishes.

## VueJS: reactivity system

VueJS uses a different approach to detecting the changes, called the reactivity system.

VueJS walks through all the properties of the model objects and converts them into getters/setters using `Object.defineProperty` to perform dependency-tracking and change-notification. For the getters, they collect the dependencies with the watchers bound to the component instances during the rendering. For the setters, they notify the bound watchers to re-render the components.

## ngVue: reactive dirty checking

ngVue makes a full use of the reactivity system in the dirty checking mechanism. It makes the Angular Scope object reactive and binds it to a Vue instance and therefore you can change it outside of AngularJS without notifying Angular to trigger the digest cycle, which gains a good performance in rendering -- if you use the built-in directives, the digest cycle will be still triggered internally.

## Limitations & Solutions

The reactivity system looks simpler than the dirty checking mechanism, but when compared to AngularJS, it has a limitation that VueJS cannot detect these changes on the models:

- dynamically add a new property to the reactive object: `vm.b = 'a'`
- delete a property from the object: `delete vm.b`
- set an array element with the index: `array[0] = newElement`
- modify the length of the array: `array.length = 0`

As we've learned in AngularJS, we can register an equality watcher to watch the changes within the deep nested objects and arrays, so AngularJS is *smarter* in spite of a heavy computation for the deep watch.

The difference mentioned above is likely to get you confused that VueJS doesn't re-render its components when the scope property has been updated in AngularJS.

VueJS, however, is aware of the limitation and provides some solutions.

### Adding an additional property

Some properties of the scope are dynamically added in the Angular controllers and those additions are not trackable by the reactivity system, but you can use `Vue.set(object, key, value)` to get around the limitation.

```javascript
// in an Angular controller
this.data = {
	reactiveProperty: true
}

// after the Vue instance created
// with the scope property `this.data`
// but this additional property is not reactive
this.data.addtional = 'something'

// instead, you should use `Vue.set`
Vue.set(this.data, 'addtional', 'something')
```

### Mutating an array

In the Angular controller, when you mutate the elements of an array in the scope with indices, you have to use `Vue.set(array, index, value)` or `Array.prototype.splice`.

```javascript
// in an Angular controller
this.data = {
	array: ['a', 'b']
}

// mutate the property `array` with the index
// it will not trigger VueJS for the view updates
this.data.array[0] = 'aa'

// These operations can trigger the updates in VueJS
// (1) use Vue.set
Vue.set(this.data.array, 0, 'aa')
// (2) use Array.prototype.splice
this.data.array.splice(0, 1, 'aa')
```

Besides `Array.prototype.splice`, these mutation methods are observable by the reactivity system:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `sort()`
- `reverse()`

So you can manipulate the array by calling those wrapped methods to trigger the view updates. In comparison, the non-mutating methods, such as `filter()`, `concat()` and `slice()`, provide a reactive immutability -- don't worry about the performance issue, VueJS doesn't throw away the existing DOM but *implements some smart heuristics to maximize DOM element reuse*[[1](https://vuejs.org/v2/guide/list.html#Replacing-an-Array)].

```javascript
// in an Angular controller
this.array = this.array.filter((element) => element > 0)
```

When you want to clear the array, instead of decreasing the length to `0`, it is better to replace it with an empty array: `this.array = []`. It is trackable for the reactivity system and a [performance test](https://jsperf.com/array-destroy) shows that it is faster on all current JavaScript engines.

### Activating the quirk mode

In ngVue, the quirk mode is a quick solution to avoiding the problems mentioned earlier. You can activate it in the plugins, please read more details on [Plugins - The Quirk Mode](./plugins.md#quirk-mode).

In the quirk mode, any changes on the scope objects detected by the Angular watchers will force ngVue to copy the entire object to a new one and the reactivity system will walk through all the properties insides to convert them into getters/setters. So it is not efficient and may cause a performance issue.
