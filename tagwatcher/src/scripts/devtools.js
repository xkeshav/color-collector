let author;

chrome.storage.sync.get("author", (result) => {
	({ author } = result); // assign into already defined variable while destructuring
});

chrome.devtools.panels.create("Tagging", "", "src/html/panel.html", (panel) => {
	panel.onShown.addListener((win) => {
		console.log("Tagging Panel is shown");
		panelFooter = win.document.querySelector("footer");
		addAuthor(panelFooter);
	});

	panel.onHidden.addListener(() => {
		console.log("tagging panel is hidden");
	});
});

const addAuthor = (element) => {
	const authorDiv = document.createElement("p");
	if (author) {
		authorDiv.innerHTML = `Developed by <a href="#" >${author.name}</a> | <strong>ZERO</strong>`;
		if (!element.hasChildNodes()) {
			element.appendChild(authorDiv);
		}
	}
};
