import angular from 'angular'
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

import ngHtmlCompiler from './utils/ngHtmlCompiler'

import { HelloComponent, CHelloComponent } from './fixtures/HelloComponent'
import { HelloWrappedComponent, CHelloWrappedComponent } from './fixtures/HelloWrappedComponent'
import { PersonsComponent, CPersonsComponent } from './fixtures/PersonsComponent'
import { ButtonComponent, CButtonComponent } from './fixtures/ButtonComponent'
import { GreetingsComponent, CGreetingsComponent } from './fixtures/GreetingsComponent'

Vue.use(VueCompositionApi)

describe.each`
  style                | base     | wrapped     | persons     | button     | greetings
  ${'Options API'}     | ${HelloComponent}  | ${HelloWrappedComponent}  | ${PersonsComponent}  | ${ButtonComponent}  | ${GreetingsComponent}
  ${'Composition API'} | ${CHelloComponent} | ${CHelloWrappedComponent} | ${CPersonsComponent} | ${CButtonComponent} | ${CGreetingsComponent}
`('create-vue-component ($style)', ({ base, wrapped, persons, button, greetings }) => {
  let $compileProvider
  let $rootScope
  let compileHTML
  let scope

  beforeEach(() => {
    angular.mock.module('ngVue')

    angular.mock.module((_$compileProvider_) => {
      $compileProvider = _$compileProvider_
    })

    angular.mock.inject((_$rootScope_, _$compile_) => {
      $rootScope = _$rootScope_
      compileHTML = ngHtmlCompiler(_$rootScope_, _$compile_)
    })

    scope = $rootScope.$new()
    scope.person = { firstName: 'John', lastName: 'Doe' }
  })

  describe('creation', () => {
    beforeEach(() => {
      $compileProvider.directive('hello', (createVueComponent) => createVueComponent(base))
    })

    it('should render a vue component', () => {
      const elem = compileHTML('<hello />')
      expect(elem[0].innerHTML.replace(/\s/g, '')).toBe('<span>Hello</span>')
    })

    it('should render a vue component with v-props object from scope', () => {
      const elem = compileHTML('<hello v-props="person" />', scope)
      expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
    })

    it('should render a vue component with v-props-name properties from scope', () => {
      const elem = compileHTML(
        `<hello
          v-props-first-name="person.firstName"
          v-props-last-name="person.lastName" />`,
        scope
      )
      expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
    })

    it('should render a vue component with original html attributes ', () => {
      const elem = compileHTML(
        `<hello
          random="'hello'"
          tabindex="1"
          class="foo"
          style="font-size: 2em;"
          disabled
          data-qa="'John'" />`
      )
      expect(elem[0].innerHTML).toBe(
        '<span random="hello" tabindex="1" disabled="disabled" data-qa="John" class="foo" style="font-size: 2em;">Hello  </span>'
      )
    })

    it('should render a vue component with original html attributes on elements that bind $attrs ', () => {
      $compileProvider.directive('helloWrapped', (createVueComponent) => createVueComponent(wrapped))
      const elem = compileHTML(
        `<hello-wrapped
          random="'hello'"
          tabindex="1"
          class="foo"
          style="font-size: 2em;"
          disabled
          data-qa="'John'" />`
      )
      expect(elem[0].innerHTML).toBe(
        '<div class="foo" style="font-size: 2em;"><span random="hello" tabindex="1" disabled="disabled" data-qa="John">Hello  </span></div>'
      )
    })
  })

  describe('update', () => {
    beforeEach(() => {
      $compileProvider.directive('hello', (createVueComponent) => createVueComponent(base))
      $compileProvider.directive('persons', (createVueComponent) => createVueComponent(persons))
    })

    it('should re-render the vue component when v-props value changes', async () => {
      const elem = compileHTML('<hello v-props="person" />', scope)

      scope.person.firstName = 'Jane'
      scope.person.lastName = 'Smith'
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
    })

    it('should re-render the vue component when v-props reference changes', async () => {
      const elem = compileHTML('<hello v-props="person" />', scope)

      scope.person = { firstName: 'Jane', lastName: 'Smith' }
      scope.$digest()
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
    })

    it('should re-render the vue component when v-props-name value change', async () => {
      const elem = compileHTML(
        `<hello
          v-props-first-name="person.firstName"
          v-props-last-name="person.lastName" />`,
        scope
      )

      scope.person.firstName = 'Jane'
      scope.person.lastName = 'Smith'
      scope.$digest()
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
    })

    it('should re-render the vue component when v-props-name reference change', async () => {
      const elem = compileHTML(
        `<hello
          v-props-first-name="person.firstName"
          v-props-last-name="person.lastName" />`,
        scope
      )

      scope.person = { firstName: 'Jane', lastName: 'Smith' }
      scope.$digest()
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
    })

    it('should re-render the vue component when v-props-name is an array and its items change', async () => {
      scope.persons = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Doe' },
      ]
      const elem = compileHTML(`<persons v-props-persons="persons" />`, scope)

      // use Array.prototype.splice
      scope.persons.splice(0, 1, { firstName: 'John', lastName: 'Smith' })
      // use Vue.set
      Vue.set(scope.persons, 1, { firstName: 'Jane', lastName: 'Smith' })

      scope.$digest()
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<ul><li>John Smith</li><li>Jane Smith</li></ul>')
    })

    it('should re-render a vue component with attribute values change', async () => {
      scope.isDisabled = false
      scope.tabindex = 0
      scope.randomAttr = 'enabled'
      scope.class = 'foo'
      scope.size = '2em'
      const elem = compileHTML(
        `<hello random="randomAttr" tabindex="tabindex" disabled="isDisabled" class="{{class}}" ng-style="{'font-size': size}"/>`,
        scope
      )
      $rootScope.$digest() // extra full digest needed for $animate to apply new class

      await Vue.nextTick()
      // wait a tick for ng-* directives' settled values to propagate
      expect(elem[0].innerHTML).toBe(
        '<span random="enabled" tabindex="0" class="foo" style="font-size: 2em;">Hello  </span>'
      )

      scope.isDisabled = true
      scope.tabindex = 1
      scope.randomAttr = 'disabled'
      scope.class = 'bar'
      scope.size = '3em'
      scope.$digest()
      $rootScope.$digest() // extra full digest needed for $animate to apply new class
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe(
        '<span random="disabled" tabindex="1" class="bar" style="font-size: 3em;" disabled="disabled">Hello  </span>'
      )
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      $compileProvider.directive('hello', (createVueComponent) => createVueComponent(base))
    })

    it('should remove a vue component when ng-if directive flag toggles from true to false', () => {
      scope.visible = true
      const elem = compileHTML('<hello ng-if="visible" />', scope)
      expect(elem[0]).toMatchSnapshot()

      scope.visible = false
      scope.$digest()
      expect(elem[0]).toMatchSnapshot()
    })
  })

  describe('events', () => {
    it('should handle custom events from Vue, with cameCase syntax in $emit function', () => {
      $compileProvider.directive('vbutton', (createVueComponent) => createVueComponent(button))

      scope.handleHelloEvent = jest.fn()

      const elem = compileHTML(`<vbutton v-on-hello-world="handleHelloEvent" />`, scope)
      elem.find('button')[0].click()
      scope.$digest()
      expect(scope.handleHelloEvent).toHaveBeenCalledWith('Hello, World!')
    })

    it('should handle custom events from Vue, with kebab-case syntax in $emit function', () => {
      $compileProvider.directive('vbutton', (createVueComponent) => createVueComponent(button))

      scope.handleHelloEvent = jest.fn()

      const elem = compileHTML(`<vbutton v-on-hello-world="handleHelloEvent" />`, scope)
      elem.find('button')[1].click()
      scope.$digest()
      expect(scope.handleHelloEvent).toHaveBeenCalledWith('Hello, World!')
    })
  })

  describe('slots', () => {
    beforeEach(() => {
      $compileProvider.directive('greetings', (createVueComponent) => createVueComponent(greetings))
    })

    it('should render a vue component with a button in the slot content', () => {
      scope.onClick = jest.fn()

      const elem = compileHTML(
        `<greetings>
          <button ng-click="onClick()">Click me!</button>
        </greetings>`,
        scope
      )
      expect(elem[0]).toMatchSnapshot()

      elem.find('button')[0].click()
      scope.$digest()
      expect(scope.onClick).toHaveBeenCalled()
    })

    it('should render a vue component with only a text node in the slot content', () => {
      const scope = $rootScope.$new()
      scope.onClick = jest.fn()

      const elem = compileHTML(
        `<greetings>
          Hello, World!
        </greetings>`,
        scope
      )
      expect(elem[0]).toMatchSnapshot()
    })
  })
})
