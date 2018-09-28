import Vue from 'vue'

export default Vue.component('vuex-component', {
  render (h) {
    return (
      <ul>
        {this.$store.state.people.map(p => (
          <li>
            {p.firstName} {p.lastName}
          </li>
        ))}
      </ul>
    )
  }
})
