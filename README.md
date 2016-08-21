# ngVue

*this angular module is still in early development*

[**VueJS**](https://vuejs.org/) is a library to build web interfaces with composable view components and reactive data binding. **ngVue**, inspired by [ngReact](https://github.com/ngReact/ngReact), is an Angular module that allows you to develop/use Vue components in AngularJS applications. It will help migrate the applications from Angular 1.x to Vue 2 by starting with the views.

The motivation for this is similiar to ngReact's:

- The AngularJS application suffers from a performance bottleneck due to a huge amount of scope watchers on the page and VueJS offers an amazing reactive data-binding mechanism and other optimizations
- VueJS defaults to a one-way, parent-to-child data flow between components instead of two-way data flow between controllers and views
- VueJS offers a much easier way to compose the web interfaces and you can take advantage of the functional reactive programming in VueJS 2. Angular directives introduce a high learning barrier, such as the compile and link function, and it's prone to get confused with Angular components
- The VueJS community offers a component or a UI framework that you would like to try out
- Too deep into an AngularJS to move it away from the code but you would like to experiment with VueJS 

# Features

**ngVue** is composed of a directive `vue-component` and a factory `createVueComponent`

- `vue-component` is a directive that delegates data to a Vue component so VueJS can compile it with the corresponding nodes 
- `createVueComponent` is a factory that converts a Vue component into a `vue-component` directive

**ngVue** does support VueJS directives but currently the directives only work with a Vue component in AngularJS templates.

```
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