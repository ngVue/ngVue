import {isString, isArray} from 'angular'
import Vue from 'vue'

function watch (expressions, reactiveData) {
  return (watchFunc) => {
    // for `vprops` / `vdata`
    if (isString(expressions)) {
      watchFunc(expressions, (newVal) => {
        Vue.set(reactiveData, '_v', isArray(newVal) ? [...newVal] : newVal)
      })
      return
    }

    // for `vprops-something`
    Object.keys(expressions)
      .forEach((name) => {
        watchFunc(expressions[name], (newVal) => {
          Vue.set(reactiveData._v, name, isArray(newVal) ? [...newVal] : newVal)
        })
      })
  }
}

/**
 *
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param reactiveData Object
 * @param reactiveData._v Object
 * @param depth 'reference'|'value'|'collection'
 * @param scope Object
 */
export default function watchExpressions (dataExprsMap, reactiveData, depth, scope) {
  const expressions = dataExprsMap.props ? dataExprsMap.props : dataExprsMap.data

  if (!expressions) {
    return
  }

  const watcher = watch(expressions, reactiveData)

  switch (depth) {
    case 'value':
      watcher((expression, setter) => {
        scope.$watch(expression, setter, true)
      })
      break
    case 'collection':
      watcher((expression, setter) => {
        scope.$watchCollection(expression, setter)
      })
      break
    case 'reference':
    default:
      watcher((expression, setter) => {
        scope.$watch(expression, setter)
      })
  }
}
