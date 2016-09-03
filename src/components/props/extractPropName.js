import lowerFirst from '../../../lib/lowerFirst'

export default function extractPropName (attrPropName, removedKey) {
  const propName = attrPropName.slice(removedKey.length)
  return lowerFirst(propName)
}
