import Vue from 'vue'

export default Vue.component('state-component', {
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
