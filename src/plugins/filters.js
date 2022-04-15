import angular, { isArray, isObject } from 'angular'
import './provider'

// contains all the registered filter functions
const registered = Object.create(null)

// these string filters will be resolved by `$filter` service
let lazyStringFilters = []

// add an ng filter function
function addFilter(name, filter) {
  registered[name] = filter
}

// resolve the strings with $injector
function resolveStringFilters($injector) {
  const $filter = $injector.get('$filter')

  lazyStringFilters.forEach((name) => {
    addFilter(name, $filter(name))
  })

  lazyStringFilters = []
}

// register a list of ng filters to ngVue
function registerFilters(filters) {
  if (isArray(filters)) {
    lazyStringFilters = lazyStringFilters.concat(filters)
  } else if (isObject(filters)) {
    Object.keys(filters).forEach((name) => {
      addFilter(name, filters[name])
    })
  }
}

// a Vue plugin will register the ng filters to Vue
const ngFilters = (Vue) => {
  const filterNames = Object.keys(registered)
  filterNames.forEach((name) => Vue.filter(name, registered[name]))
}

// initialize all the ng filters and install the ngFilters plugin
const onPluginInit = ($injector, Vue) => {
  resolveStringFilters($injector)
  Vue.use(ngFilters)
}

export default angular.module('ngVue.plugins').config([
  '$ngVueProvider',
  ($ngVueProvider) => {
    $ngVueProvider.install(() => ({
      $name: 'filters',
      $config: { register: registerFilters },
      $plugin: { init: onPluginInit },
    }))
  },
])
