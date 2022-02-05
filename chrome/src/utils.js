'use strict'

function applyOrderedStyles(
  /** @type ElementCSSInlineStyle */
  element,
  /** @type [string, string][] */
  styles
) {
  if (!element) return

  for (const [key, value] of styles) {
    element.style[key] = value
  }
}

/**
 *
 * @returns {ShadowRoot}
 */
function getOrCreateExtensionShadowDomRoot() {
  if (globalThis.BTLW__SHADOW) return globalThis.BTLW__SHADOW

  const extensionId = chrome.runtime.id
  const elementId = `btlw-${extensionId}`

  const newContainer = document.createElement('div')
  newContainer.id = elementId
  applyOrderedStyles(newContainer, [
    ['position', 'fixed'],
    ['left', '16px'],
    ['bottom', '8px'],
  ])
  globalThis.BTLW__SHADOW = newContainer.attachShadow({ mode: 'closed' })
  document.body.appendChild(newContainer)
  return globalThis.BTLW__SHADOW
}

/**
 *
 * @param {string} cssText
 * @param {InnerHTML} parent
 * @returns {HTMLStyleElement}
 */
function injectCss(cssText, parent = getOrCreateExtensionShadowDomRoot()) {
  const injectElement = document.createElement('style')
  injectElement.innerHTML = cssText
  parent.appendChild(injectElement)
  return injectElement
}

/**
 *
 * @param {string} template
 * @param {Record<string,string>} values
 * @returns {string}
 */
function replacePlaceholders(template, values) {
  let result = template
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, value)
  }
  return result
}

globalThis.BTLW__STORAGE_KEYS = {
  update: 'update',
  removalLastShown: 'removalLastShown',
}
