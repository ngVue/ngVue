const logger = {
  warn:
    typeof console !== 'undefined' && typeof console.warn === 'function' && process.env.BABEL_ENV !== 'test'
      ? console.warn
      : () => {} //  Default to a noop function
}

export default logger
