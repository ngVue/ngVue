import angular from 'angular'
import { lowerFirst } from '../lib/lowerFirst'

const SINGLE_PROP = /vprops/i

function normalizePropertyName (attrPropName) {
  const propName = attrPropName.slice('vprops'.length)
  return lowerFirst(propName)
}

/**
 * Get the property expressions defined on the element attribute.
 *
 * @param attrs object
 *
 * @returns {object|string}
 */
export function getPropExpressions (attrs) {
  const vpropsExpr = attrs.vprops

  if (angular.isDefined(vpropsExpr)) {
    return vpropsExpr
  }

  const propExprs = {/* prop name : prop expression */}
  Object.keys(attrs)
    .filter((attr) => SINGLE_PROP.test(attr))
    .forEach((attrPropName) => {
      const propName = normalizePropertyName(attrPropName)
      propExprs[propName] = attrs[attrPropName]
    })

  return propExprs
}
