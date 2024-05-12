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

const addStyle = (styleArray: string[], property: string, value: string) =>
	styleArray.push(`${property}: ${value} !important;`);

const calculateStyles = async () => {
	const captionSegmentStyles: string[] = [];
	const captionWindowContainerStyles: string[] = [];
	const captionWindowStyles: string[] = [];

	const options = (await getAllStorage()) as Options;

	if (options.fontFamilyPref && options.fontFamily)
		addStyle(
			captionSegmentStyles,
			"font-family",
			`${options.fontFamily}, sans-serif`
		);

	if (options.fontSizePref)
		addStyle(
			captionSegmentStyles,
			"font-size",
			`${100 + parseInt(options.fontSize) * 2}%`
		);

	if (options.fontWeightPref)
		addStyle(captionSegmentStyles, "font-weight", options.fontWeight);

	if (options.fontColorPref)
		addStyle(captionSegmentStyles, "color", options.fontColor);

	if (options.fontOpacityPref && parseInt(options.fontOpacity) < 100)
		addStyle(
			captionSegmentStyles,
			"opacity",
			(parseInt(options.fontOpacity) / 100).toString()
		);

	if (
		options.effectLetterSpacingPref &&
		parseFloat(options.effectLetterSpacing) > 0
	)
		addStyle(
			captionSegmentStyles,
			"letter-spacing",
			`${options.effectLetterSpacing}em`
		);

	if (
		options.effectWordSpacingPref &&
		parseFloat(options.effectWordSpacing) > 0
	)
		addStyle(
			captionSegmentStyles,
			"word-spacing",
			`${options.effectWordSpacing}em`
		);

	if (options.effectLineHeightPref && parseFloat(options.effectLineHeight) > 0)
		addStyle(
			captionSegmentStyles,
			"line-height",
			`${options.effectLineHeight}%`
		);

	if (options.effectTextVertMarginPref) {
		addStyle(
			captionWindowStyles,
			"margin-bottom",
			`${options.effectTextVertMargin}em`
		);
		addStyle(
			captionWindowStyles,
			"margin-top",
			`${options.effectTextVertMargin}em`
		);
	}

	if (options.effectTextHorMarginPref) {
		addStyle(
			captionWindowStyles,
			"margin-left",
			`${options.effectTextHorMargin}em`
		);
		addStyle(
			captionWindowStyles,
			"margin-right",
			`${options.effectTextHorMargin}em`
		);
	}

	if (
		options.effectTextVertPosition !== "default" ||
		options.effectTextHorPosition !== "default"
	)
		addStyle(captionWindowContainerStyles, "display", "flex");

	if (options.effectTextVertPosition !== "default") {
		addStyle(captionWindowStyles, "bottom", "unset");
		if (!options.effectTextVertMarginPref)
			addStyle(captionWindowStyles, "margin-bottom", "0");
	}

	if (options.effectTextVertPosition === "top")
		addStyle(captionWindowContainerStyles, "align-items", "start");
	else if (options.effectTextVertPosition === "center")
		addStyle(captionWindowContainerStyles, "align-items", "center");
	else if (options.effectTextVertPosition === "bottom")
		addStyle(captionWindowContainerStyles, "align-items", "end");

	if (options.effectTextHorPosition !== "default") {
		addStyle(captionWindowStyles, "left", "unset");
		if (!options.effectTextHorMarginPref)
			addStyle(captionWindowStyles, "margin-left", "0");
	}

	if (options.effectTextHorPosition === "left")
		addStyle(captionWindowContainerStyles, "justify-content", "start");
	else if (options.effectTextHorPosition === "center")
		addStyle(captionWindowContainerStyles, "justify-content", "center");
	else if (options.effectTextHorPosition === "right")
		addStyle(captionWindowContainerStyles, "justify-content", "end");

	if (options.effectTextTransform !== "none")
		addStyle(
			captionSegmentStyles,
			"text-transform",
			options.effectTextTransform
		);

	//reset built-in stroke/shadow
	if (
		options.effectStrokePref ||
		options.effectShadowPref ||
		options.effectTextBlurPref
	)
		addStyle(captionSegmentStyles, "text-shadow", "none");

	//use paint-order for outside stroke
	if (options.effectStrokePref) {
		addStyle(
			captionSegmentStyles,
			"-webkit-text-stroke",
			`${options.effectStrokeWidth}em ${options.effectStrokeColor}`
		);
		addStyle(captionSegmentStyles, "paint-order", "stroke");
	}

	if (options.effectShadowPref)
		addStyle(
			captionSegmentStyles,
			"text-shadow",
			`${options.effectShadowOffsetX}em
			 ${options.effectShadowOffsetY}em
			 ${options.effectShadowBlur}em
			 ${hexToRGB(
					options.effectShadowColor,
					parseInt(options.effectShadowOpacity) / 100
				)}`
		);

	if (options.effectTextBlurPref && parseFloat(options.effectTextBlur) > 0)
		addStyle(
			captionSegmentStyles,
			"filter",
			`blur(${options.effectTextBlur}em)`
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
		addStyle(
			bgTypeStyles,
			"background-color",
			hexToRGB(
				options.backgroundColor,
				parseInt(options.backgroundOpacity) / 100
			)
		);

		//only one type of background should be active
		addStyle(bgTypeStylesSecondary, "background-color", "transparent");
	}

	if (
		options.backgroundPaddingPref &&
		parseFloat(options.backgroundPadding) > 0
	) {
		addStyle(bgTypeStyles, "padding", `${options.backgroundPadding}em`);
		addStyle(bgTypeStylesSecondary, "padding", "0");
		addStyle(captionWindowStyles, "width", "unset");
	}

	if (options.backgroundRadiusPref && parseFloat(options.backgroundRadius) > 0)
		addStyle(bgTypeStyles, "border-radius", `${options.backgroundRadius}em`);

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
