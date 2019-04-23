import angular from 'angular'
import extractExpressionName from './extractPropName'
import extractHtmlAttributes from './extractHtmlAttributes'
import camelToKebab from '../../../lib/camelToKebab'

/**
 * Extract a subset of expressions from the element attributes, e.g. property/data, on, or htmlAttribute
 *
 * @param exprType 'props'|'data'|'on'|'htmlAttributes'
 * @param attributes Object
 *
 * @returns {Object|string|null}
 */
export function extractExpressions (exprType, attributes) {
  const exprKeys = {
    props: 'vProps',
    data: 'vData',
    on: 'vOn'
  }
  const objectExprKey = exprKeys[exprType]
  const objectPropExprRegExp = new RegExp(objectExprKey, 'i')

  const objectExpr = attributes[objectExprKey]

  if (angular.isDefined(objectExpr)) {
    return objectExpr
  }

  let expressions
  if (exprType === 'htmlAttributes') {
    expressions = extractHtmlAttributes(attributes)
  } else {
    expressions = Object.keys(attributes).filter(attr => objectPropExprRegExp.test(attr))
  }

  if (expressions.length === 0) {
    return null
  }

  const exprsMap = {
    /* name : expression */
  }
  expressions.forEach(attrExprName => {
    if (objectExprKey) {
      const exprName = extractExpressionName(attrExprName, objectExprKey)
      exprsMap[exprName] = attributes[attrExprName]
      if (objectExprKey === 'vOn') {
        exprsMap[camelToKebab(exprName)] = attributes[attrExprName]
      }
    } else {
      // Non-prefixed attributes, i.e. a regular HTML attribute
      // Get original attribute name from $attr not stripped by Angular, e.g. data-qa and not qa
      const attrName = attributes.$attr[attrExprName]
      let attrValue
      // Handle attributes with no value, e.g. <button disabled></button>
      if (attributes[attrExprName] === '') {
        attrValue = `'${attrExprName}'`
      } else {
        attrValue = attributes[attrExprName]
      }
      exprsMap[attrName] = attrValue
    }
  })

  return exprsMap
}

/**
 * @param attributes Object
 * @returns {{data: (Object|string|null), props: (Object|string|null)}}
 */
export default function getExpressions (attributes) {
  return {
    data: extractExpressions('data', attributes),
    props: extractExpressions('props', attributes),
    events: extractExpressions('on', attributes),
    htmlAttributes: extractExpressions('htmlAttributes', attributes)
  }
}
