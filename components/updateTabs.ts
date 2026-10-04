const updateTabs = () => {
	chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
		if (!tabs?.length) return;
		for (const tab of tabs) {
			if (tab.id)
				chrome.tabs.sendMessage(tab.id, { action: "updateSubtitles" }, () => {
					if (chrome.runtime?.lastError) {
						// ignore if content script not yet ready
					}
				});
		}
	});
};

export default updateTabs;
