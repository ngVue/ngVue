import {isString, isArray} from 'angular'
import Vue from 'vue'

function watch (expressions, reactiveData) {
  return (watchFunc) => {
    // for `vprops` / `vdata`
    if (isString(expressions)) {
      watchFunc(expressions, Vue.set.bind(Vue, reactiveData, '_v'))
      return
    }

    // for `vprops-something`
    Object.keys(expressions)
      .forEach((name) => {
        watchFunc(expressions[name], Vue.set.bind(Vue, reactiveData._v, name))
      })
  }
}

/**
 * @param setter Function a reactive setter from VueKS
 * @returns Function a watch callback when the expression value is changed
 */
function notify (setter) {
  return function (newVal) {
    // `Vue.set` use a shallow comparision to detect the change, so...
    //
    // (1) For an array, we have to create a new one to get around the limitation that
    //     the shallow comparison cannot detect the reference change of the array element
    // (2) For an object, we don't need to create a new one because the object is reactive
    //     and any changes of the properties will notify the reactivity system
    // (3) If the reference is changed in Angular Scope, the shallow comparison can detect
    //     it and then trigger view updates
    //
    setter(isArray(newVal) ? [...newVal] : newVal)
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
        scope.$watch(expression, notify(setter), true)
      })
      break
    case 'collection':
      watcher((expression, setter) => {
        scope.$watchCollection(expression, notify(setter))
      })
      break
    case 'reference':
    default:
      watcher((expression, setter) => {
        scope.$watch(expression, notify(setter))
      })
  }
}
