import angular, { extend } from 'angular'
import Vue from 'vue'
import logger from '../../lib/logger'

// init
const pluginHooks = Object.create(null)

const defaultHooks = [
  'beforeCreated',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

const vueHooks = Object.create(null)

function addHooks (map, hooks) {
  if (hooks) {
    Object.keys(hooks).forEach(h => {
      map[h] = map[h] ? map[h] : []
      map[h].push(hooks[h])
    })
  }
}

function callHooks (map, name, callback) {
  const hooks = map[name]
  if (hooks) {
    hooks.forEach(callback)
  }
}

function createVueHooksMap (hookCallback) {
  return Object.keys(vueHooks).reduce(
    (available, name) => ({
      ...available,
      [name]: function () {
        const _cb = hookCallback.bind(this)
        callHooks(vueHooks, name, _cb)
      }
    }),
    {}
  )
}

function ngVueProvider ($injector) {
  let inQuirkMode = false
  let rootProps = {}

  this.activeQuirkMode = () => {
    inQuirkMode = true
  }

  this.enableVuex = store => {
    logger.warn(`
    enableVuex() is deprecated and will be removed in a future release.
    Consider switching to setRootVueInstanceProps().
    `)
    Object.assign(rootProps, { store: store })
  }

  /**
   * @param {props} Object with arbitrary properties to be added to the root Vue instance (i.e.,
   * Vuex's `store`, Vue i18n `i18n`, Vue Router's `router`, and so on)
   *
   * Usage:
   * import store from './store'
   * import i18n from './i18n'
   * import customProp './customVuePlugin'
   *
   * angular.module('app').config(($ngVueProvider) => {
   *   $ngVueProvider.setRootVueInstanceProps({
   *     store,
   *     i18n,
   *     customProp
   *   })
   * })
   *
   */
  this.setRootVueInstanceProps = props => {
    const hooksFound = Object.keys(props).filter(hookName => defaultHooks.includes(hookName))
    hooksFound.forEach(hookName => delete props[hookName])

    Object.assign(rootProps, props)
  }

  this.install = plugin => {
    const { $name, $config, $plugin, $vue } = plugin($injector)

    addHooks(pluginHooks, $plugin)
    addHooks(vueHooks, $vue)

    extend(this, {
      [$name]: $config
    })
  }

  this.$get = [
    '$injector',
    $injector => {
      const cb = function (hook) {
        hook($injector, Vue, /* dynamic context */ this)
      }

      callHooks(pluginHooks, 'init', cb)

      // Explicitly overwrite any hook defined with `setRootVueInstanceProps` so that
      // the current behavior is kept and no breaking changes are introduced.
      Object.assign(rootProps, createVueHooksMap(cb))

      return {
        getRootProps: () => rootProps,
        inQuirkMode: () => inQuirkMode
      }
    }
  ]
}

export default angular.module('ngVue.plugins', []).provider('$ngVue', ['$injector', ngVueProvider])
