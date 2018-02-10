chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  if (!/https:\/\/github.com\/(.*)/.test(details.url)) {
    return;
  }

  chrome.tabs.executeScript(null, {
    file: 'emojissue.js',
    runAt: 'document_end',
  });

  chrome.tabs.insertCSS(null, {
    file: 'emojissue.css',
    runAt: 'document_end',
  });
});
