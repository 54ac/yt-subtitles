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
	const captionWindowContainerStyles: string[] = [];
	const captionWindowStyles: string[] = [];

	const options = (await getAllStorage()) as Options;

	options.fontFamilyPref &&
		options.fontFamily &&
		captionSegmentStyles.push(
			`font-family: ${options.fontFamily}, sans-serif !important;`
		);

	options.fontSizePref &&
		captionSegmentStyles.push(
			`font-size: ${100 + parseInt(options.fontSize) * 2}% !important;`
		);

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

	if (options.effectTextVertMarginPref)
		captionWindowStyles.push(
			`margin-bottom: ${options.effectTextVertMargin}em !important; margin-top: ${options.effectTextVertMargin}em !important;`
		);

	if (options.effectTextHorMarginPref)
		captionWindowStyles.push(
			`margin-left: ${options.effectTextHorMargin}em !important; margin-right: ${options.effectTextHorMargin}em !important;`
		);

	if (
		options.effectTextVertPosition !== "default" ||
		options.effectTextHorPosition !== "default"
	)
		captionWindowContainerStyles.push(`display: flex !important;`);

	if (options.effectTextVertPosition !== "default") {
		captionWindowStyles.push(`bottom: unset !important;`);
		if (!options.effectTextVertMarginPref)
			captionWindowStyles.push(`margin-bottom: 0 !important;`);
	}

	if (options.effectTextVertPosition === "top")
		captionWindowContainerStyles.push(`align-items: start !important;`);
	else if (options.effectTextVertPosition === "center")
		captionWindowContainerStyles.push(`align-items: center !important;`);
	else if (options.effectTextVertPosition === "bottom")
		captionWindowContainerStyles.push(`align-items: end !important;`);

	if (options.effectTextHorPosition !== "default") {
		captionWindowStyles.push(`left: unset !important;`);
		if (!options.effectTextHorMarginPref)
			captionWindowStyles.push(`margin-left: 0 !important;`);
	}

	if (options.effectTextHorPosition === "left")
		captionWindowContainerStyles.push(`justify-content: start !important;`);
	else if (options.effectTextHorPosition === "center")
		captionWindowContainerStyles.push(`justify-content: center !important;`);
	else if (options.effectTextHorPosition === "right")
		captionWindowContainerStyles.push(`justify-content: end !important;`);

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

	//use paint-order for outside stroke
	if (options.effectStrokePref)
		captionSegmentStyles.push(
			`-webkit-text-stroke: ${options.effectStrokeWidth}em ${options.effectStrokeColor} !important; \
				paint-order: stroke !important;`
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

	if (
		options.backgroundPaddingPref &&
		parseFloat(options.backgroundPadding) > 0
	) {
		bgTypeStyles.push(`padding: ${options.backgroundPadding}em !important;`);
		bgTypeStylesSecondary.push(`padding: 0 !important;`);
		captionWindowStyles.push(`width: unset !important;`);
	}

	if (options.backgroundRadiusPref && parseFloat(options.backgroundRadius) > 0)
		bgTypeStyles.push(
			`border-radius: ${options.backgroundRadius}em !important;`
		);

	await setStorage({
		captionSegmentStyles:
			captionSegmentStyles.length > 0 ? captionSegmentStyles.join(" ") : ""
	});

	await setStorage({
		captionWindowContainerStyles:
			captionWindowContainerStyles.length > 0
				? captionWindowContainerStyles.join(" ")
				: ""
	});

	await setStorage({
		captionWindowStyles:
			captionWindowStyles.length > 0 ? captionWindowStyles.join(" ") : ""
	});
};

export default calculateStyles;
