import { Options } from "./components/defaults";
import { getStorage } from "./components/storage";

const addStyles = async () => {
	const captionSegmentStyles = (await getStorage(
		"captionSegmentStyles"
	)) as Options["captionSegmentStyles"];
	const captionWindowContainerStyles = (await getStorage(
		"captionWindowContainerStyles"
	)) as Options["captionWindowContainerStyles"];
	const captionWindowStyles = (await getStorage(
		"captionWindowStyles"
	)) as Options["captionWindowStyles"];

	document.getElementById("better-yt-style")?.remove();

	if (
		!captionSegmentStyles &&
		!captionWindowContainerStyles &&
		!captionWindowStyles
	)
		return;

	const styleEl = document.createElement("style");
	styleEl.id = "better-yt-style";
	document.head.appendChild(styleEl);

	styleEl.innerText = `${
		captionSegmentStyles?.length > 0
			? `#movie_player .ytp-caption-segment { ${captionSegmentStyles} }`
			: ""
	} ${
		captionWindowContainerStyles?.length > 0
			? `#movie_player .ytp-caption-window-container { ${captionWindowContainerStyles} }`
			: ""
	}	${
		captionWindowStyles?.length > 0
			? `#movie_player .ytp-caption-window-bottom { ${captionWindowStyles} }`
			: ""
	}`;
};
addStyles();

const newOptionsButton = document.createElement("button");
newOptionsButton.innerText = chrome.i18n.getMessage("optionsButtonText");
newOptionsButton.onclick = () =>
	chrome.runtime.sendMessage({ action: "openOptions" });
newOptionsButton.classList.add("ytp-button", "ytp-panel-options");

const ytOptionsEl = document.getElementsByClassName("ytp-settings-menu")[0];
const ytOptionsObserver = new MutationObserver(() => {
	if (
		!ytOptionsEl ||
		!ytOptionsEl.querySelector(".ytp-subtitles-options-menu-item") ||
		ytOptionsEl.querySelector(".ytp-panel-options")
	)
		return;

	const menuHeader = ytOptionsEl.querySelector(".ytp-panel-header");
	if (menuHeader) menuHeader.appendChild(newOptionsButton);

	ytOptionsObserver.disconnect();
});
ytOptionsEl && ytOptionsObserver.observe(ytOptionsEl, { childList: true });

chrome.runtime.onMessage.addListener((message: { action: string }) => {
	if (message.action === "updateSubtitles") addStyles();
});
