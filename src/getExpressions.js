import angular from 'angular'
import { lowerFirst } from '../lib/lowerFirst'

function normalizePropertyName (attrPropName, removedKey) {
  const propName = attrPropName.slice(removedKey.length)
  return lowerFirst(propName)
}

/**
 * Extract the property/data expressions from the element attribute.
 *
 * @param exprType 'props'|'data'
 * @param attributes Object
 *
 * @returns {Object|string|null}
 */
export function extractExpressions (exprType, attributes) {
  const objectExprKey = exprType === 'props' ? 'vprops' : 'vdata'
  const objectPropExprRegExp = exprType === 'props' ? /vprops/i : /vdata/i

  const objectExpr = attributes[objectExprKey]

  if (angular.isDefined(objectExpr)) {
    return objectExpr
  }

  const propsExprs = Object.keys(attributes)
    .filter((attr) => objectPropExprRegExp.test(attr));

  if (propsExprs.length === 0) {
    return null
  }

  const propExprsMap = {/* name : expression */}
  propsExprs.forEach((attrPropName) => {
    const propName = normalizePropertyName(attrPropName, objectExprKey)
    propExprsMap[propName] = attributes[attrPropName]
  })

  return propExprsMap
}

/**
 * @param attributes Object
 * @returns {{data: (Object|string|null), props: (Object|string|null)}}
 */
export function getExpressions (attributes) {
  return {
    data: extractExpressions('data', attributes),
    props: extractExpressions('props', attributes)
  }
}
