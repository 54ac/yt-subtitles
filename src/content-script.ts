import { Options } from "./options/defaults";

// https://stackoverflow.com/a/28056903
const hexToRGB = (hex: string, alpha?: number) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return typeof alpha !== "undefined" && alpha < 1
		? `rgba(${r}, ${g}, ${b}, ${alpha})`
		: `rgb(${r}, ${g}, ${b})`;
};

const styleEl = document.createElement("style");
document.head.appendChild(styleEl);

const captionSegmentStyles: string[] = [];
const captionWindowStyles: string[] = [];

chrome.storage.local.get(null, (r) => {
	const res: Options = r as Options;

	res.fontFamilyPref &&
		res.fontFamily &&
		captionSegmentStyles.push(
			`font-family: ${res.fontFamily}, sans-serif !important;`
		);

	res.fontSizePref &&
		captionSegmentStyles.push(`font-size: ${res.fontSize}em !important;`);

	res.fontWeightPref &&
		captionSegmentStyles.push(`font-weight: ${res.fontWeight} !important;`);

	res.fontColorPref &&
		captionSegmentStyles.push(`color: ${res.fontColor} !important;`);

	res.fontOpacityPref &&
		parseInt(res.fontOpacity) < 100 &&
		captionSegmentStyles.push(
			`opacity: ${parseInt(res.fontOpacity) / 100} !important;`
		);

	if (res.effectLetterSpacingPref && parseFloat(res.effectLetterSpacing) > 0)
		captionSegmentStyles.push(
			`letter-spacing: ${res.effectLetterSpacing}em !important;`
		);

	if (res.effectWordSpacingPref && parseFloat(res.effectWordSpacing) > 0)
		captionSegmentStyles.push(
			`word-spacing: ${res.effectWordSpacing}em !important;`
		);

	if (res.effectLineHeightPref && parseFloat(res.effectLineHeight) > 0)
		captionSegmentStyles.push(
			`line-height: ${res.effectLineHeight}% !important;`
		);

	if (res.effectTextTransform !== "none")
		captionSegmentStyles.push(
			`text-transform: ${res.effectTextTransform} !important;`
		);

	if (res.effectStrokePref)
		captionSegmentStyles.push(
			`-webkit-text-stroke: ${res.effectStrokeWidth}em ${res.effectStrokeColor} !important; paint-order: stroke !important;`
		);

	if (res.effectShadowPref)
		captionSegmentStyles.push(
			`text-shadow: ${res.effectShadowOffsetX}em ${res.effectShadowOffsetY}em ${
				res.effectShadowBlur
			}em ${hexToRGB(
				res.effectShadowColor,
				parseInt(res.effectShadowOpacity) / 100
			)} !important;`
		);

	if (res.effectTextBlurPref && parseFloat(res.effectTextBlur) > 0)
		captionSegmentStyles.push(
			`filter: blur(${res.effectTextBlur}em) !important;`
		);

	const bgTypeStyles =
		res.backgroundType === "window"
			? captionWindowStyles
			: captionSegmentStyles;

	const bgTypeStylesSecondary =
		res.backgroundType === "window"
			? captionSegmentStyles
			: captionWindowStyles;

	if (res.backgroundColorOpacityPref) {
		bgTypeStyles.push(
			`background-color: ${hexToRGB(
				res.backgroundColor,
				parseInt(res.backgroundOpacity) / 100
			)} !important;`
		);
		bgTypeStylesSecondary.push(`background-color: transparent !important;`);
	}

	res.backgroundPaddingPref &&
		parseFloat(res.backgroundPadding) > 0 &&
		bgTypeStyles.push(`padding: ${res.backgroundPadding}em !important;`);

	res.backgroundRadiusPref &&
		parseFloat(res.backgroundRadius) > 0 &&
		bgTypeStyles.push(`border-radius: ${res.backgroundRadius}em !important;`);

	captionSegmentStyles.length &&
		styleEl.sheet?.insertRule(
			`.ytp-caption-segment { ${captionSegmentStyles.join(" ")} }`
		);
	captionWindowStyles.length &&
		styleEl.sheet?.insertRule(
			`.caption-window { ${captionWindowStyles.join(" ")} }`
		);
});

const newOptionsButton = document.createElement("button");
newOptionsButton.innerText = chrome.i18n.getMessage("optionsButtonText");
newOptionsButton.onclick = () =>
	chrome.runtime.sendMessage({ action: "openOptions" });
newOptionsButton.classList.add("ytp-button", "ytp-panel-options");

const ytOptionsEl = document.getElementById("ytp-id-19");
const observer = new MutationObserver(() => {
	if (
		!ytOptionsEl ||
		!ytOptionsEl.querySelector(".ytp-subtitles-options-menu-item") ||
		ytOptionsEl.querySelector(".ytp-panel-options")
	)
		return;

	const menuHeader = ytOptionsEl.querySelector(".ytp-panel-header");
	if (menuHeader) menuHeader.appendChild(newOptionsButton);

	observer.disconnect();
});
ytOptionsEl && observer.observe(ytOptionsEl, { childList: true });
