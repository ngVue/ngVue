import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'

export const GreetingsComponent = Vue.component('greetings-component', {
  render(h) {
    return (
      <div>
        <span>Welcome, John Doe!</span>
        {this.$slots.default}
      </div>
    )
  },
})

export const CGreetingsComponent = defineComponent({
  setup() {},
  render() {
    return (
      <div>
        <span>Welcome, John Doe!</span>
        {this.$slots.default}
      </div>
    )
  },
})
