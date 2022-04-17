import angular from 'angular'
import { isCompositionApi } from '../../lib/isCompositionApi';

export default function getVueComponent(name, $injector) {
  if (angular.isFunction(name) || isCompositionApi(name)) {
    return name
  }
  return $injector.get(name)
}
