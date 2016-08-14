import angular from 'angular'

function watch (expressions, watchListener, watchFunc) {
  if (angular.isString(expressions)) {
    watchFunc(expressions, watchListener)
    return
  }

  Object.keys(expressions)
    .map((name) => expressions[name])
    .forEach((expr) => {
      watchFunc(expr, watchListener)
    })
}

/**
 *
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param watchListener Function
 * @param elAttributes {{watchDepth: 'reference'|'value'|'collection'}}
 * @param scope Object
 */
export function watchExpressions (dataExprsMap, watchListener, elAttributes, scope) {
  const expressions = dataExprsMap.props ? dataExprsMap.props : dataExprsMap.data

  if (!expressions) {
    return
  }

  const depth = elAttributes.watchDepth
  const watcher = watch.bind(null, expressions, watchListener)

  switch (depth) {
    case 'value':
      watcher((e, l) => {
        scope.$watch(e, l, true)
      })
      break
    case 'collection':
      watcher((e, l) => {
        scope.$watchCollection(e, l)
      })
      break
    case 'reference':
    default:
      watcher((e, l) => {
        if (Array.isArray(e)) {
          scope.$watchGroup(e, l)
        } else {
          scope.$watch(e, l)
        }
      })
  }
}
