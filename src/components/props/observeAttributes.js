import Vue from 'vue'

export default function observeAttributes (reactiveData, element, scope, type) {
  Object.keys(reactiveData._v[type]).forEach(key => {
    // Use scope.$watch instead of attrs.$observe because we want to catch changes in attribute
    // value that don't necessarily come directly from interpolation.
    scope.$watch(() => element.attr(key), newValue => {
      Vue.set(reactiveData._v[type], key, newValue)
    })
  })
}
