import angular from 'angular'

function watch (propExpressions, watchListener, watchFunc) {
  if (angular.isString(propExpressions)) {
    watchFunc(propExpressions, watchListener)
    return
  }

  Object.keys(propExpressions)
    .map((name) => propExpressions[name])
    .forEach((expr) => {
      watchFunc(expr, watchListener)
    })
}

export function watchProps (propExpressions, watchListener, elAttributes, scope) {
  const watchDepth = elAttributes.watchDepth
  const watcher = watch.bind(this, propExpressions, watchListener)

  switch (watchDepth) {
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
