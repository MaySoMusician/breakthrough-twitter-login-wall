'use strict'

chrome.runtime.onInstalled.addListener(function () {
  chrome.action.disable()
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'twitter.com', schemes: ['https'] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ])
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'mobile.twitter.com', schemes: ['https'] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ])
  })
})
