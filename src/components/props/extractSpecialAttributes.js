const SPECIAL_ATTRIBUTE_KEYS = ['class', 'style']

export default function extractSpecialAttributes (attributes) {
  const specialAttributes = {/* name: value */}
  SPECIAL_ATTRIBUTE_KEYS.forEach(key => {
    const value = attributes[key]
    if (value || attributes[attributes.$normalize(`ng-${key}`)]) specialAttributes[key] = value
  })
  return specialAttributes
}
