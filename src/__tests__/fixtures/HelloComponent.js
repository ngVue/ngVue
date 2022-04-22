import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'

export const HelloComponent = Vue.component('hello-component', {
  props: {
    firstName: String,
    lastName: String,
  },
  render(h) {
    return (
      <span>
        Hello {this.firstName} {this.lastName}
      </span>
    )
  },
})

export const CHelloComponent = defineComponent({
  props: {
    firstName: String,
    lastName: String,
  },

  setup() {},

  render() {
    return (
      <span>
        Hello {this.firstName} {this.lastName}
      </span>
    )
  },
})
