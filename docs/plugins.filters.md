# ngVue.plugins.filters

> This plugin allows you to use Angular filters in VueJS templates.

The plugin collects all the registered filters and then calls `Vue.use` to inject them into Vue.

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


