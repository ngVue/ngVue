import Vue from 'vue'
import { getVueComponent } from './getVueComponent'
import { watchProps } from './watchProps'
import { getDataExpressions } from './getPropExpressions'
import { getPropValues, getDataValues } from './getPropValues'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const dataExprsMap = getDataExpressions(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const reRenderer = { trigger: false }

  const vueInstance = new Vue({
    el: jqElement[0],
    data: reRenderer,
    render (h) {
      this.trigger
      const props = getPropValues(dataExprsMap, scope) || getDataValues(dataExprsMap, scope) || {}
      return <Component {...{ props }} />
    }
  })

  function renderVue () {
    reRenderer.trigger = !reRenderer.trigger
  }

  watchProps(dataExprsMap, renderVue, elAttributes, scope)

  scope.$on('$destroy', () => {
    vueInstance.$destroy(true)
  })
}
