import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js'

const entry = process.env.ENTRY
const output = process.env.OUTPUT
const minified = process.env.MIN === 'true'

export default {
  entry: `src/${entry}.js`,
  moduleName: 'ngVue',
  moduleId: 'ngVue',
  plugins: [
    nodeResolve({
      browser: true,
    }),
    babel(),
    commonjs({
      namedExports: {
        'node_modules/babel-helper-vue-jsx-merge-props/index.js': ['_mergeJSXProps'],
      },
    }),
    uglify(
      minified
        ? {}
        : {
            output: {
              beautify: true,
            },
            mangle: false,
          },
      minify
    ),
  ],
  globals: {
    vue: 'Vue',
    angular: 'angular',
  },
  external: ['vue', 'angular'],
  targets: [{ dest: `build/${output}.js`, format: 'umd' }],
}
