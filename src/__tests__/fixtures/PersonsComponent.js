import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'

export const PersonsComponent = Vue.component('persons-component', {
  props: {
    persons: Array,
  },
  render(h) {
    return (
      <ul>
        {this.persons.map((p) => (
          <li>
            {p.firstName} {p.lastName}
          </li>
        ))}
      </ul>
    )
  },
})

export const CPersonsComponent = defineComponent({
  props: {
    persons: Array,
  },
  setup() {},
  render() {
    return (
      <ul>
        {this.persons.map((p) => (
          <li>
            {p.firstName} {p.lastName}
          </li>
        ))}
      </ul>
    )
  },
})
