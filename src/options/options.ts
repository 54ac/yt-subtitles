const options = Array.from(
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

const saveOption = (o: HTMLInputElement) => {
	if (o.type === "range") updateRange(o);
	if (o.type === "checkbox") updateVisibility(o);

	if (o.type === "checkbox")
		chrome.storage.local.set({
			[o.id]: o.checked
		});
	else
		chrome.storage.local.set({
			[o.id]: o.value
		});
};

chrome.storage.local.get(null, (res) => {
	options.forEach((o: HTMLInputElement) => {
		const el = document.getElementById(o.id) as HTMLInputElement;
		if (!el) return;

		if (typeof res[o.id] === "boolean") el.checked = res[o.id];
		else if (typeof res[o.id] === "string") el.value = res[o.id];

		if (o.type === "checkbox") updateVisibility(o);
		if (o.type === "range") {
			updateRange(el);
			el.oninput = () => updateRange(el);
		}

		el.onchange = (e) => saveOption(e.target as HTMLInputElement);
	});
});

const versionEl = document.getElementById("version") as HTMLSpanElement;
versionEl.textContent = chrome.runtime.getManifest().version;

const _ = chrome.i18n.getMessage;

const infoEl = document.getElementById("headerInfo") as HTMLParagraphElement;
infoEl.textContent = _("headerInfo");

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
