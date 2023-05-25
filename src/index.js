import angular from 'angular'
import { ngVueLinker } from './angular/ngVueLinker'
import logger from '../lib/logger'

/**
 *
 * angular.module('vue.components')
 *  .value('HelloComponent', Vue.component('hello-component', {
 *    props: {
 *      firstName: String,
 *      lastName: String
 *    },
 *    render() {
 *      return <h1>Hello, {this.firstName} {this.lastName}</h1>
 *    }
 *  }))
 *
 * angular.module('vue.components')
 *  .directive('helloComponent', function (vueComponentFactory) {
 *    return vueComponentFactory('hello')
 *  })
 *
 * <hello-component v-props="person"></hello-component>
 *
 * <hello-component v-props-first-name="person.firstName" v-props-last-name="person.lastName"></hello-component>
 *
 * @param $injector
 * @returns {Function}
 */
function ngVueComponentFactory($injector) {
  return function (componentName, ngDirectiveConfig) {
    const config = {
      restrict: 'E',
      link(scope, elem, attrs) {
        ngVueLinker(componentName, elem, attrs, scope, $injector)
      },
    }

    return angular.extend(config, ngDirectiveConfig)
  }
}

/**
 * <vue-component name="HelloComponent" v-props="person"></vue-component>
 *
 * @param $injector
 * @returns {{restrict: string, link: (function(*=, *=, *=))}}
 */
function ngVueComponentDirective($injector) {
  return {
    restrict: 'E',
    link(scope, elem, attrs) {
      const componentName = attrs.name
      ngVueLinker(componentName, elem, attrs, scope, $injector)
    },
  }
}

export const ngVue = angular
  .module('ngVue', [])
  .directive('vueComponent', ['$injector', ngVueComponentDirective])
  .factory('createVueComponent', ['$injector', ngVueComponentFactory])
