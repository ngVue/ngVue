import angular from 'angular'

export function getPropValues (propExpressions, scope) {
  if (angular.isString(propExpressions)) {
    return scope.$eval(propExpressions)
  }

  const propsValues = {}

  Object.keys(propExpressions).forEach((propName) => {
    propsValues[propName] = scope.$eval(propExpressions[propName])
  })

  return propsValues
}
