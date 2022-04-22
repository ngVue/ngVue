import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'

export const ButtonComponent = Vue.component('button-component', {
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


export const CButtonComponent = defineComponent({
  setup(_, context) {
    const helloFromVueCCSyntax = () => {
      context.emit('helloWorld', 'Hello, World!')
    }
    const helloFromVueKCSyntax = () => {
      context.emit('hello-world', 'Hello, World!')
    }

    return { helloFromVueCCSyntax, helloFromVueKCSyntax }
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
