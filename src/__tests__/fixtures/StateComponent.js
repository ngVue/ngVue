import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'

export const StateComponent = Vue.component('state-component', {
  props: {
    tate: {
      type: String,
      default: 'OFF',
    },
  },
  render(h) {
    return <span>State is {this.tate}</span>
  },
})

export const CStateComponent = defineComponent({
  props: {
    tate: {
      type: String,
      default: 'OFF',
    },
  },
  setup() {},
  render(h) {
    return <span>State is {this.tate}</span>
  },
})
