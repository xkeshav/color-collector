const extensionURL = `http://github.com/xkeshav`;
const sitecatServer = ["metrics.barclays.co.uk", "smetrics.barclays.co.uk"];

chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		chrome.runtime.setUninstallURL(extensionURL);
	} else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
		const currentVersion = chrome.runtime.getManifest().version;
		console.log(
			`Tag Watcher updated by ${details.previousVersion} to ${currentVersion}.`
		);
	}

	console.log("Tag watcher installed successfully");

	const author = { name: "Keshav Mohta", email: "xkeshav@gmail.com" };

	chrome.storage.sync.set({ author }, () => {
		console.log("author set");
	});

	chrome.storage.sync.set({ theme: "dark" });

	chrome.storage.local.set({ endpoints: JSON.stringify(sitecatServer) });

	const parameters = {
		events: "Events",
		pageName: "PageName",
		pev2: "LinkName",
		t: "TimeStamp",
		h1: "Hierarchy",
		c1: "Category",
		c2: "Segment",
		c7: "Day",
		c17: "PreviousPage",
		c54: "PageVersion",
		v10: "FormName",
		v11: "PageError",
		v53: "Impression",
	};

	chrome.storage.local.set({ parameters }, () => {
		console.log("parameter json restored.");
	});
});

chrome.storage.onChanged.addListener((changes, namespace) => {
	for (let [key, { ov, nv }] of Object.entries(changes)) {
		console.log(`Storage key ${key} in namespace ${namespace} changed`);
		console.log(`old values were ${ov}`);
		console.log(`new values are ${nv}`);
	}
});

chrome.runtime.onSuspend.addListener(() => {
	console.log("onSuspend");
	chrome.storage.sync.remove("author");
	chrome.storage.sync.remove("theme");
	chrome.storage.local.remove("parameters");
	chrome.storage.local.remove("endpoints");
});
