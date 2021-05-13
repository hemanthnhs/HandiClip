let clips = {};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ clips });
});
