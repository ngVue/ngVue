import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  moduleName: 'ngVue',
  moduleId: 'ngVue',
  plugins: [
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
