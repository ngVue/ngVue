import Vue from 'vue'
import getVueComponent from './getVueComponent'
import getPropExprs from './props/getExpressions'
import watchPropExprs from './props/watchExpressions'
import evalPropValues from './props/evaluateValues'
import evaluateDirectives from './directives/evaluateDirectives'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const dataExprsMap = getPropExprs(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const directives = evaluateDirectives(elAttributes, scope) || []
  const reactiveData = evalPropValues(dataExprsMap, scope) || {}
  const reactiveSetter = Vue.set.bind(Vue, reactiveData)
  const vueInstance = new Vue({
    el: jqElement[0],
    data: reactiveData,
    render (h) {
      return <Component {...{ directives }} {...{ props: reactiveData }} />
    }
  })

  watchPropExprs(dataExprsMap, reactiveSetter, elAttributes, scope)

  scope.$on('$destroy', () => {
    vueInstance.$destroy(true)
  })
}
