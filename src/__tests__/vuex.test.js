import angular from 'angular'
import Vue from 'vue'
import store from './fixtures/vuex-store'

import '../plugins'

import ngHtmlCompiler from './utils/ngHtmlCompiler'

import VuexComponent from './fixtures/VuexComponent'

describe('vuex', () => {
  let $rootScope
  let $ngVue
  let compileHTML

  function inject() {
    angular.mock.inject((_$rootScope_, _$compile_, _$ngVue_) => {
      $ngVue = _$ngVue_

      $rootScope = _$rootScope_
      compileHTML = ngHtmlCompiler(_$rootScope_, _$compile_)
    })
  }

  beforeEach(() => {
    angular.mock.module('ngVue')
    angular.mock.module('ngVue.plugins')
    angular.mock.module((_$provide_) => {
      _$provide_.value('VuexComponent', VuexComponent)
    })
  })

  describe('initial state', () => {
    beforeEach(inject)

    it('should not have any Vuex store by default', () => {
      expect($ngVue.getRootProps().store).toBeUndefined()
    })
  })

  describe('active state', () => {
    beforeEach(() => {
      angular.mock.module((_$ngVueProvider_) => {
        _$ngVueProvider_.enableVuex(store)
      })
      inject()
    })

    it('should have a Vuex store', () => {
      expect($ngVue.getRootProps().store).toEqual(store)
    })

    it('should render with store data', (done) => {
      const scope = $rootScope.$new()
      const elem = compileHTML('<vue-component name="VuexComponent" />', scope)
      scope.$digest()

      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<ul><li>John Smith</li><li>Jane Doe</li></ul>')
        done()
      })
    })

    it('should re-render the component when store changes', (done) => {
      const scope = $rootScope.$new()
      const elem = compileHTML('<vue-component name="VuexComponent" />', scope)
      store.commit('addPerson', { firstName: 'Count', lastName: 'Dracula' })

      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<ul><li>John Smith</li><li>Jane Doe</li><li>Count Dracula</li></ul>')
        done()
      })
    })
  })
})
