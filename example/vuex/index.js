import angular from 'angular'
import Vue from 'vue'
import '../../src/'
import '../../src/plugins/'
import store from './store'

import { mapState, mapActions } from 'vuex'

angular.module('vue.components', ['ngVue', 'ngVue.plugins'])
  .config(function ($ngVueProvider) {
    $ngVueProvider.setVuexStore(store)
  })
  .value('CounterComponent', Vue.component('counter-component', {
    computed: mapState({
      count: state => state.count
    }),
    render (h) {
      return (
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">Counter value is {this.count}</span>
          </div>
          <div class="card-action">
            <a href="https://vuejs.org/v2/guide/">Vue.js</a>
            <a href="https://vuex.vuejs.org/en/">Vuex</a>
          </div>
        </div>
      )
    }
  }))
  .value('IncrementComponent', Vue.component('increment-component', {
    methods: mapActions([
      'increment'
    ]),
    render (h) {
      return (
        <button onClick={this.increment}>INCREMENT COUNTER +</button>
      )
    }
  }))
  .value('DecrementComponent', Vue.component('decrement-component', {
    methods: mapActions([
      'decrement'
    ]),
    render (h) {
      return (
        <button onClick={this.decrement}>DECREMENT COUNTER -</button>
      )
    }
  }))
