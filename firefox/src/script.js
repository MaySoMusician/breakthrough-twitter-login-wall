'use strict'

const root = getOrCreateExtensionShadowDomRoot()
injectCss(getBulmaCss(), root)

const css2 = `.delete::before { width: 12px } .delete::after { height: 12px }
.message { transition: transform .5s, opacity .5s }
.message-header > p { font-size: 16px; line-height: 100% }
.message-header > .delete { padding: 2px }
.message-body { padding: 0; overflow: hidden; position: relative; transition: height 1s; font-size: 13px }
.message-body > .inner { padding: 0.5em 1em 0.6em }
.message-body > .inner > .button.more { position: absolute; bottom: 0.4em; right: 1em; height: 12px; width: 0; padding-left: 10px !important; padding-right: 10px !important }
.button.is-dark.more { background-color: #f5f5f5 }
#donation.message { max-width: 30ch }
#donation.message .message-body { height: 2.5em }
#update.message { max-width: 40ch }
#update.message .message-body { height: 4.5em }
#update.message .message-body > .inner > p:nth-child(n+2) { padding-top: 0.6em } `

injectCss(css2, root)

/** @type {BulmaMessageBox | undefined} */
let currentDonationMsgBoxInstance = undefined

/** @type {BulmaMessageBox | undefined} */
let currentUpdateMsgBoxInstance = undefined

const showDonationWindow = () => {
  if (currentDonationMsgBoxInstance) {
    currentDonationMsgBoxInstance.destory()
    currentDonationMsgBoxInstance = undefined
  }
  const title = browser.i18n.getMessage('removalTitle')
  const donationText = browser.i18n.getMessage('donationText')
  const donationLinkText = browser.i18n.getMessage('donationLink')

  const donationLink = document.createElement('a')
  donationLink.classList.add(...['has-text-link'])
  donationLink.innerText = donationLinkText
  donationLink.href = 'https://www.buymeacoffee.com/maysomusician'
  donationLink.target = '_blank'
  donationLink.rel = 'noopener noreferrer'

  const donationTextHtml = replacePlaceholders(donationText, {
    donationLink: donationLink.outerHTML,
  })

  const donationMessageBox = new BulmaMessageBox(
    root,
    'donation',
    title,
    donationTextHtml
  )
  currentDonationMsgBoxInstance = donationMessageBox

  donationMessageBox.init()

  const setLastShown = async () => {
    await browser.storage.local.set({
      [globalThis.BTLW__STORAGE_KEYS.removalLastShown]: Date.now(),
    })
  }

  donationMessageBox.onClose = setLastShown
  donationMessageBox.onClickMoreButton = setLastShown
  donationMessageBox.show()
}

const showUpdateWindow = () => {
  if (currentUpdateMsgBoxInstance) {
    currentUpdateMsgBoxInstance.destory()
    currentUpdateMsgBoxInstance = undefined
  }
  const title = browser.i18n.getMessage('updateTitle')
  const updateText1 = browser.i18n.getMessage('updateText1')
  const btwlText = browser.i18n.getMessage('updateText1_btwl')
  const updateText2 = browser.i18n.getMessage('updateText2')
  const donateMeText = browser.i18n.getMessage('updateText2_donateMe')

  const btwlLink = document.createElement('a')
  btwlLink.classList.add(...['has-text-link'])
  btwlLink.innerText = btwlText
  btwlLink.href =
    'https://addons.mozilla.org/ja/firefox/addon/breakthrough-twitter-loginwall/'
  btwlLink.target = '_blank'
  btwlLink.rel = 'noopener noreferrer'

  const donationLink = document.createElement('a')
  donationLink.classList.add(...['has-text-link'])
  donationLink.innerText = donateMeText
  donationLink.href = 'https://www.buymeacoffee.com/maysomusician'
  donationLink.target = '_blank'
  donationLink.rel = 'noopener noreferrer'

  const updateText1Paragrah = document.createElement('p')
  updateText1Paragrah.innerHTML = replacePlaceholders(updateText1, {
    btwl: btwlLink.outerHTML,
  })
  const updateText2Paragrah = document.createElement('p')
  updateText2Paragrah.innerHTML = replacePlaceholders(updateText2, {
    donateMe: donationLink.outerHTML,
  })

  const updateMessageBox = new BulmaMessageBox(
    root,
    'update',
    title,
    updateText1Paragrah.outerHTML + updateText2Paragrah.outerHTML
  )
  currentUpdateMsgBoxInstance = updateMessageBox

  updateMessageBox.init()

  const markAsRead = async () => {
    const update = (await browser.storage.local.get())[
      globalThis.BTLW__STORAGE_KEYS.update
    ]
    update['1.0.0'] = true
    await browser.storage.local.set({
      [globalThis.BTLW__STORAGE_KEYS.update]: update,
    })
  }

  updateMessageBox.onClose = markAsRead
  updateMessageBox.onClickMoreButton = markAsRead
  updateMessageBox.show()
}

watch(() => {
  setTimeout(async () => {
    if (currentUpdateMsgBoxInstance) {
      currentUpdateMsgBoxInstance.destory()
      currentUpdateMsgBoxInstance = undefined
    }

    const lastShown = (await chrome.storage.local.get())[
      globalThis.BTLW__STORAGE_KEYS.removalLastShown
    ]

    if (!lastShown || Date.now() - lastShown > 7 * 24 * 60 * 60 * 1000) {
      showDonationWindow()
    }
  }, 300)
})

//
;(async () => {
  let update = (await browser.storage.local.get())[
    globalThis.BTLW__STORAGE_KEYS.update
  ]

  if (!update) {
    update = {}
    await browser.storage.local.set({
      [globalThis.BTLW__STORAGE_KEYS.update]: update,
    })
  }

  if (!update['1.0.0']) {
    const showIfNotInPhotoDetail = async () => {
      const isPhotoDetailPage = document.location.href.match(
        /\/status\/.*\/photo\//
      )

      if (isPhotoDetailPage) {
        setTimeout(showIfNotInPhotoDetail, 2000)
        return
      }
      showUpdateWindow()
    }
    showIfNotInPhotoDetail()
  }
})()
