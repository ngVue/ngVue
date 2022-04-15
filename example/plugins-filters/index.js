import angular from 'angular'
import Vue from 'vue'
import '../../src'
import '../../src/plugins'
import Tags from './tags.vue'

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
      description:
        'ngVue helps you use Vue components in your angular application ' +
        'so that you are able to create a faster and reactive web interfaces.',
    }
  })
  .value('TagsComponent', Tags)
  .value(
    'HelloComponent',
    Vue.component('hello-component', {
      props: {
        firstName: String,
        lastName: String,
        description: String,
      },
      render(h) {
        const uppercase = Vue.filter('uppercase')
        return (
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">
                Hi, {this.firstName} {this.lastName}
              </span>
              <p>{uppercase(this.description)}</p>
            </div>
            <div class="card-action">
              <a href="https://vuejs.org/guide/overview.html">Vue.js</a>
            </div>
          </div>
        )
      },
    })
  )
