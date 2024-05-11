const updateTabs = () => {
	chrome.tabs.query(
		{ discarded: false, status: "complete", url: "https://*.youtube.com/*" },
		(tabs) => {
			if (!tabs.length) return;
			for (const tab of tabs)
				chrome.tabs.sendMessage(tab.id as number, {
					action: "updateSubtitles"
				});
		}
	);
};

export default updateTabs;
