import Vue from 'vue'
import { getVueComponent } from './getVueComponent'
import { getExpressions } from './getExpressions'
import { watchExpressions } from './watchExpressions'
import { evaluateValues } from './evaluateValues'
import { evaluateDirectives } from './evaluateDirectives'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const dataExprsMap = getExpressions(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const directives = evaluateDirectives(elAttributes, scope) || []
  const reactiveData = evaluateValues(dataExprsMap, scope) || {}
  const reactiveSetter = Vue.set.bind(Vue, reactiveData)
  const vueInstance = new Vue({
    el: jqElement[0],
    data: reactiveData,
    render (h) {
      return <Component {...{ directives }} {...{props: reactiveData}} />
    }
  })

  watchExpressions(dataExprsMap, reactiveSetter, elAttributes, scope)

  scope.$on('$destroy', () => {
    vueInstance.$destroy(true)
  })
}
