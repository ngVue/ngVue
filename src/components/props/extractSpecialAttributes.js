const SPECIAL_ATTRIBUTE_KEYS = ['class', 'style']

export default function extractSpecialAttributes(attributes) {
  return SPECIAL_ATTRIBUTE_KEYS.reduce(
    (specialAttributes, key) => {
      const value = attributes[key]
      if (value || attributes[attributes.$normalize(`ng-${key}`)]) {
        specialAttributes[key] = value
      }
      return specialAttributes
    },
    {
      /* name: value */
    }
  )
}
