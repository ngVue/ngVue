import angular from 'angular'
import Vue from 'vue'
import vueCompositionApi, { ref } from '@vue/composition-api'
import '../../src/index.js'
import '../../src/plugins'
import HelloComponent from './HelloComponent.vue'

Vue.use(vueCompositionApi)

angular
  .module('vue.components', ['ngVue', 'ngVue.plugins'])
  .config(function ($ngVueProvider) {
    $ngVueProvider.filters.register(['uppercase'])
  })
  .filter('uppercase', function () {
    return (string) => string.toUpperCase()
  })
  .controller('MainController', function () {
    this.person = {
      firstName: 'The',
      lastName: 'World',
      description: `ngVue supports components using the Composition API in Vue 2 (when using the @vue/composition-api package)`,
    }

    this.count = null

    this.updateFirstName = (firstName) => {
      console.log(firstName)
      this.person.firstName = firstName
    }

    this.onIncrement = (count) => {
      this.count = count
    }
  })

  // Eg., Composition API from SFC
  .directive('helloComponent', (createVueComponent) => createVueComponent(HelloComponent))

  // Eg., Composition API from bare object
  // It's not necessary to use Vue.component (or SFC) or even defineComponent,
  // but the setup function *is* required by ngVue in this case
  .directive('counter', (createVueComponent) => {
    return createVueComponent({
      setup(_, context) {
        const count = ref(0)

        const counterClicked = () => {
          count.value = count.value + 1;
          context.emit('increment', count.value)
        }

        return { counterClicked, count }
      },
      render(h) {
        return (
          <div class="row">
            <span class="col s3">Vue Ref: {this.count}</span>
            <button onClick={this.counterClicked}>Increment</button>
          </div>
        )
      },
    })
  })
