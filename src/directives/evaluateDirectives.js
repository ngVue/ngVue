import angular from 'angular'

function getTypeOf (value) {
  return value.constructor.name
}

const transformers = {
  'Object': (value) => [value],
  'Array': (value) => value,
  'String': (value) => value.split(/\s*,\s*/g).filter(Boolean).map((name) => { return { name } })
}

/**
 *
 * v-directives:
 *  - Array: [{name: string, value: *, modifiers: Object, params: Object}]
 *  - Object: {name: string, value: *, modifiers: Object, params: Object}
 *  - String: a single directive name or multi-directive names separated with a comma
 *
 * @param attributes {{vDirectives: string|undefined}}
 * @param scope
 * @returns {Array|null}
 */
export default function evaluateDirectives (attributes, scope) {
  const directivesExpr = attributes.vDirectives

  if (angular.isUndefined(directivesExpr)) {
    return null
  }

  const directives = scope.$eval(directivesExpr)
  const transformer = transformers[getTypeOf(directives)]

  return transformer ? transformer(directives) : null
}
