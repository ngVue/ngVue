import angular from 'angular'
import Vue from 'vue'
import getVueComponent from '../components/getVueComponent'
import getPropExprs from '../components/props/getExpressions'
import watchPropExprs from '../components/props/watchExpressions'
import evalValues from '../components/props/evaluateValues'
import evalPropEvents from '../components/props/evaluateEvents'
import evaluateDirectives from '../directives/evaluateDirectives'
import extractSpecialAttributes from '../components/props/extractSpecialAttributes'
import watchSpecialAttributes from '../components/props/watchSpecialAttributes'

export function ngVueLinker (componentName, jqElement, elAttributes, scope, $injector) {
  const $ngVue = $injector.has('$ngVue') ? $injector.get('$ngVue') : null
  const $compile = $injector.get('$compile')

  const dataExprsMap = getPropExprs(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const directives = evaluateDirectives(elAttributes, scope) || []
  const reactiveData = {
    _v: {
      props: evalValues(dataExprsMap.props || dataExprsMap.data, scope) || {},
      attrs: evalValues(dataExprsMap.htmlAttributes, scope) || {},
      special: extractSpecialAttributes(elAttributes)
    }
  }
  const on = evalPropEvents(dataExprsMap, scope) || {}

  const inQuirkMode = $ngVue ? $ngVue.inQuirkMode() : false
  const rootProps = $ngVue ? $ngVue.getRootProps() : {}

  const mounted = rootProps.mounted
  rootProps.mounted = function () {
    if (jqElement[0].innerHTML.trim()) {
      const html = $compile(jqElement[0].innerHTML)(scope)
      const slot = this.$refs.__slot__
      slot.parentNode.replaceChild(html[0], slot)
    }
    if (angular.isFunction(mounted)) {
      mounted.apply(this, arguments)
    }
  }

  const watchOptions = {
    depth: elAttributes.watchDepth,
    quirk: inQuirkMode
  }
  watchPropExprs(dataExprsMap, reactiveData, watchOptions, scope, 'props')
  watchPropExprs(dataExprsMap, reactiveData, watchOptions, scope, 'attrs')
  watchSpecialAttributes(reactiveData, jqElement, scope)

  let vueInstance = new Vue({
    name: 'NgVue',
    el: jqElement[0],
    data: reactiveData,
    render (h) {
      return (
        <Component {...{ directives }} {...{ props: reactiveData._v.props, on, attrs: reactiveData._v.attrs }} {... reactiveData._v.special}>
          { <span ref="__slot__" /> }
        </Component>
      )
    },
    ...rootProps
  })

  scope.$on('$destroy', () => {
    vueInstance.$destroy()
    angular.element(vueInstance.$el).remove()
    vueInstance = null
  })
}
