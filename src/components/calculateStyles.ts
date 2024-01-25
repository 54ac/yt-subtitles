import { getAllStorage, setStorage } from "./storage";
import { Options } from "./defaults";

// https://stackoverflow.com/a/28056903
const hexToRGB = (hex: string, alpha?: number) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return typeof alpha !== "undefined" && alpha < 1
		? `rgba(${r}, ${g}, ${b}, ${alpha})`
		: `rgb(${r}, ${g}, ${b})`;
};

const calculateStyles = async () => {
	const captionSegmentStyles: string[] = [];
	const captionWindowStyles: string[] = [];

	const options = (await getAllStorage()) as Options;

	options.fontFamilyPref &&
		options.fontFamily &&
		captionSegmentStyles.push(
			`font-family: ${options.fontFamily}, sans-serif !important;`
		);

	options.fontSizePref &&
		captionSegmentStyles.push(`font-size: ${options.fontSize}em !important;`);

	options.fontWeightPref &&
		captionSegmentStyles.push(`font-weight: ${options.fontWeight} !important;`);

	options.fontColorPref &&
		captionSegmentStyles.push(`color: ${options.fontColor} !important;`);

	options.fontOpacityPref &&
		parseInt(options.fontOpacity) < 100 &&
		captionSegmentStyles.push(
			`opacity: ${parseInt(options.fontOpacity) / 100} !important;`
		);

	if (
		options.effectLetterSpacingPref &&
		parseFloat(options.effectLetterSpacing) > 0
	)
		captionSegmentStyles.push(
			`letter-spacing: ${options.effectLetterSpacing}em !important;`
		);

	if (
		options.effectWordSpacingPref &&
		parseFloat(options.effectWordSpacing) > 0
	)
		captionSegmentStyles.push(
			`word-spacing: ${options.effectWordSpacing}em !important;`
		);

	if (options.effectLineHeightPref && parseFloat(options.effectLineHeight) > 0)
		captionSegmentStyles.push(
			`line-height: ${options.effectLineHeight}% !important;`
		);

	if (options.effectTextMarginPref)
		captionWindowStyles.push(
			`margin-bottom: ${options.effectTextMargin}em !important; margin-top: ${options.effectTextMargin}em !important;`
		);

	if (options.effectTextPosition === "top")
		captionWindowStyles.push(
			`top: 2% !important; bottom: unset !important; height: min-content !important;`
		);
	else if (options.effectTextPosition === "bottom")
		captionWindowStyles.push(
			`bottom: 2% !important; top: unset !important; height: min-content !important;`
		);

	if (options.effectTextTransform !== "none")
		captionSegmentStyles.push(
			`text-transform: ${options.effectTextTransform} !important;`
		);

	//reset built-in stroke/shadow
	if (
		options.effectStrokePref ||
		options.effectShadowPref ||
		options.effectTextBlurPref
	)
		captionSegmentStyles.push(`text-shadow: none !important;`);

	//use paint-order for outside stroke - not supported in Chrome
	if (options.effectStrokePref)
		captionSegmentStyles.push(
			`-webkit-text-stroke: ${options.effectStrokeWidth}em ${options.effectStrokeColor} !important; paint-order: stroke !important;`
		);

	if (options.effectShadowPref)
		captionSegmentStyles.push(
			`text-shadow: ${options.effectShadowOffsetX}em ${
				options.effectShadowOffsetY
			}em ${options.effectShadowBlur}em ${hexToRGB(
				options.effectShadowColor,
				parseInt(options.effectShadowOpacity) / 100
			)} !important;`
		);

	if (options.effectTextBlurPref && parseFloat(options.effectTextBlur) > 0)
		captionSegmentStyles.push(
			`filter: blur(${options.effectTextBlur}em) !important;`
		);

	const bgTypeStyles =
		options.backgroundType === "window"
			? captionWindowStyles
			: captionSegmentStyles;

	const bgTypeStylesSecondary =
		options.backgroundType === "window"
			? captionSegmentStyles
			: captionWindowStyles;

	if (options.backgroundColorOpacityPref) {
		bgTypeStyles.push(
			`background-color: ${hexToRGB(
				options.backgroundColor,
				parseInt(options.backgroundOpacity) / 100
			)} !important;`
		);
		//only one type of background should be active
		bgTypeStylesSecondary.push(`background-color: transparent !important;`);
	}

	options.backgroundPaddingPref &&
		parseFloat(options.backgroundPadding) > 0 &&
		bgTypeStyles.push(`padding: ${options.backgroundPadding}em !important;`);

	options.backgroundRadiusPref &&
		parseFloat(options.backgroundRadius) > 0 &&
		bgTypeStyles.push(
			`border-radius: ${options.backgroundRadius}em !important;`
		);

	await setStorage({
		captionSegmentStyles:
			captionSegmentStyles.length > 0 ? captionSegmentStyles.join(" ") : ""
	});

	await setStorage({
		captionWindowStyles:
			captionWindowStyles.length > 0 ? captionWindowStyles.join(" ") : ""
	});
};

export default calculateStyles;
