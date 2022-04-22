import angular from 'angular'

/**
 * @param expr Object|string|null
 * @param scope Object
 * @returns {string|Object|null}
 */
export default function evaluateValues(expr, scope) {
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
