import lowerFirst from '../../../lib/lowerFirst'

export default function extractPropName (attrPropName, removedKey) {
  const propKeyPattern = new RegExp(`^${removedKey}`)
  if (!propKeyPattern.test(attrPropName)) {
    return null
  }
  const propName = attrPropName.slice(removedKey.length)
  return lowerFirst(propName)
}
