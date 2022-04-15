import angular from 'angular'
import Vue from 'vue'

import '../plugins'

import ngHtmlCompiler from './utils/ngHtmlCompiler'

import HelloComponent from './fixtures/HelloComponent'
import PersonsComponent from './fixtures/PersonsComponent'

describe('quirk mode', () => {
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
      _$provide_.value('PersonsComponent', PersonsComponent)
      _$provide_.value('HelloComponent', HelloComponent)
    })
  })

  describe('disable the quirk mode by default', () => {
    beforeEach(inject)

    it('should disable the quirk mode', () => {
      expect($ngVue.inQuirkMode()).toBe(false)
    })

    it('should not re-render the component when the array element is changed by the index', (done) => {
      const scope = $rootScope.$new()
      scope.persons = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Doe' },
      ]
      const elem = compileHTML(
        `<vue-component
          name="PersonsComponent"
          v-props-persons="persons" />`,
        scope
      )

      scope.persons[0] = { firstName: 'John', lastName: 'Smith' }

      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).not.toBe('<ul><li>John Smith</li><li>Jane Doe</li></ul>')
        done()
      })
    })

    it('should not re-render the component when a new property is dynamically added', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John' }
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
          v-props="person"
          watch-depth="value" />`,
        scope
      )

      scope.person.lastName = 'Smith'

      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).not.toBe('<span>Hello John Smith</span>')
        done()
      })
    })
  })

  describe('active the quirk mode', () => {
    beforeEach(() => {
      angular.mock.module((_$ngVueProvider_) => {
        _$ngVueProvider_.activeQuirkMode()
      })
      inject()
    })

    it('should be in the quirk mode', () => {
      expect($ngVue.inQuirkMode()).toBe(true)
    })

    it('should re-render the component when the array element is changed by the index', (done) => {
      const scope = $rootScope.$new()
      scope.persons = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Doe' },
      ]
      const elem = compileHTML(
        `<vue-component
          name="PersonsComponent"
          v-props-persons="persons"
          watch-depth="collection" />`,
        scope
      )

      scope.persons[0] = { firstName: 'John', lastName: 'Smith' }

      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<ul><li>John Smith</li><li>Jane Doe</li></ul>')
        done()
      })
    })

    it('should re-render the component when a new property is dynamically added', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John' }
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
          v-props="person"
          watch-depth="value" />`,
        scope
      )

      scope.person.lastName = 'Smith'

      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello John Smith</span>')
        done()
      })
    })
  })
})
