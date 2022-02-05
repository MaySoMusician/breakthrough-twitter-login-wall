'use strict'

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

const translate = (id, messageId) => {
  const elem = document.getElementById(id)
  if (elem) {
    elem.textContent = browser.i18n.getMessage(messageId)
  }
}

const i18nList = [
  ['popup-title', 'extName'],
  // ['buttons-text1', 'addedLater'],
]

for (const [id, messageId] of i18nList) {
  translate(id, messageId)
}

{
  const donationText = browser.i18n.getMessage('donationText')
  const donationLinkText = browser.i18n.getMessage('donationLink')

  const donationLink = document.createElement('a')
  donationLink.innerText = donationLinkText
  donationLink.href = 'https://www.buymeacoffee.com/maysomusician'
  donationLink.target = '_blank'
  donationLink.rel = 'noopener noreferrer'

  const donationTextHtml = replacePlaceholders(donationText, {
    donationLink: donationLink.outerHTML,
  })

  const element = document.querySelector('#buttons-text1')
  element.innerHTML = donationTextHtml
}
