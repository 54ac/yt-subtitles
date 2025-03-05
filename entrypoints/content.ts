import { Options } from "../components/defaults";
import { getStorage } from "../components/storage";

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
			? `.html5-video-player .ytp-caption-segment { ${captionSegmentStyles} }`
			: ""
	} ${
		captionWindowContainerStyles?.length > 0
			? `.html5-video-player .ytp-caption-window-container { ${captionWindowContainerStyles} }`
			: ""
	}	${
		captionWindowStyles?.length > 0
			? `.html5-video-player .ytp-caption-window-bottom, .html5-video-player .ytp-caption-window-top { ${captionWindowStyles} }`
			: ""
	}`;

	// workaround for font size in shorts and previews
	if (await getStorage("fontSizePref")) {
		const optFontSize = parseInt(
			(await getStorage("fontSize")) as Options["fontSize"]
		);

		styleEl.innerText += `
			#shorts-player .ytp-caption-segment {
				font-size: ${100 + optFontSize}% !important;
			}

			#inline-preview-player .ytp-caption-segment {
				font-size: ${100 + optFontSize / 1.5}% !important;
			}`;
	}
};

export default defineContentScript({
	matches: ["https://*.youtube.com/*"],
	runAt: "document_end",
	main() {
		addStyles();

		chrome.runtime.onMessage.addListener((message: { action: string }) => {
			if (message.action === "updateSubtitles") addStyles();
		});
	}
});
