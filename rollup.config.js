import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const entry = process.env.ENTRY
const output = process.env.OUTPUT

const globals = { vue: 'Vue', angular: 'angular' }

export default {
  input: `src/${entry}.js`,
  plugins: [
    nodeResolve({
      browser: true
    }),
    babel({ babelHelpers: 'bundled' }),
    commonjs()
  ],

  external: ['vue', 'angular'],
  output: [
    { file: `build/${output}.js`, format: 'umd', name: 'ngVue', globals },
    { file: `build/${output}.min.js`, format: 'umd', name: 'ngVue', plugins: [terser()], globals },
    { file: `build/${output}.esm.js`, format: 'esm', globals }
  ]
}
