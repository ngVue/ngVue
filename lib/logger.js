const isEnvTest =
  typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env.BABEL_ENV === 'test'

const warn =
  typeof console !== 'undefined' && typeof console.warn === 'function' && !isEnvTest
    ? console.warn.bind(console)
    : undefined

const logger = {
  warn: typeof warn === 'function' ? warn : () => {} // Default to a noop function
}

export default logger
