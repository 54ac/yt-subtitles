import { Options, defaults } from "./components/defaults";
import { getAllStorage, setStorage } from "./components/storage";

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
init();

chrome.runtime.onMessage.addListener((message: { action: string }) => {
	if (message.action === "openOptions") chrome.runtime.openOptionsPage();
});

chrome.commands.onCommand.addListener(async (command) => {
	if (command === "optionsOpen") chrome.runtime.openOptionsPage();
});
