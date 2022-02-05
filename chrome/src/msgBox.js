'use strict'

class BulmaMessageBox {
  /** @type {ShadowRoot} */
  root = undefined
  /** @type {string} */
  id = ''
  /** @type {string} */
  titleHtml = ''
  /** @type {string} */
  bodyHtml = ''
  /** @type {HTMLDivElement} */
  element = undefined
  /** @type {() => void} */
  onClose = undefined
  /** @type {() => void} */
  onClickMoreButton = undefined

  /**
   *
   * @param {ShadowRoot} _root
   * @param {string} _id
   * @param {string} _titleHtml
   * @param {string} _bodyHtml
   */
  constructor(_root, _id, _titleHtml, _bodyHtml) {
    this.root = _root
    this.id = _id
    this.titleHtml = _titleHtml
    this.bodyHtml = _bodyHtml
  }

  init() {
    // Generate DOM
    const messageTemplate = `<div class="message-header">
  <p>{messageTitle}</p>
  <button class="delete" aria-label="delete"></button>
</div>
<div class="message-body">
  <div class="inner">
    {messageBody}
    <button class="button is-small is-dark is-rounded is-outlined more"><span class="icon is-small">{moreButton}</span></button>
  </div>
</div>`

    const moreButtonSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    moreButtonSvg.innerHTML =
      '<path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />'
    applyOrderedStyles(moreButtonSvg, [
      ['height', '16px'],
      ['weidth', '16px'],
    ])
    moreButtonSvg.setAttribute('viewBox', '0 0 24 24')

    const messageBoxInnerHtml = replacePlaceholders(messageTemplate, {
      messageTitle: this.titleHtml,
      messageBody: this.bodyHtml,
      moreButton: moreButtonSvg.outerHTML,
    })
    const messageDiv = document.createElement('div')
    messageDiv.id = this.id
    messageDiv.classList.add(...['message'])
    messageDiv.innerHTML = messageBoxInnerHtml
    this.root.appendChild(messageDiv)

    // Configure events
    /** @type {HTMLDivElement} */
    const messageBodyElement = messageDiv.querySelector('.message-body')
    /** @type {HTMLButtonElement} */
    const moreButtonElement = messageDiv.querySelector('.button.more')
    moreButtonElement.addEventListener('click', () => {
      const goal = messageBodyElement.scrollHeight
      messageBodyElement.style.height = `${goal}px`
      setTimeout(() => {
        messageBodyElement.style.height = 'auto'
      }, 1000)

      moreButtonElement.remove()
      if (this.onClickMoreButton) {
        this.onClickMoreButton()
      }
    })

    /** @type {HTMLButtonElement} */
    const deleteButtonElement = messageDiv.querySelector('.delete')
    deleteButtonElement.addEventListener('click', () => {
      messageDiv.remove()
      if (this.onClose) {
        this.onClose()
      }
    })

    // Apply hidden style
    applyOrderedStyles(messageDiv, [
      ['opacity', '0'],
      ['transform', 'translateY(10px)'],
    ])

    this.element = messageDiv
    return messageDiv
  }

  show() {
    setTimeout(() => {
      applyOrderedStyles(this.element, [
        ['opacity', '0.95'],
        ['transform', ''],
      ])
    }, 100)
  }

  destory() {
    if (!this.element) return
    this.element.remove()
    this.element = undefined
  }
}
