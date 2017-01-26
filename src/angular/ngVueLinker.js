import Vue from 'vue'
import getVueComponent from '../components/getVueComponent'
import getPropExprs from '../components/props/getExpressions'
import watchPropExprs from '../components/props/watchExpressions'
import evalPropValues from '../components/props/evaluateValues'
import evaluateDirectives from '../directives/evaluateDirectives'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const $ngVue = $injector.has('$ngVue') ? $injector.get('$ngVue') : null

  const dataExprsMap = getPropExprs(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const directives = evaluateDirectives(elAttributes, scope) || []
  const reactiveData = { _v: evalPropValues(dataExprsMap, scope) || {} }

  let vueOptions = {
    el: jqElement[0],
    data: reactiveData,
    render (h) {
      return <Component {...{ directives }} {...{ props: reactiveData._v }} />
    }
  }

  if ($ngVue) {
    const hooks = $ngVue.getVueHooks()
    vueOptions = { ...vueOptions, ...hooks }
  }

  const watchDepth = elAttributes.watchDepth
  watchPropExprs(dataExprsMap, reactiveData, watchDepth, scope)

  const vueInstance = new Vue(vueOptions)

  scope.$on('$destroy', () => {
    vueInstance.$destroy()
  })
}
