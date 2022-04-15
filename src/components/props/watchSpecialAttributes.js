import Vue from 'vue'

export default function watchSpecialAttributes(reactiveData, element, scope) {
  Object.keys(reactiveData._v.special).forEach((key) => {
    // Use scope.$watch instead of attrs.$observe because we want to catch changes in attribute
    // value that don't necessarily come directly from interpolation.
    scope.$watch(
      () => element.attr(key),
      (newValue) => {
        Vue.set(reactiveData._v.special, key, newValue)
      }
    )
  })
}
