import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  moduleName: 'ngVue',
  moduleId: 'ngVue',
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs({
      namedExports: {
        'node_modules/babel-helper-vue-jsx-merge-props/index.js': ['_mergeJSXProps']
      }
    }),
    babel()
  ],
  globals: {
    vue: 'Vue',
    angular: 'angular'
  },
  external: ['vue', 'angular'],
  targets: [
    { dest: 'build/ngVue.es.js', format: 'es' },
    { dest: 'build/ngVue.umd.js', format: 'umd' }
  ]
}
