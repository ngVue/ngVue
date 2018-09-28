import Vue from 'vue'

export default Vue.component('button-component', {
  methods: {
    helloFromVue () {
      this.$emit('hello', 'Hello, World!')
    }
  },
  render (h) {
    return <button onClick={this.helloFromVue}>Hello from Vue!</button>
  }
})
