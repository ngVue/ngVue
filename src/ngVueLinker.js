import Vue from 'vue'
import { getVueComponent } from './getVueComponent'
import { watchProps } from './watchProps'
import { getPropExpressions } from './getPropExpressions'
import { getPropValues } from './getPropValues'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const propExpressions = getPropExpressions(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const reRenderer = { trigger: false }

  const vueInstance = new Vue({
    el: jqElement[0],
    data: reRenderer,
    render (h) {
      this.trigger
      const props = getPropValues(propExpressions, scope)
      return <Component {...{ props }} />
    }
  })

  function renderVue () {
    reRenderer.trigger = !reRenderer.trigger
  }

  watchProps(propExpressions, renderVue, elAttributes, scope)

  scope.$on('$destroy', () => {
    vueInstance.$destroy(true)
  })
}
