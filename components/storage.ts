const isStyleKey = (key: string) => key.endsWith("Styles");

export const getStorage = async (key: string) =>
	new Promise((resolve) =>
		chrome.storage.local.get(key, (res) => {
			if (chrome.runtime?.lastError || !res) return resolve(null);
			if (res[key] !== undefined) resolve(res[key]);
			else resolve(null);
		})
	);

export const getAllStorage = async () =>
	new Promise((resolve) =>
		chrome.storage.local.get(null, (res) => {
			if (chrome.runtime?.lastError || !res) return resolve(null);
			if (Object.keys(res).length) resolve(res);
			else resolve(null);
		})
	);

export const setStorage = async (obj: Record<string, string | boolean>) => {
	await new Promise((resolve) =>
		chrome.storage.local.set(obj, () => resolve(null))
	);

	const syncObj: Record<string, string | boolean> = {};
	for (const [k, v] of Object.entries(obj)) {
		if (!isStyleKey(k)) syncObj[k] = v;
	}
	if (Object.keys(syncObj).length > 0 && chrome.storage?.sync) {
		try {
			chrome.storage.sync.set(syncObj, () => {
				if (chrome.runtime?.lastError) {
					// ignore sync error
				}
			});
		} catch {
			// ignore sync error
		}
	}
};

export const syncStorageWithRemote: () => Promise<void> = async () => {
	if (!chrome.storage?.sync) return;
	return new Promise((resolve) => {
		try {
			chrome.storage.sync.get(null, (syncRes) => {
				if (
					chrome.runtime?.lastError ||
					!syncRes ||
					!Object.keys(syncRes).length
				) {
					chrome.storage.local.get(null, (localRes) => {
						if (!localRes || !Object.keys(localRes).length) return resolve();
						const toSync: Record<string, string | boolean> = {};
						for (const [k, v] of Object.entries(localRes)) {
							if (!isStyleKey(k)) toSync[k] = v as string | boolean;
						}
						try {
							chrome.storage.sync.set(toSync, () => resolve());
						} catch {
							resolve();
						}
					});
					return;
				}
				chrome.storage.local.set(syncRes, () => resolve());
			});
		} catch {
			resolve();
		}
	});
};
