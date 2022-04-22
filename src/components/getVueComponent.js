import angular from 'angular'
import Vue from 'vue'
import { isCompositionApi } from '../../lib/isCompositionApi'

export default function getVueComponent(name, $injector) {
  let component = name
  if (angular.isString(name)) {
    component = $injector.get(name)
  }

  if (isCompositionApi(component)) {
    component = Vue.component(component.name || 'UnnamedComponent', component)
  }

  return component
}
