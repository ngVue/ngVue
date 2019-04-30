const warn =
  typeof console !== 'undefined' &&
  typeof console.warn === 'function' &&
  (!process.env || process.env.BABEL_ENV !== 'test')
    ? console.warn.bind(console)
    : undefined

const logger = {
  warn: typeof warn === 'function' ? warn : () => {} // Default to a noop function
}

export default logger
