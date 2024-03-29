import angular from 'angular'
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

import ngHtmlCompiler from './utils/ngHtmlCompiler'

import { HelloComponent, CHelloComponent } from './fixtures/HelloComponent'
import { StateComponent, CStateComponent } from './fixtures/StateComponent'
import { HelloWrappedComponent, CHelloWrappedComponent } from './fixtures/HelloWrappedComponent'
import { PersonsComponent, CPersonsComponent } from './fixtures/PersonsComponent'
import { ButtonComponent, CButtonComponent } from './fixtures/ButtonComponent'
import { GreetingsComponent, CGreetingsComponent } from './fixtures/GreetingsComponent'

Vue.use(VueCompositionApi)

describe.each`
  style                | base               | wrapped                   | persons              | button              | greetings              | state
  ${'Options API'}     | ${HelloComponent}  | ${HelloWrappedComponent}  | ${PersonsComponent}  | ${ButtonComponent}  | ${GreetingsComponent}  | ${StateComponent}
  ${'Composition API'} | ${CHelloComponent} | ${CHelloWrappedComponent} | ${CPersonsComponent} | ${CButtonComponent} | ${CGreetingsComponent} | ${CStateComponent}
`('vue-component ($style)', ({ base, wrapped, persons, button, greetings, state }) => {
  let $provide
  let $rootScope
  let $compile
  let compileHTML
  let scope

  beforeEach(() => {
    angular.mock.module('ngVue')

    angular.mock.module((_$provide_) => {
      $provide = _$provide_
    })

    angular.mock.inject((_$rootScope_, _$compile_) => {
      $rootScope = _$rootScope_
      $compile = _$compile_
      compileHTML = ngHtmlCompiler(_$rootScope_, _$compile_)
    })

    scope = $rootScope.$new()
  })

  describe('creation', () => {
    beforeEach(() => {
      $provide.value('HelloComponent', base)
    })

    it('should render a vue component with name', () => {
      const elem = compileHTML('<vue-component name="HelloComponent" />')
      expect(elem[0].innerHTML.replace(/\s/g, '')).toBe('<span>Hello</span>')
    })

    it('should render a vue component with v-props object from scope', () => {
      const scope = $rootScope.$new()
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML('<vue-component name="HelloComponent" v-props="person" />', scope)
      expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
    })

    it('should render a vue component with v-props-name properties from scope', () => {
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
          v-props-first-name="person.firstName"
          v-props-last-name="person.lastName" />`,
        scope
      )
      expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
    })

    it('should render a vue component with original html attributes ', () => {
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
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
      $provide.value('HelloWrappedComponent', wrapped)
      const elem = compileHTML(
        `<vue-component
          name="HelloWrappedComponent"
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

    it('should throw an error if there is no parent tag', () => {
      expect(() => {
        $compile('<vue-component name="HelloComponent" />')($rootScope.$new())
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('v-props extraction', () => {
    beforeEach(() => {
      $provide.value('StateComponent', state)
    })

    it('should render a vue component with state property from scope (v-props-tate syntax is correct)', () => {
      scope.state = 'ON'
      const elem = compileHTML(
        `<vue-component
          name="StateComponent"
          v-props-tate="state" />`,
        scope
      )
      expect(elem[0].innerHTML).toBe('<span>State is ON</span>')
    })

    it('should render a vue component with no state property from scope (v-prop-state syntax is incorrect)', () => {
      scope.state = 'ON'
      const elem = compileHTML(
        `<vue-component
          name="StateComponent"
          v-prop-state="state" />`,
        scope
      )
      expect(elem[0].innerHTML).toBe('<span>State is OFF</span>')
    })
  })

  describe('update', () => {
    beforeEach(() => {
      $provide.value('HelloComponent', base)
      $provide.value('PersonsComponent', persons)
    })

    it('should re-render the vue component when v-props value changes', async () => {
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML('<vue-component name="HelloComponent" v-props="person" />', scope)

      scope.person.firstName = 'Jane'
      scope.person.lastName = 'Smith'
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
    })

    it('should re-render the vue component when v-props reference changes', async () => {
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML('<vue-component name="HelloComponent" v-props="person" />', scope)

      scope.person = { firstName: 'Jane', lastName: 'Smith' }
      scope.$digest()
      await Vue.nextTick()
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
    })

    it('should re-render the vue component when v-props-name value change', async () => {
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
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
      scope.person = { firstName: 'John', lastName: 'Doe' }
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
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
      const elem = compileHTML(
        `<vue-component
          name="PersonsComponent"
          v-props-persons="persons" />`,
        scope
      )

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
        `<vue-component
          name="HelloComponent"
          random="randomAttr"
          tabindex="tabindex"
          class="{{class}}"
          ng-style="{'font-size': size}"
          disabled="isDisabled" />`,
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
      $provide.value('HelloComponent', base)
    })

    it('should remove a vue component when ng-if directive flag toggles from true to false', () => {
      scope.visible = true
      const elem = compileHTML(
        `<vue-component
          name="HelloComponent"
          ng-if="visible" />`,
        scope
      )
      expect(elem[0]).toMatchSnapshot()

      scope.visible = false
      scope.$digest()
      expect(elem[0]).toMatchSnapshot()
    })
  })

  describe('events', () => {
    it('should handle custom events from Vue, with camelCase syntax in $emit function', () => {
      $provide.value('ButtonComponent', button)

      scope.handleHelloEvent = jest.fn()

      const elem = compileHTML(`<vue-component name="ButtonComponent" v-on-hello-world="handleHelloEvent" />`, scope)
      elem.find('button')[0].click()
      scope.$digest()
      expect(scope.handleHelloEvent).toHaveBeenCalledWith('Hello, World!')
    })

    it('should handle custom events from Vue, with kebab-case syntax in $emit function', () => {
      $provide.value('ButtonComponent', button)

      scope.handleHelloEvent = jest.fn()

      const elem = compileHTML(`<vue-component name="ButtonComponent" v-on-hello-world="handleHelloEvent" />`, scope)
      elem.find('button')[1].click()
      scope.$digest()
      expect(scope.handleHelloEvent).toHaveBeenCalledWith('Hello, World!')
    })
  })

  describe('slots', () => {
    beforeEach(() => {
      $provide.value('GreetingsComponent', greetings)
    })

    it('should render a vue component with a button in the slot content', () => {
      scope.onClick = jest.fn()

      const elem = compileHTML(
        `<vue-component name="GreetingsComponent">
          <button ng-click="onClick()">Click me!</button>
        </vue-component>`,
        scope
      )
      expect(elem[0]).toMatchSnapshot()

      elem.find('button')[0].click()
      scope.$digest()
      expect(scope.onClick).toHaveBeenCalled()
    })

    it('should render a vue component with only a text node in the slot content', () => {
      scope.onClick = jest.fn()

      const elem = compileHTML(
        `<vue-component name="GreetingsComponent">
          Hello, World!
        </vue-component>`,
        scope
      )
      expect(elem[0]).toMatchSnapshot()
    })
  })
})
