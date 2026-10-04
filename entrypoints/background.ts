import { type Options, defaults } from "../components/defaults";
import {
	getAllStorage,
	setStorage,
	syncStorageWithRemote
} from "../components/storage";
import updateTabs from "../components/updateTabs";
import calculateStyles from "../components/calculateStyles";

const init = async () => {
	await syncStorageWithRemote();
	const optionsStorage = (await getAllStorage()) as Options;

	const missing: Record<string, string | boolean> = {};
	Object.keys(defaults).forEach((key) => {
		if (
			optionsStorage === null ||
			optionsStorage[key as keyof Options] === undefined
		)
			missing[key] = defaults[key as keyof typeof defaults];
	});
	if (Object.keys(missing).length > 0) {
		await setStorage(missing);
	}
	await calculateStyles();
};

export default defineBackground(() => {
	init();

	chrome.storage.onChanged.addListener(async (changes, areaName) => {
		if (areaName !== "sync") return;
		const incoming: Record<string, string | boolean> = {};
		for (const [k, v] of Object.entries(changes)) {
			if (v && "newValue" in v) {
				incoming[k] = v.newValue as string | boolean;
			}
		}
		if (Object.keys(incoming).length === 0) return;

		await new Promise((resolve) =>
			chrome.storage.local.set(incoming, () => resolve(null))
		);
		await calculateStyles();
		updateTabs();
		chrome.runtime.sendMessage({ action: "updateOptions" });
	});

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
			if (options.fontSize === "300") return;
			await setStorage({
				fontSize:
					parseInt(options.fontSize) + 25 > 300
						? "300"
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
