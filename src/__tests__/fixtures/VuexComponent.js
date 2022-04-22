import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'

export const VuexComponent = Vue.component('vuex-component', {
  render(h) {
    return (
      <ul>
        {this.$store.state.people.map((p) => (
          <li>
            {p.firstName} {p.lastName}
          </li>
        ))}
      </ul>
    )
  },
})

export const CVuexComponent = defineComponent({
  setup() {},
  render(h) {
    return (
      <ul>
        {this.$store.state.people.map((p) => (
          <li>
            {p.firstName} {p.lastName}
          </li>
        ))}
      </ul>
    )
  },
})
