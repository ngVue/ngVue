import angular from 'angular'

/**
 * @param dataExprsMap Object
 * @param dataExprsMap.events Object|null
 * @param scope Object
 * @returns {Object|null}
 */
export default function evaluateEvents (dataExprsMap, scope) {
  const events = dataExprsMap.events

  if (!events || !angular.isObject(events)) {
    return null
  }

  const evaluatedEvents = {}
  Object.keys(events).forEach(eventName => {
    evaluatedEvents[eventName] = scope.$eval(events[eventName])
    const fn = evaluatedEvents[eventName]
    if (!angular.isFunction(fn)) {
      return
    }
    evaluatedEvents[eventName] = function () {
      return scope.$evalAsync(() => fn.apply(null, arguments))
    }
  })

  return evaluatedEvents
}
