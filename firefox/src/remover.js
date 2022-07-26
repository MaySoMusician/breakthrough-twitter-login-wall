'use strict'

function _hideLoginDialog(
  /** @type ElementCSSInlineStyle */
  element
) {
  if (element.style.display === 'none') return false

  applyOrderedStyles(element, [['display', 'none']])
  return true
}

function _getLayersDiv() {
  return new Promise((resolve, _reject) => {
    const timer = () => {
      const layers = document.querySelector('#layers')
      if (layers) return resolve(layers)
      setTimeout(timer, 500)
    }
    setTimeout(timer, 500)
  })
}

/**
 * Starts watching for dialog to appear and hide it
 * @param {*} callbackAfterRemoval Will be called right after and only once the dialog disappears.
 */
async function watch(callbackAfterRemoval) {
  const layersDiv = await _getLayersDiv()

  const observer = new MutationObserver((mutationRecords) => {
    const htmlElem = document.querySelector('html')
    const isPhotoDetailPage = document.location.href.match(
      /\/status\/.*\/photo\//
    )

    /** @type {HTMLDivElement[]} */
    const dialogElements = mutationRecords
      .flatMap((record) => Array.from(record.addedNodes))
      // Only select div elements (other than any element, text, etc.)
      .filter((addedNode) => addedNode.nodeName.toLowerCase() === 'div')
      .flatMap((addedDiv) =>
        Array.from(
          addedDiv.querySelectorAll(':scope > div > div > div[role="dialog"]')
        )
      )
      .filter((dialog) => {
        const photo = dialog.querySelector(
          ':scope > div > div > div[role="group"] > div[aria-modal="true"][aria-labelledby="modal-header"][role="dialog"]'
        )
        // element containing any photo should NOT be hidden
        return photo === null
      })

    if (dialogElements.length < 1) return

    const hideTarget = dialogElements[0].parentNode.parentNode.parentNode
    const hidden = _hideLoginDialog(hideTarget)

    applyOrderedStyles(htmlElem, [
      ['overflow', isPhotoDetailPage ? 'hidden' : 'auto scroll'],
      ['overscrollBehaviorY', isPhotoDetailPage ? 'none' : ''],
      ['marginRight', ''],
    ])

    if (hidden) {
      callbackAfterRemoval()
    }
  })
  observer.observe(layersDiv, { childList: true, subtree: false })
}
