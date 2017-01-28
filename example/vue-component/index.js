import angular from 'angular'
import Vue from 'vue'
import '../../src'

angular.module('vue.components', ['ngVue'])
  .controller('MainController', function () {
    this.person = {
      firstName: 'The',
      lastName: 'World',
      description: 'ngVue helps you use Vue components in your angular application ' +
                   'so that you are able to create a faster and reactive web interfaces.'
    }
  })
  .value('HelloComponent', Vue.component('hello-component', {
    props: {
      firstName: String,
      lastName: String,
      description: String
    },
    render (h) {
      return (
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">Hi, {this.firstName} {this.lastName}</span>
            <p>{this.description}</p>
          </div>
          <div class="card-action">
            <a href="https://vuejs.org/guide/overview.html">Vue.js</a>
          </div>
        </div>
      )
    }
  }))
