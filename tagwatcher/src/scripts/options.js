const parameterElement = {
  section: document.querySelector('#parameter-section'),
  jsonBlock: document.querySelector('#parameter-json'),
  messageBlock: document.querySelector('#parameter-message'),
  statusBlock: document.querySelector('#parameter-status'),
  saveButton: document.querySelector('#save-parameter'),
  resetButton: document.querySelector('#reset-parameter'),
};

const TIMEOUT_IN_MS = 2500;

// common utility methods
const Utils = {
  printPrettyJson: (obj) => {
    if (typeof obj === 'object') {
      return JSON.stringify(obj, null, 4);
    } else {
      return '';
    }
  },
  getTrimmedObject: (obj) => {
    const trimmedObject = {};
    if (typeof obj === 'object') {
      for (const k in obj) {
        if (Object.hasOwnProperty.call(obj, k)) {
          const trimmed = { [k.trim()]: obj[k].trim() };
          Object.assign(trimmedObject, trimmed);
        }
      }
    }
    return trimmedObject;
  },
  doEnable: (elem) => {
    if (elem.hasAttribute('disabled')) {
      elem.classList.remove('disabled');
      elem.removeAttribute('disabled');
      elem.setAttribute('aria-disabled', 'false');
    }
  },

  doDisable: (elem) => {
    if (!elem.hasAttribute('disabled')) {
      elem.classList.add('disabled');
      elem.setAttribute('disabled', 'true');
      elem.setAttribute('aria-disabled', 'true');
    }
  },

  enableButtonList: (buttonElements = []) => {
    buttonElements.forEach((elem) => Utils.doEnable(elem));
  },

  disableButtonList: (buttonElements = []) => {
    buttonElements.forEach((elem) => Utils.doDisable(elem));
  },

  copyToClipboard: (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => console.info('domain name copied to clipboard'))
      .catch((err) => {
        console.error('something went wrong while copy domain to clipboard', {
          err,
        });
      });
  },

  addCloseButton: () => {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn--remove');
    btn.onclick = DomainHandler.removeDomain;
    btn.textContent = '';
    btn.setAttribute('aria-label', 'cross icon');
    btn.setAttribute('title', 'remove domain');
    return btn;
  },

  createListItem: (domain) => {
    const li = document.createElement('li');
    li.classList.add('domain--item');
    const span = document.createElement('span');
    span.textContent = domain.trim();
    const btn = Utils.addCloseButton();
    li.append(span, btn);
    return li;
  },
};

const restoreOptions = () => {
  chrome.storage.local.get(['parameters'], (result) => {
    const { parameters } = result;
    parameterElement.jsonBlock.innerText = Utils.printPrettyJson(parameters);
  });

  //domain selection
  chrome.storage.local.get(['endpoints'], (result) => {
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
  // detect whether use click outside of the editable block;
  outsideClickHandler: (e) => {
    if (!parameterElement.jsonBlock.contains(e.target)) {
      if (ParameterHandler.hasParameterUpdated) {
        Utils.enableButtonList([parameterElement.saveButton, parameterElement.resetButton]);
      }
    }
  },
  updateParameterList: () => {
    const textContent = parameterElement.jsonBlock.textContent;
    try {
      const parsedText = JSON.parse(textContent);
      parameterElement.messageBlock.classList.add('hide'); // hide error message
      parameterElement.jsonBlock.setAttribute('aria-invalid', 'false');
      const trimmedParameterList = Utils.getTrimmedObject(parsedText);
      return trimmedParameterList;
    } catch (e) {
      console.log({ e }); // dev purpose
      parameterElement.jsonBlock.setAttribute('aria-invalid', 'true');
      parameterElement.messageBlock.classList.remove('hide'); // display error message
    }
  },
  saveToLocalStorage: () => {
    const parameters = ParameterHandler.updateParameterList();
    if (parameters !== undefined) {
      chrome.storage.local.set({ parameters }, () => {
        parameterElement.statusBlock.classList.remove('hide'); // display success message for a while
        Utils.disableButtonList([parameterElement.saveButton, parameterElement.resetButton]);
        parameterElement.jsonBlock.innerText = Utils.printPrettyJson(parameters);
        setTimeout(() => {
          parameterElement.statusBlock.classList.add('hide');
        }, TIMEOUT_IN_MS);
      });
    }
  },
};

parameterElement.section.addEventListener('click', ParameterHandler.outsideClickHandler);
parameterElement.jsonBlock.addEventListener('input', ParameterHandler.updateChanges);
parameterElement.saveButton.addEventListener('click', ParameterHandler.saveToLocalStorage, false);
parameterElement.resetButton.addEventListener('click', () => document.location.reload(), false);

// domain section

const domainElement = {
  form: document.querySelector('#domain-form'),
  input: document.querySelector('#domain-input'),
  list: document.querySelector('#domain-list'),
  messageBlock: document.querySelector('#domain-message'),
  statusBlock: document.querySelector('#domain-status'),
  addButton: document.querySelector('#domain-add'),
  saveButton: document.querySelector('#domain-save'),
};

const DomainHandler = {
  removeDomain: (e) => {
    const { target } = e;
    const parentElement = target.parentElement;
    const domain = parentElement.textContent;
    parentElement.classList.add('removed');
    Utils.copyToClipboard(domain); // copy domain name to the clipboard before removing from list
    // remove after animation ends
    parentElement.onanimationend = () => {
      target.parentNode.remove();
      domainElement.messageBlock.classList.add('hide');
      Utils.doEnable(domainElement.saveButton);
    };
  },

  collectDomainList: () => {
    const domainList = [];
    Array.from(domainElement.list.children).forEach((item) => {
      const domainName = item.children[0].textContent.trim();
      if (domainName !== '' && domainName !== null && domainName !== undefined) {
        domainList.push(domainName);
      }
    });
    return domainList;
  },

  createDomainList: (list = []) => {
    const frag = document.createDocumentFragment();
    list.forEach((l) => {
      const item = Utils.createListItem(l);
      frag.append(item);
    });
    domainElement.list.append(frag);
  },

  inputEventHandler: () => {
    const isDomainValid = domainElement.input.checkValidity();
    if (isDomainValid) {
      Utils.doEnable(domainElement.addButton);
      domainElement.input.setAttribute('aria-invalid', 'false');
    } else {
      Utils.doDisable(domainElement.addButton);
      domainElement.input.setAttribute('aria-invalid', 'true');
    }
  },

  addButtonHandler: () => {
    const isDomainValid = domainElement.input.checkValidity();
    const domainValue = domainElement.input.value.trim();
    if (isDomainValid && domainValue === '') {
      domainElement.messageBlock.classList.remove('hide');
      return false;
    } else {
      domainElement.messageBlock.classList.add('hide');
      const item = Utils.createListItem(domainValue);
      domainElement.list.append(item);
      domainElement.input.value = '';
      Utils.doDisable(domainElement.addButton);
      Utils.doEnable(domainElement.saveButton);
    }
  },
  saveButtonHandler: () => {
    const list = DomainHandler.collectDomainList();
    const uniqueDomainList = [...new Set(list)];
    chrome.storage.local.set({ endpoints: JSON.stringify(uniqueDomainList) }, () => {
      domainElement.statusBlock.classList.remove('hide');
      Utils.doDisable(domainElement.saveButton);
      setTimeout(() => {
        domainElement.statusBlock.classList.add('hide');
        document.location.reload();
      }, TIMEOUT_IN_MS);
    });
  },
};

domainElement.input.addEventListener('input', DomainHandler.inputEventHandler);
domainElement.addButton.addEventListener('click', DomainHandler.addButtonHandler);
domainElement.saveButton.addEventListener('click', DomainHandler.saveButtonHandler);
// load option from storage to option page
document.addEventListener('DOMContentLoaded', restoreOptions, false);
