import angular, { extend } from 'angular'
import Vue from 'vue'

// init
const pluginHooks = Object.create(null)

// beforeCreated
// created
// beforeMount
// mounted
// beforeUpdate
// updated
// beforeDestroy
// destroyed
const vueHooks = Object.create(null)

function addHooks (map, hooks) {
  if (hooks) {
    Object.keys(hooks).forEach((h) => {
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
  return Object.keys(vueHooks).reduce((available, name) => ({
    ...available,
    [name]: function () {
      const _cb = hookCallback.bind(this)
      callHooks(vueHooks, name, _cb)
    }
  }), {})
}

function ngVueProvider ($injector) {
  this.install = (plugin) => {
    const {
      $name,
      $config,
      $plugin,
      $vue
    } = plugin($injector)

    addHooks(pluginHooks, $plugin)
    addHooks(vueHooks, $vue)

    extend(this, {
      [$name]: $config
    })
  }

  this.$get = ['$injector', ($injector) => {
    const cb = function (hook) {
      hook($injector, Vue, /* dynamic context */ this)
    }

    callHooks(pluginHooks, 'init', cb)

    const vueHooks = createVueHooksMap(cb)

    return {
      getVueHooks: () => vueHooks
    }
  }]
}

export default angular.module('ngVue.plugins', [])
  .provider('$ngVue', ['$injector', ngVueProvider])
