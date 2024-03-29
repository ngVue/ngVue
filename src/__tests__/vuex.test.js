import angular from 'angular'
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import store from './fixtures/vuex-store'

import '../plugins'

import ngHtmlCompiler from './utils/ngHtmlCompiler'

import { VuexComponent, CVuexComponent } from './fixtures/VuexComponent'

Vue.use(VueCompositionApi)

describe.each`
  style                | component
  ${'Options API'}     | ${VuexComponent}
  ${'Composition API'} | ${CVuexComponent}
`('vuex ($style)', ({ component }) => {
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
      _$provide_.value('VuexComponent', component)
    })
  })

  afterEach(() => store.commit('reset'))

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

    it('should render with store data', async () => {
      const scope = $rootScope.$new()
      const elem = compileHTML('<vue-component name="VuexComponent" />', scope)
      scope.$digest()

      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<ul><li>John Smith</li><li>Jane Doe</li></ul>')
    })

    it('should re-render the component when store changes', async () => {
      const scope = $rootScope.$new()
      const elem = compileHTML('<vue-component name="VuexComponent" />', scope)
      store.commit('addPerson', { firstName: 'Count', lastName: 'Dracula' })

      scope.$digest()
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<ul><li>John Smith</li><li>Jane Doe</li><li>Count Dracula</li></ul>')
    })
  })
})
