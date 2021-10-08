const selector = document.querySelector('#go-to-options');
selector.addEventListener('click', ()=> {
	if(chrome.runtime.openOptionPage){
		chrome.runtime.openOptionPage();
	} else {
		window.open(chrome.runtime.getURL("options.html"));
	}
});