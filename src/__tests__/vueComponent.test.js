import angular from 'angular'
import Vue from 'vue'

const HelloComponent = Vue.component('hello-component', {
  props: {
    firstName: String,
    lastName: String
  },
  render (h) {
    return (<span>Hello {this.firstName} {this.lastName}</span>)
  }
})

describe('vue-component', () => {
  let provide
  let compiledElement
  let rootScope

  beforeEach(() => {
    angular.mock.module('ngVue')

    angular.mock.module($provide => {
      provide = $provide
    })

    inject(($rootScope, $compile) => {
      rootScope = $rootScope

      compiledElement = (html, scope) => {
        scope = scope || rootScope.$new()
        const elem = angular.element(`<div>${html}</div>`)
        $compile(elem)(scope)
        scope.$digest()
        return elem
      }
    })

    provide.value('HelloComponent', HelloComponent)
  })

  it('should render a vue component with name', () => {
    const elem = compiledElement('<vue-component name="HelloComponent" />')
    expect(elem[0].innerHTML.replace(/\s/g, '')).toBe('<span>Hello</span>')
  })

  it('should render a vue component with vprops object from scope', () => {
    const scope = rootScope.$new()
    scope.person = { firstName: 'John', lastName: 'Doe' }
    const elem = compiledElement('<vue-component name="HelloComponent" vprops="person" />', scope)
    expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
  })

  it('should re-render the vue component when vprops value changes', (done) => {
    const scope = rootScope.$new()
    scope.person = { firstName: 'John', lastName: 'Doe' }
    const elem = compiledElement('<vue-component name="HelloComponent" vprops="person" />', scope)
    expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')

    scope.person.firstName = 'Jane'
    scope.person.lastName = 'Smith'
    Vue.nextTick(() => {
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
      done()
    })
  })

  it('should re-render the vue component when vprops reference changes', (done) => {
    const scope = rootScope.$new()
    scope.person = { firstName: 'John', lastName: 'Doe' }
    const elem = compiledElement('<vue-component name="HelloComponent" vprops="person" />', scope)
    expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')

    scope.person = { firstName: 'Jane', lastName: 'Smith' }
    scope.$digest()
    Vue.nextTick(() => {
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
      done()
    })
  })

  it('should render a vue component with vprops-name properties from scope', () => {
    const scope = rootScope.$new()
    scope.person = { firstName: 'John', lastName: 'Doe' }
    const elem = compiledElement(
      `<vue-component
        name="HelloComponent"
        vprops-first-name="person.firstName"
        vprops-last-name="person.lastName" />`,
      scope
    )
    expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
  })

  it('should re-render the vue component when vprops-name value change', (done) => {
    const scope = rootScope.$new()
    scope.person = { firstName: 'John', lastName: 'Doe' }
    const elem = compiledElement(
      `<vue-component
        name="HelloComponent"
        vprops-first-name="person.firstName"
        vprops-last-name="person.lastName" />`,
      scope
    )
    expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')

    scope.person.firstName = 'Jane'
    scope.person.lastName = 'Smith'
    scope.$digest()
    Vue.nextTick(() => {
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
      done()
    })
  })

  it('should re-render the vue component when vprops-name reference change', (done) => {
    const scope = rootScope.$new()
    scope.person = { firstName: 'John', lastName: 'Doe' }
    const elem = compiledElement(
      `<vue-component
        name="HelloComponent"
        vprops-first-name="person.firstName"
        vprops-last-name="person.lastName" />`,
      scope
    )
    expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')

    scope.person = { firstName: 'Jane', lastName: 'Smith' }
    scope.$digest()
    Vue.nextTick(() => {
      expect(elem[0].innerHTML).toBe('<span>Hello Jane Smith</span>')
      done()
    })
  })
})
