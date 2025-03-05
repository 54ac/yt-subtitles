export const getStorage = async (key: string) =>
	new Promise((resolve) =>
		chrome.storage.local.get(key, (res) => {
			if (res[key]) resolve(res[key]);
			else resolve(null);
		})
	);

export const getAllStorage = async () =>
	new Promise((resolve) =>
		chrome.storage.local.get(null, (res) => {
			if (Object.keys(res)?.length) resolve(res);
			else resolve(null);
		})
	);

export const setStorage = async (obj: Record<string, string | boolean>) =>
	new Promise((resolve) => chrome.storage.local.set(obj, () => resolve(null)));
