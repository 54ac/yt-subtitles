import { setStorage, getAllStorage, getStorage } from "./storage";
import { Options } from "./defaults";
import calculateStyles from "./calculateStyles";
import updateTabs from "./updateTabs";

const optionEls = Array.from(
	document.getElementsByClassName("option")
) as HTMLInputElement[];

const updateVisibility = (el: HTMLInputElement) => {
	const dataEl = Array.from(
		document.querySelectorAll(`[data-parent="${el.id}"]`)
	) as HTMLElement[];
	dataEl.forEach((d) => {
		if (d.tagName === "TR") d.style.display = el.checked ? "" : "none";
		else d.style.visibility = el.checked ? "" : "hidden";
	});
};

const updateRange = (o: HTMLInputElement) => {
	const output = document.getElementById(o.id + "Output") as HTMLOutputElement;
	if (output) output.textContent = o.value + output.name;
};

const saveOption = async (o: HTMLInputElement) => {
	if (o.type === "range") updateRange(o);
	if (o.type === "checkbox") updateVisibility(o);

	if (o.type === "checkbox")
		await setStorage({
			[o.id]: o.checked
		});
	else
		await setStorage({
			[o.id]: o.value
		});

	await calculateStyles();
	updateTabs();
	createPreview();
};

const restoreOptions = async () => {
	const optionsStorage = (await getAllStorage()) as Options;
	optionEls.forEach((o: HTMLInputElement) => {
		const el = document.getElementById(o.id) as HTMLInputElement;
		if (!el) return;

		const optionStorage = optionsStorage[o.id as keyof Options];
		if (optionStorage === undefined) return;

		if (typeof optionStorage === "boolean") el.checked = optionStorage;
		else if (typeof optionStorage === "string") el.value = optionStorage;

		if (o.type === "checkbox") updateVisibility(o);
		if (o.type === "range") {
			updateRange(el);
			el.oninput = () => updateRange(el);
		}

		el.onchange = (e) => saveOption(e.target as HTMLInputElement);
	});
};
restoreOptions();

const styleEl = document.getElementById("better-yt-style") as HTMLStyleElement;
const createPreview = async () => {
	const previewContainerEl = document.getElementById(
		"previewContainer"
	) as HTMLDivElement;

	const captionSegmentStyles = (await getStorage(
		"captionSegmentStyles"
	)) as Options["captionSegmentStyles"];
	const captionWindowStyles = (await getStorage(
		"captionWindowStyles"
	)) as Options["captionWindowStyles"];

	if (!captionSegmentStyles && !captionWindowStyles) {
		previewContainerEl.style.display = "none";
		return;
	}

	previewContainerEl.style.display = "";
	styleEl.innerText = `${
		captionSegmentStyles?.length > 0
			? `#previewContainer .caption-segment { ${captionSegmentStyles} }`
			: ""
	} ${
		captionWindowStyles?.length > 0
			? `#previewContainer .caption-window { ${captionWindowStyles} }`
			: ""
	}`;
};
createPreview();

const versionEl = document.getElementById("version") as HTMLSpanElement;
versionEl.textContent = chrome.runtime.getManifest().version;

const _ = chrome.i18n.getMessage;

const infoEl = document.getElementById("headerInfo") as HTMLParagraphElement;
infoEl.textContent = _("headerInfo");

const previewEl = document.getElementById(
	"previewText"
) as HTMLParagraphElement;
previewEl.textContent = _("previewText");

const labelEl = Array.from(
	document.getElementsByTagName("label")
) as HTMLLabelElement[];
labelEl.forEach((l) => {
	l.textContent = l.htmlFor && _(l.htmlFor);
	if (_(l.htmlFor + "Desc")) {
		const labelP = l.parentNode as HTMLTableElement;
		labelP.title = _(l.htmlFor + "Desc");
		labelP.onmouseenter = () => (l.style.cursor = "help");
		labelP.onmouseleave = () => (l.style.cursor = "default");
	}
});

const optionEl = Array.from(
	document.getElementsByTagName("option")
) as HTMLOptionElement[];
optionEl.forEach((o) => o.id && (o.textContent = _(o.id)));

const h3El = Array.from(
	document.getElementsByTagName("h3")
) as HTMLHeadingElement[];
h3El.forEach((h) => h.id && (h.textContent = _(h.id)));

if (chrome.fontSettings) {
	const datalistEl = document.getElementById("fontList") as HTMLDataListElement;
	chrome.fontSettings.getFontList((fonts) => {
		for (const font of fonts) {
			const option = document.createElement("option");
			option.value = font.displayName;
			datalistEl.appendChild(option);
		}
	});
}

chrome.runtime.onMessage.addListener((message: { action: string }) => {
	if (message.action === "updateOptions") restoreOptions();
});
