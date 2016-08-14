import angular from 'angular'

/**
 * @param dataType 'props'|'data'
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param scope Object
 * @returns {string|Object|null}
 */
function evaluateValues (dataType, dataExprsMap, scope) {
  const key = dataType === 'props' ? 'props' : 'data'
  const expr = dataExprsMap[key]

  if (!expr) {
    return null
  }

  if (angular.isString(expr)) {
    return scope.$eval(expr)
  }

  const evaluatedValues = {}
  Object.keys(expr).forEach((key) => {
    evaluatedValues[key] = scope.$eval(expr[key])
  })

  return evaluatedValues
}

/**
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param scope Object
 * @returns {string|Object|null}
 */
export function getPropValues (dataExprsMap, scope) {
  const props = evaluateValues('props', dataExprsMap, scope)
  return !!props ? props : null
}

/**
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param scope object
 * @returns {string|Object|null}
 */
export function getDataValues (dataExprsMap, scope) {
  const data = evaluateValues('data', dataExprsMap, scope)
  return !!data ? data : null
}
