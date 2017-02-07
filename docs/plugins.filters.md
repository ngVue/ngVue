# ngVue.plugins.filters

> This plugin allows you to use Angular filters in VueJS templates.

The plugin collects all the registered filters and then calls `Vue.use` to inject them into Vue. We made [a patch](#patch) for a quick injection to VueJS.

## TODO

- [ ] support dependency injection
- [ ] unit testing

## API

The namespace of the plugin is `filters` and this namespace object is the only access to the methods it provides.

### `register(filters)`

Register a list of filters to VueJS.

**Arguments**

- `filters` (*Object\<String, Function>* | *Array\<String>*): If it's an object, the key will be the filter name and the value will be the function that transforms input to an output. If it's a list of filter names, they will be resolved by the inject service of Angular.

## Usage

You should register the filters during the configuration phase:

```javascript
angular.module('app', ['ngVue.plugins', 'ngVue.plugins.filters'])
	.config(function ($ngVueProvider) {
		$ngVueProvider.filters.register({
			'f1': (input) => output,
			'f2': (input) => output
		})
		// or
		$ngVueProvider.filters.register(['f3', 'f4'])
	})
	.filter('f3', () => (input) => output)
	.filter('f4', () => (input) => output)
```

Angular filters and VueJS filters are both pure functions, so you can use them in the render functions of VueJS to transform the input by invoking `Vue.filter(id)`:

```javascript
new Vue({
	...
	render(h) {
		const filter = Vue.filter('name')
		return <div>{ filter(text) }</div>
	}
})
```

You can also use them inside mustache interpolations and `v-bind` expressions:

```javascript
<template>
	<div>{{ text | filter }}</div>
</template>
```

## Patch

> With the patch, you do not need to call `$ngVueProvider.filters.register()` any more.

When a number of custom filters have been created in your application, you will find it inconvenient to register them with this plugin, so we made a patch that automatically registers the filters to VueJS by calling `$ngVueProvider.filters.register()` in `angular.filter`. Because `$filterProvider.register()` cannot be patched, we created another provider `$ngVueFilterProvider` as a replacement in the patch to wrap `$filterProvider.register()` so that the filters can be collected by the plugin.

Make sure that these modules `ngVue` and `ngVue.plugins` have been loaded in your application and have been required as the dependencies. Then load the patch file located at `./node_modules/ngVue/build/patch-ngfilters.js`:

```javascript
import angular from 'angular'
import vue from 'vue'
import from 'ngVue'
import from 'ngVue/build/patch-ngfilters'

angular.module('yourApp', ['ngVue', 'ngVue.plugins'])
	// the filter will be automatically registered to VueJS
	.filter('ngFilter', () => (input) => output)
```

If you are using `$filterProvider` to register some filters, **in the config phase**, simply replace the original filter provider with `$ngVueFilterProvider` and that's it.

```javascript
// before
config(($filterProvider) => {
	$filterProvider.register(...)
})

// after
config(($ngVueFilterProvider) => {
	$ngVueFilterProvider.register(...)
})
```


**NOTE**: Don't replace the `$filter` service with `$ngVueFilter`. `$ngVueFilter` only works in the config phase.