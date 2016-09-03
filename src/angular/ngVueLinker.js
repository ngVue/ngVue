import Vue from 'vue'
import getVueComponent from '../components/getVueComponent'
import getPropExprs from '../components/props/getExpressions'
import watchPropExprs from '../components/props/watchExpressions'
import evalPropValues from '../components/props/evaluateValues'
import evaluateDirectives from '../directives/evaluateDirectives'

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
