import Vue from 'vue'
import HelloComponent from './HelloComponent'

export default Vue.component('hello-wrapped-component', {
  inheritAttrs: false,
  render(h) {
    return (
      <div>
        <HelloComponent {...{ attrs: this.$attrs }} />
      </div>
    )
  },
})
