import angular from 'angular'

/**
 *
 * vdirectives:
 *  - Array: [{name: string, value: *, modifiers: Object}]
 *  - Object: name as key, value & modifiers as value
 *  - String: a single directive name or multi-directive names separated with a comma
 *
 * @param attributes {{vdirectives: string|undefined}}
 * @param scope
 * @returns {*}
 */
export function evaluateDirectives (attributes, scope) {
  const directivesExpr = attributes.vdirectives

  if (angular.isUndefined(directivesExpr)) {
    return null
  }

  const directives = scope.$eval(directivesExpr)

  if (angular.isArray(directives)) {
    return directives
  } else if (angular.isObject(directives)) {
    return Object.keys(directives).map((name) => {
      const values = directives[name]
      return {
        name: name,
        value: values.value,
        modifiers: values.modifiers
      }
    })
  } else if (angular.isString(directives)) {
    return directives.split(/\s*,\s*/g)
      .filter(Boolean)
      .map((name) => {
        return { name }
      })
  }
}
