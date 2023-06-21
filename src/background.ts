import { defaults } from "./options/defaults";

chrome.storage.local.get(null, (res) =>
	Object.keys(defaults).forEach(
		(key) =>
			res[key] === undefined &&
			chrome.storage.local.set({
				[key]: defaults[key as keyof typeof defaults]
			})
	)
);

chrome.runtime.onMessage.addListener(
	(message: { action: "openOptions" }) =>
		message.action === "openOptions" && chrome.runtime.openOptionsPage()
);
