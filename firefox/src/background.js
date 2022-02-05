'use strict'

browser.runtime.onInstalled.addListener(function () {
  browser.tabs.onUpdated.addListener((tabId, _changeInfo, tab) => {
    if (
      tab.status === 'complete' &&
      tab.url &&
      tab.url.match(/:\/\/twitter.com/)
    ) {
      browser.pageAction.show(tabId)
    } else {
      browser.pageAction.hide(tabId)
    }
  })
})
