import angular from 'angular'

function watch (expressions) {
  return (watchFunc) => {
    if (angular.isString(expressions)) {
      // the `vprops` / `vdata` object is reactive
      // no need to watch their changes
      return
    }

    Object.keys(expressions)
      .forEach((name) => {
        watchFunc(name, expressions[name])
      })
  }
}

/**
 *
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param watchCallback Function
 * @param elAttributes {{watchDepth: 'reference'|'value'|'collection'}}
 * @param scope Object
 */
export default function watchExpressions (dataExprsMap, watchCallback, elAttributes, scope) {
  const expressions = dataExprsMap.props ? dataExprsMap.props : dataExprsMap.data

  if (!expressions) {
    return
  }

  const depth = elAttributes.watchDepth
  const watcher = watch(expressions)
  const callback = (propName, newVal) => {
    if (newVal) {
      watchCallback(propName, newVal)
    }
  }

  switch (depth) {
    case 'value':
      watcher((name, expression) => {
        scope.$watch(expression, callback.bind(null, name), true)
      })
      break
    case 'collection':
      watcher((name, expression) => {
        scope.$watchCollection(expression, callback.bind(null, name))
      })
      break
    case 'reference':
    default:
      watcher((name, expression) => {
        scope.$watch(expression, callback.bind(null, name))
      })
  }
}
