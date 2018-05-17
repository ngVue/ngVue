import Vue from 'vue'

export default Vue.component('welcome-component', {
  render (h) {
    return (<span>Welcome, {this.$slots.default}!</span>)
  }
})
