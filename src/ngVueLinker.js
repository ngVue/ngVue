import Vue from 'vue'
import { getVueComponent } from './getVueComponent'
import { getExpressions } from './getExpressions'
import { watchExpressions } from './watchExpressions'
import { evaluatePropValues, evaluateDataValues } from './evaluateValues'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const dataExprsMap = getExpressions(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const reRenderer = { trigger: false }

  const vueInstance = new Vue({
    el: jqElement[0],
    data: reRenderer,
    render (h) {
      this.trigger
      const props = evaluatePropValues(dataExprsMap, scope) || evaluateDataValues(dataExprsMap, scope) || {}
      return <Component {...{ props }} />
    }
  })

  function renderVue () {
    reRenderer.trigger = !reRenderer.trigger
  }

  watchExpressions(dataExprsMap, renderVue, elAttributes, scope)

  scope.$on('$destroy', () => {
    vueInstance.$destroy(true)
  })
}
