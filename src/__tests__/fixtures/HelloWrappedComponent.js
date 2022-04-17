import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'
import { HelloComponent, CHelloComponent } from './HelloComponent'

export const HelloWrappedComponent = Vue.component('hello-wrapped-component', {
  inheritAttrs: false,
  render(h) {
    return (
      <div>
        <HelloComponent {...{ attrs: this.$attrs }} />
      </div>
    )
  },
})

export const CHelloWrappedComponent = defineComponent({
  inheritAttrs: false,
  setup() {},
  render() {
    return (
      <div>
        <CHelloComponent {...{ attrs: this.$attrs }} />
      </div>
    )
  },
})
