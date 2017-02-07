import angular from 'angular'

const originalModule = angular.module

function evaluateFilterFunction (name, def) {
  // call the ngDef function to get the filter function
  // TODO: resolve the dependence by $injector
  return { [name]: def() }
}

function _hasDependence ($injector, ngDef) {
  const deps = $injector.annotate(ngDef)
  return deps.length > 0
}

angular.module = function (moduleName, ...otherArgs) {
  const module = originalModule(moduleName, ...otherArgs)
  const $injector = angular.injector(['ng', moduleName])

  if (!$injector.has('$ngVue')) {
    throw new Error('ngVue.plugins should be required as a dependency in your application')
  }

  const originalFilter = module.filter
  let filters = []

  module.provider('$ngVueFilter', ['$filterProvider', '$ngVueProvider', function ($filterProvider, $ngVueProvider) {
    this.register = (name, ngDef) => {
      $filterProvider.register(name, ngDef)
      if (!_hasDependence($injector, ngDef)) {
        $ngVueProvider.filters.register(evaluateFilterFunction(name, ngDef))
      }
    }

    // `$ngVueFilter` only works in the config phase
    this.$get = () => {}
  }])

  module.filter = function (name, ngDef) {
    if (!_hasDependence($injector, ngDef)) {
      filters.push(evaluateFilterFunction(name, ngDef))
    }
    return originalFilter.apply(this, arguments)
  }

  module.config(['$ngVueProvider', function ($ngVueProvider) {
    filters.forEach((f) => $ngVueProvider.filters.register(f))
    filters = []
  }])

  return module
}
