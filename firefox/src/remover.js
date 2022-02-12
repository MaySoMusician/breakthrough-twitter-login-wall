'use strict'

function _hideLoginDialog(
  /** @type ElementCSSInlineStyle */
  element
) {
  if (element.style.display === 'none') return false

  applyOrderedStyles(element, [['display', 'none']])
  return true
}

/**
 * @returns {boolean} true if login wall is removed
 */
function attemptLoginWallRemoval() {
  const htmlElem = document.querySelector('html')

  const isPhotoDetailPage = document.location.href.match(
    /\/status\/.*\/photo\//
  )

  const layerElements = Array.from(document.querySelectorAll('#layers > div'))

  const dialogElements = layerElements
    .map((elem) =>
      Array.from(
        elem.querySelectorAll(':scope > div > div > div[role="dialog"]')
      )
    )
    .flat()
    .filter((elem) => {
      const photo = elem.querySelector(
        ':scope > div > div > div[role="group"] > div[aria-modal="true"][aria-labelledby="modal-header"][role="dialog"]'
      )
      // element containing any photo should not be hidden
      return photo === null
    })

  let hidden = false

  if (isPhotoDetailPage) {
    if (dialogElements.length >= 1) {
      // Photo detail view

      const target = dialogElements[0].parentNode.parentNode.parentNode
      hidden = _hideLoginDialog(target)

      applyOrderedStyles(htmlElem, [
        ['overflow', 'hidden'],
        ['overscrollBehaviorY', 'none'],
        ['marginRight', ''],
      ])
    }
  } else {
    if (dialogElements.length >= 1) {
      const target = dialogElements[0].parentNode.parentNode.parentNode
      hidden = _hideLoginDialog(target)

      applyOrderedStyles(htmlElem, [
        ['overflow', 'auto scroll'],
        ['overscrollBehaviorY', ''],
        ['marginRight', ''],
      ])
    }
  }
  return hidden
}
