import angular from 'angular'

export function getVueComponent (name, $injector) {
  if (angular.isFunction(name)) {
    return name
  }
  return $injector.get(name)
}
