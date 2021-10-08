const parameterElement = {
	section: document.querySelector("#parameter-section"),
	jsonBlock: document.querySelector("#parameter-json"),
	messageBlock: document.querySelector("#parameter-message"),
	statusBlock: document.querySelector("#parameter-status"),
	saveButton: document.querySelector("#save-parameter"),
	resetButton: document.querySelector("#reset-parameter"),
};

// common utility methods
const Utils = {
	printPrettyJson: (obj) => {
		if (typeof obj === "object") {
			return JSON.stringify(obj, null, 4);
		} else {
			return "";
		}
	},
	getTrimmedObject: (obj) => {
		const trimmerObject = {};
		if (typeof obj === "object") {
			for (const k in obj) {
				if (Object.hasOwnProperty.call(object, k)) {
					const to = { [k.trim()]: obj[k].trim() };
					Object.assign(trimmerObject, to);
				}
			}
		}
		return trimmerObject;
	},

	enableButtonList: (buttonElements = []) => {
		buttonElements.forEach((elem) => {
			if (elem.hasAttribute("disabled")) {
				elem.classList.remove("disabled");
				elem.removeAttribute("disabled");
				elem.setAttribute("aria-disabled", false);
			}
		});
	},
	disableButtonList: (buttonElements = []) => {
		buttonElements.forEach((elem) => {
			if (!elem.hasAttribute("disabled")) {
				elem.classList.add("disabled");
				elem.setAttribute("disabled", true);
				elem.setAttribute("aria-disabled", true);
			}
		});
	},
	copyToClipboard: (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => console.info("domain name copied to clipboard"))
			.catch((err) => {
				console.error("something went wrong while copy domain to clipboard", {
					err,
				});
			});
	},
	createListItem: (domain) => {
		const li = document.createElement("li");
		li.classList.add("domain--item");
		const span = document.createElement("span");
		span.textContent = domain.trim();
		const btn = document.createElement("button");
		btn.onclick = DomainHandler.deleteDomain;
		btn.textContent = "";
		btn.setAttribute("aria-label", "cross icon");
		btn.setAttribute("title", "remove domain");
		li.append(span, btn);
		return li;
	},
};

const restoreOptions = () => {
	chrome.storage.local.get(["parameters"], (result) => {
		const { parameters } = result;
		parameterJsonBlock.innerText = Utils.printPrettyJson(parameters);
	});

	//domain selection
	chrome.storage.local.get(["endpoints"], (result) => {
		const { endpoints } = result;
		const endpointList = JSON.parse(endpoints);
		if (endpointList.length) {
			DomainHandler.createDomainList(endpointList);
		}
	});
};

const ParameterHandler = {
	hasParameterUpdated: false,
	updateChanges: () => {
		ParameterHandler.hasParameterUpdated = true;
	},
	outsideClickHandler: (e) => {
		if (!parameterJsonBlock.contains(e.target)) {
			if (!ParameterHandler.hasParameterUpdated) {
				Utils.enableButtonList([
					parameterElement.saveButton,
					parameterElement.resetButton,
				]);
			}
		}
	},
	updateParameterList: () => {
		const textContent = parameterJsonBlock.textContent;
		try {
			const parsedText = JSON.parse(textContent);
			parameterElement.messageBlock.classList.add("hide"); // hide error message
			parameterElement.jsonBlock.setAttribute("aria-invalid", "false");
			const withoutSpace = Utils.getTrimmedObject(parsedText);
			return withoutSpace;
		} catch (e) {
			console.log({ e }); // dev purpose
			parameterElement.jsonBlock.setAttribute("aria-invalid", "true");
			parameterElement.messageBlock.classList.remove("hide"); // display error message
		}
	},
	saveToLocalStorage: () => {
		const parameters = ParameterHandler.updateParameterList();
		if (parameters !== undefined) {
			chrome.storage.local.set({ parameters }, () => {
				parameterElement.statusBlock.classList.remove("hide"); // display success message for a while
				Utils.disableButtonList([
					parameterElement.saveButton,
					parameterElement.resetButton,
				]);
				parameterElement.jsonBlock.innerText =
					Utils.printPrettyJson(parameters);
				setTimeout(() => {
					parameterElement.statusBlock.classList.add("hide");
				}, 2500);
			});
		}
	},
};

parameterElement.section.addEventListener(
	"click",
	ParameterHandler.outsideClickHandler
);
parameterElement.jsonBlock.addEventListener(
	"input",
	ParameterHandler.updateChanges
);
parameterElement.saveButton.addEventListener(
	"click",
	ParameterHandler.saveToLocalStorage,
	false
);
parameterElement.resetButton.addEventListener(
	"click",
	() => {
		document.location.reload();
	},
	false
);

// domain section

const domainElement = {
	form: document.querySelector("#domain-form"),
	input: document.querySelector("#domain-input"),
	list: document.querySelector("#domain-list"),
	addButton: document.querySelector("#domain-add"),
	messageBlock: document.querySelector("#domain-message"),
	statusBlock: document.querySelector("#domain-status"),
	saveButton: document.querySelector("#domain-save"),
};

const DomainHandler = {
	removeDomain: (e) => {
		const { target } = e;
		const parentElement = target.parentElement;
		const domain = parentElement.textContent;
		parentElement.classList.add("hide");
		Utils.enableButtonList([domainElement.saveButton]);
	},
	collectDomainList: () => {
		const domainArray = [];
		Array.from(domainElement.list.children).forEach((item) => {
			const domainName = item.children[0].textContent.trim();
			if (domainName !== "" && domainName !== null) {
				domainArray.push(domainName);
			}
		});
		return domainArray;
	},
	createDomainList: (list) => {
		const frag = document.createDocumentFragment();
		list.forEach((l) => {
			const item = Utils.createListItem(l);
			frag.append(item);
		});
		domainElement.list.append(frag);
	},

	inputEventHandler: () => {
		const isValidDomain = domainInput.checkValidity();
		if (isValidDomain) {
			Utils.enableButtonList([domainElement.addButton]);
			domainElement.input.setAttribute("aria-invalid", "false");
		} else {
			Utils.disableButtonList([domainElement.addButton]);
			domainElement.input.setAttribute("aria-invalid", "true");
		}
	},
	addButtonHandler: () => {
		const isValid = domainElement.input.checkValidity();
		const domainValue = domainElement.input.value.trim();
		if (isValid && domainValue === "") {
			domainElement.messageBlock.classList.remove("hide");
			return false;
		} else {
			domainElement.messageBlock.classList.add("hide");
			const item = Utils.createListItem(domainValue);
			domainElement.list.append(item);
			domainElement.input.value = "";
			Utils.disableButtonList([domainElement.addButton]);
			Utils.enableButtonList([domainElement.saveButton]);
		}
	},
	saveButtonHandler: () => {
		const list = DomainHandler.collectDomainList();
		const uniqueDomainList = [...new Set(list)];
		chrome.storage.local.set(
			{ endpoints: JSON.stringify(uniqueDomainList) },
			() => {
				domainElement.statusBlock.classList.remove("hide");
				Utils.disableButtonList([domainElement.saveButton]);
				setTimeout(() => {
					domainElement.statusBlock.classList.add("hide");
					document.location.reload();
				}, 2500);
			}
		);
	},
};

domainElement.input.addEventListener("input", DomainHandler.inputEventHandler);
domainElement.addButton.addEventListener(
	"click",
	DomainHandler.addButtonHandler
);
domainElement.saveButton("click", DomainHandler.saveButtonHandler);
// load option from storage to option page
document.addEventListener("DOMContentLoaded", restoreOptions, false);
