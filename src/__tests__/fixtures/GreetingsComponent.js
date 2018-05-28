import Vue from 'vue'

export default Vue.component('greetings-component', {
  render (h) {
    return (
      <div>
        <span>Welcome, John Doe!</span>
        {this.$slots.default}
      </div>
    )
  }
})
