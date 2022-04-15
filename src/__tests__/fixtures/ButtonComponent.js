import Vue from 'vue'

export default Vue.component('button-component', {
  methods: {
    helloFromVueCCSyntax() {
      this.$emit('helloWorld', 'Hello, World!')
    },
    helloFromVueKCSyntax() {
      this.$emit('hello-world', 'Hello, World!')
    },
  },
  render(h) {
    return (
      <div>
        <button onClick={this.helloFromVueCCSyntax}>Hello from Vue!</button>
        <button onClick={this.helloFromVueKCSyntax}>Hello from Vue!</button>
      </div>
    )
  },
})
