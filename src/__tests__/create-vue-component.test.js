import angular from 'angular'
import Vue from 'vue'

import ngHtmlCompiler from './utils/ngHtmlCompiler'

import HelloComponent from './fixtures/HelloComponent'
import PersonsComponent from './fixtures/PersonsComponent'
import ButtonComponent from './fixtures/ButtonComponent'
import GreetingsComponent from './fixtures/GreetingsComponent'

describe('create-vue-component', () => {
  let $compileProvider
  let $rootScope
  let compileHTML

  beforeEach(() => {
    angular.mock.module('ngVue')

    angular.mock.module((_$compileProvider_) => {
      $compileProvider = _$compileProvider_
    })

    angular.mock.inject((_$rootScope_, _$compile_) => {
      $rootScope = _$rootScope_
      compileHTML = ngHtmlCompiler(_$rootScope_, _$compile_)
    })
  })

  describe('creation', () => {
    beforeEach(() => {
      $compileProvider.directive('hello', createVueComponent => createVueComponent(HelloComponent))
    })

    it('should render a vue component', () => {
      const elem = compileHTML('<hello />')
      expect(elem[0].innerHTML.replace(/\s/g, '')).toBe('<span>Hello</span>')
    })

    it('should render a vue component with v-props object from scope', () => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML('<hello v-props="person" />', scope)
      expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
    })

    it('should render a vue component with v-props-name properties from scope', () => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<hello
          v-props-first-name="person.firstName"
          v-props-last-name="person.lastName" />`,
        scope
      )
      expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
    })
  })

  describe('update', () => {
    beforeEach(() => {
      $compileProvider.directive('hello', createVueComponent => createVueComponent(HelloComponent))
      $compileProvider.directive('persons', createVueComponent => createVueComponent(PersonsComponent))
    })

    it('should re-render the vue component when v-props value changes', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML('<hello v-props="person" />', scope)

      scope.person.firstName = 'Jane'
      scope.person.lastName = 'Smith'
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
        done()
      })
    })

    it('should re-render the vue component when v-props reference changes', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML('<hello v-props="person" />', scope)

      scope.person = { firstName: 'Jane', lastName: 'Smith' }
      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
        done()
      })
    })

    it('should re-render the vue component when v-props-name value change', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<hello
          v-props-first-name="person.firstName"
          v-props-last-name="person.lastName" />`,
        scope
      )

      scope.person.firstName = 'Jane'
      scope.person.lastName = 'Smith'
      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
        done()
      })
    })

    it('should re-render the vue component when v-props-name reference change', (done) => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<hello
          v-props-first-name="person.firstName"
          v-props-last-name="person.lastName" />`,
        scope
      )

      scope.person = { firstName: 'Jane', lastName: 'Smith' }
      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
        done()
      })
    })

    it('should re-render the vue component when v-props-name is an array and its items change', (done) => {
      const scope = $rootScope.$new()
      scope.persons = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Doe' }
      ]
      const elem = compileHTML(`<persons v-props-persons="persons" />`, scope)

      // use Array.prototype.splice
      scope.persons.splice(0, 1, { firstName: 'John', lastName: 'Smith' })
      // use Vue.set
      Vue.set(scope.persons, 1, { firstName: 'Jane', lastName: 'Smith' })

      scope.$digest()
      Vue.nextTick(() => {
        expect(elem[0].innerHTML).toBe('<ul><li>John Smith</li><li>Jane Smith</li></ul>')
        done()
      })
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      $compileProvider.directive('hello', createVueComponent => createVueComponent(HelloComponent))
    })

    it('should remove a vue component when ng-if directive flag toggles from true to false', () => {
      const scope = $rootScope.$new()
      scope.visible = true
      const elem = compileHTML('<hello ng-if="visible" />', scope)
      expect(elem[0]).toMatchSnapshot()

      scope.visible = false
      scope.$digest()
      expect(elem[0]).toMatchSnapshot()
    })
  })

  describe('events', () => {
    it('should handle custom events from Vue', () => {
      $compileProvider.directive('vbutton', createVueComponent => createVueComponent(ButtonComponent))

      const scope = $rootScope.$new()
      scope.handleHelloEvent = jest.fn()

      const elem = compileHTML(`<vbutton v-on-hello="handleHelloEvent" />`, scope)
      elem.find('button')[0].click()
      scope.$digest()
      expect(scope.handleHelloEvent).toHaveBeenCalledWith('Hello, World!')
    })
  })

  describe('slots', () => {
    beforeEach(() => {
      $compileProvider.directive('greetings', createVueComponent => createVueComponent(GreetingsComponent))
    })

    it('should render a vue component with a button in the slot content', () => {
      const scope = $rootScope.$new()
      scope.onClick = jest.fn()

      const elem = compileHTML(`
        <greetings>
          <button ng-click="onClick()">Click me!</button>
        </greetings>`,
        scope
      )
      expect(elem[0]).toMatchSnapshot()

      elem.find('button')[0].click()
      scope.$digest()
      expect(scope.onClick).toHaveBeenCalled()
    })
  })
})
