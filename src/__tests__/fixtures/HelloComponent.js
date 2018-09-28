import Vue from 'vue'

export default Vue.component('hello-component', {
  props: {
    firstName: String,
    lastName: String
  },
  render (h) {
    return (
      <span>
        Hello {this.firstName} {this.lastName}
      </span>
    )
  }
})
