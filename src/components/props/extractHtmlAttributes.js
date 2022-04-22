/**
 * @param attributes Object
 * @returns {Array} Array of attributes that pass the filter
 */
export default function extractHtmlAttributes(attributes) {
  // Filter out everything except for HTML attributes, e.g. tabindex, disabled
  return Object.keys(attributes).filter((attr) => {
    const isSpecialAttr = /^(vProps|vData|vOn|vDirectives|watchDepth|ng)/i.test(attr)
    const isJqliteProperty = attr[0] === '$'
    // Vue does not consider class or style as an attr
    return !isSpecialAttr && !isJqliteProperty && attr !== 'class' && attr !== 'style'
  })
}
