import Vue from 'vue'

export default Vue.component('persons-component', {
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
