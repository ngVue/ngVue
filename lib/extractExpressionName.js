import { lowerFirst } from './lowerFirst'

export function extractExpressionName (attrExpressionName, removedKey) {
  const exprName = attrExpressionName.slice(removedKey.length)
  return lowerFirst(exprName)
}
