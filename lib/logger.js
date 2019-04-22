const logger = {
  warn: typeof console !== 'undefined' && typeof console.warn === 'function' ? console.warn : () => {} //  Default to a noop function
}

export default logger
