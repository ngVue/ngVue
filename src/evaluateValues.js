import angular from 'angular'

/**
 * @param evalType 'props'|'data'
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param scope Object
 * @returns {string|Object|null}
 */
export function evaluateValues (evalType, dataExprsMap, scope) {
  const key = evalType === 'props' ? 'props' : 'data'
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
export function evaluatePropValues (dataExprsMap, scope) {
  return evaluateValues('props', dataExprsMap, scope)
}

/**
 * @param dataExprsMap Object
 * @param dataExprsMap.data Object|string|null
 * @param dataExprsMap.props Object|string|null
 * @param scope object
 * @returns {string|Object|null}
 */
export function evaluateDataValues (dataExprsMap, scope) {
  return evaluateValues('data', dataExprsMap, scope)
}
