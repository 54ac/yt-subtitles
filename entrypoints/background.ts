import { Options, defaults } from "../components/defaults";
import { getAllStorage, setStorage } from "../components/storage";
import updateTabs from "../components/updateTabs";
import calculateStyles from "../components/calculateStyles";

const init = async () => {
	const optionsStorage = (await getAllStorage()) as Options;

	Object.keys(defaults).forEach((key) => {
		if (
			optionsStorage === null ||
			optionsStorage[key as keyof Options] === undefined
		)
			setStorage({
				[key]: defaults[key as keyof typeof defaults]
			});
	});
};

export default defineBackground(() => {
	init();

	chrome.runtime.onMessage.addListener((message: { action: string }) => {
		if (message.action === "openOptions") chrome.runtime.openOptionsPage();
	});

	chrome.commands.onCommand.addListener(async (command) => {
		if (command === "optionsOpen") {
			chrome.runtime.openOptionsPage();
			return;
		}

		const options = (await getAllStorage()) as Options;

		if (command === "fontSizeToggle") {
			await setStorage({
				fontSizePref: !options.fontSizePref
			});
		} else if (command === "fontSizeUp") {
			if (options.fontSize === "200") return;
			await setStorage({
				fontSize:
					parseInt(options.fontSize) + 25 > 200
						? "200"
						: (parseInt(options.fontSize) + 25).toString()
			});
		} else if (command === "fontSizeDown") {
			if (options.fontSize === "50") return;
			await setStorage({
				fontSize:
					parseInt(options.fontSize) - 50 < 50
						? "50"
						: (parseInt(options.fontSize) - 25).toString()
			});
		} else if (command === "fontOpacityToggle") {
			await setStorage({
				fontOpacityPref: !options.fontOpacityPref
			});
		} else if (command === "fontOpacityUp") {
			if (options.fontOpacity === "100") return;
			await setStorage({
				fontOpacity:
					parseInt(options.fontOpacity) + 10 > 100
						? "100"
						: (parseInt(options.fontOpacity) + 10).toString()
			});
		} else if (command === "fontOpacityDown") {
			if (options.fontOpacity === "0") return;
			await setStorage({
				fontOpacity:
					parseInt(options.fontOpacity) - 10 < 0
						? "0"
						: (parseInt(options.fontOpacity) - 10).toString()
			});
		} else if (command === "backgroundColorOpacityToggle") {
			await setStorage({
				backgroundColorOpacityPref: !options.backgroundColorOpacityPref
			});
		}

		await calculateStyles();
		updateTabs();
		chrome.runtime.sendMessage({ action: "updateOptions" });
	});
});
