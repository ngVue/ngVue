# ngVue

*this angular module is still in early development*

[**VueJS**](https://vuejs.org/) is a library to build web interfaces with composable view components and reactive data binding. **ngVue**, inspired by [ngReact](https://github.com/ngReact/ngReact), is an Angular module that allows you to develop/use Vue components in AngularJS applications. ngVue can be used in the existing Angular applications and helps migrate the view parts of the application from Angular 1.x to Vue 2.

The motivation for this is similiar to ngReact's:

- The AngularJS application suffers from a performance bottleneck due to a huge amount of scope watchers on the page and VueJS offers an amazing reactive data-binding mechanism and other optimizations
- Instead of two-way data flow between controllers and views, VueJS defaults to a one-way, parent-to-child data flow between components which makes the application more predictable
- VueJS offers a much easier way to compose the web interfaces and you can take advantage of the functional reactive programming in VueJS 2. Angular directives introduce a high learning barrier, such as the compile and link function, and the directives are prone to get confused with the components
- The VueJS community offers a component or a UI framework that you would like to try out
- Too de#ep into an AngularJS to move it away from the code but you would like to experiment with VueJS 

# Features

**ngVue** is composed of a directive `vue-component`, a factory `createVueComponent` and a directive helper `vdirectives`

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

## TODO

- [x] vue components
- [x] vue directives
- [ ] unit tests
- [ ] docs + simple examples
- [ ] performance optimization