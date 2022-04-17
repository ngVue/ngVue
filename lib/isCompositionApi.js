import angular from 'angular'

export function isCompositionApi(component) {
  return angular.isObject(component) && Object.prototype.hasOwnProperty.call(component, 'setup')
}
