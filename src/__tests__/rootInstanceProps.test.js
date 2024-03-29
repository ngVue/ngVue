import angular from 'angular'
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import '../plugins'

import ngHtmlCompiler from './utils/ngHtmlCompiler'

import { ButtonComponent, CButtonComponent } from './fixtures/ButtonComponent'

Vue.use(VueCompositionApi)

describe.each`
  style                | button
  ${'Options API'}     | ${ButtonComponent}
  ${'Composition API'} | ${CButtonComponent}
`('root Vue instance props ($style)', ({ button }) => {
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
  })

  describe('Simple props', () => {
    beforeEach(() => {
      angular.mock.module((_$ngVueProvider_) => {
        _$ngVueProvider_.setRootVueInstanceProps({
          foo: 1,
          bar: 2,
          baz: 3,
        })
      })
      inject()
    })

    it('should contain props as defined by in the provider', () => {
      expect($ngVue.getRootProps().foo).toEqual(1)
      expect($ngVue.getRootProps().bar).toEqual(2)
      expect($ngVue.getRootProps().baz).toEqual(3)
    })
  })

  describe('Vue hooks as props', () => {
    const hookNames = [
      'beforeCreated',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
    ]

    let $ngVueProvider
    let mountedPluginHook

    beforeEach(() => {
      angular.mock.module((_$ngVueProvider_, _$provide_) => {
        $ngVueProvider = _$ngVueProvider_
        mountedPluginHook = jest.fn()
        $ngVueProvider.install(() => ({
          $vue: {
            mounted: mountedPluginHook,
          },
        }))
        _$provide_.value('Button', button)
      })
      inject()
    })

    hookNames.forEach((hookName) => {
      it(`${hookName} should not be SUPER valid!`, () => {
        const evilProps = {
          [hookName]: "Hello! I'm SUPER valid!",
        }
        $ngVueProvider.setRootVueInstanceProps(evilProps)
        const props = $ngVue.getRootProps()
        expect(props[hookName]).not.toEqual("Hello! I'm SUPER valid!")
      })
    })

    it('should keep mounted hook untouched', (done) => {
      $ngVueProvider.setRootVueInstanceProps({
        mounted: "Awesome! I'm mounted!",
      })
      const scope = $rootScope.$new()
      compileHTML('<vue-component name="Button" />', scope)
      scope.$digest()
      Vue.nextTick(() => {
        expect($ngVue.getRootProps().mounted).not.toEqual("Awesome! I'm mounted!")
        expect($ngVue.getRootProps().mounted).not.toBeUndefined()
        expect($ngVue.getRootProps().mounted).toBeInstanceOf(Function)
        expect(mountedPluginHook).toHaveBeenCalled()
        done()
      })
    })
  })
})
