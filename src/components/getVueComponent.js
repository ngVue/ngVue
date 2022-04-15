import angular from 'angular'

export default function getVueComponent(name, $injector) {
  if (angular.isFunction(name)) {
    return name
  }
  return $injector.get(name)
}
