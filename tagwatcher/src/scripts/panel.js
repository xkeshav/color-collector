let clearButton, downloadLink, introParagraph, panelContainer, panelFooter;
let contentTags = [];
let taggingCaptureUrlList = [];
const keysToStore = {};

const PAGE_LABEL = 'Page Tracking';
const ACTION_LABEL = 'Click Tracking';
const MIME = 'image/gif'; // tagging request content type

// fetch list of server endpoints for which we need to capture sitecat
chrome.storage.local.get('endpoints', (result) => {
  const { endpoints } = result;
  const endpointList = JSON.parse(endpoints);
  taggingCaptureUrlList.push(...endpointList);
});

// fetch parameter list which we keep to display in tagging
chrome.storage.local.get('parameters', (result) => {
  const { parameters } = result;
  Object.assign(keysToStore, parameters);
});

// set theme from dev tools to sync storage
const theme = chrome.devtools.panels.themeName;
chrome.storage.sync.set({ theme });

panelContainer = document.querySelector('#container');
introParagraph = document.querySelector('#intro');
panelFooter = document.querySelector('#footer');
// empty panel information paragraph
emptyInfo = document.querySelector('#empty');
//get text from en/messages.json
// introParagraph.innerText = chrome.i18n.getMessage("intro");
introParagraph.innerText = 'No new request found yet.';
clearButton = document.querySelector('#clear');

clearButton.addEventListener('click', () => {
  Common.removeChildren(panelContainer);
  contentTags = [];
  panelContainer.innerHTMl = '';
  introParagraph && Common.showThis(introParagraph);
});

//download link
downloadLink = document.querySelector('#download');
downloadLink.addEventListener('click', (e) => {
  if (contentTags.length) {
    Common.downloadAsCSV();
    // disable download button to prevent multiple click
    downloadLink.setAttribute('disabled', 'true');
    downloadLink.classList.add('disabled');
  } else {
    e.preventDefault();
  }

  setTimeout(() => {
    downloadLink.removeAttribute('disabled');
    downloadLink.classList.remove('disabled');
  }, 2000);
});

const Common = {
  createElement: (kind, classNames = [], idName = '') => {
    const elem = document.createElement(kind);
    if (classNames.length) elem.classList.add(...classNames);
    if (idName) elem.setAttribute('id', idName);
    return elem;
  },
  removeChildren: (parent) => {
    if (parent && parent.hasChildNodes() && parent.childNodes.length > 0) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }
  },

  hideThis: (elem) => elem.classList.add('hide'),
  showThis: (elem) => elem.classList.remove('hide'),

  /* adobe date some as 27/10/2021 15:54:23 6 -330" format, here 6 denotes week day number */
  formatDateString: (str) => {
    const [date, time] = str.split(' ');
    const [dd, mm, yy] = date.split('/');
    const [th, tm, ts] = time.split(':');
    const readableDate = new Date(yy, mm, dd, th, tm, ts);
    return readableDate.toString();
  },

  convertArrayToCSV: (valuesArray, keyList) => {
    const keyNames = Object.keys(keyList);
    const content = valuesArray.map((arr, i) => {
      const list = keyNames
        .map((k) => {
          const found = arr.find(({ name }) => name === k);
          return found !== undefined ? found.value : '';
        })
        .join(',');
      return `${i + 1},${list}`;
    });

    // extra first column for numbering purpose
    const header = [''].concat(
      Object.entries(keyList)
        .map(([k, v]) => `${v} ( ${k} )`)
        .join(',')
    );
    const body = content.join('\n');
    return `${header}\n${body}`;
  },

  createBlob: (content) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    return url;
  },

  setFileName: () => {
    const today = new Date();
    const timeJSON = today.toJSON();
    const fileName = `tagWatcher_${timeJSON}.csv`;
    return fileName;
  },

  formatQueryParams: (request) => {
    const { queryString } = request;
    if (queryString.length) {
      const params = queryString.reduce((prev, next) => {
        const { name, value } = next;
        if (Object.keys(keysToStore).includes(name)) {
          const label = keysToStore[name];
          const v = decodeURIComponent(value); // to display %20 into readable format
          const curr = { name, label, value: v };
          return prev.concat(curr);
        }
        return prev;
      }, []);

      return params;
    }
  },

  downloadAsCSV: () => {
    const csvString = Common.convertArrayToCSV(contentTags, keysToStore);
    const contentURL = Common.createBlob(csvString); // TODO: bloburl or urlblob
    const invisibleLink = Common.createElement('a');
    const fileName = Common.setFileName();
    invisibleLink.setAttribute('href', contentURL);
    invisibleLink.target = '_blank';
    invisibleLink.setAttribute('download', fileName);
    invisibleLink.setAttribute('rel', 'noopener noreferrer');
    invisibleLink.style.visibility = 'hidden';
    panelFooter.appendChild(invisibleLink);
    invisibleLink.click();
    panelFooter.removeChild(invisibleLink);
  },
};

/*create HTML semantics in below manner
main>details>summary+section>[articles >div *2]*n // TODO: emmet
*/

const createArticle = (tag) => {
  const { name, label, value } = tag;
  const article = Common.createElement('article', ['article']);
  const labelDiv = Common.createElement('div', ['label']);
  labelDiv.setAttribute('title', name);
  labelDiv.textContent = label || 'label';
  const span = Common.createElement('span', ['prop']);
  span.textContent = ` (${name}) `;
  labelDiv.append(span);
  const valueDiv = Common.createElement('div', ['value']);
  const val = name === 't' ? Common.formatDateString(value) : value;
  valueDiv.textContent = val || 'value';
  article.append(labelDiv, valueDiv);
  return article;
};

/* `contentTags` array keep adding all tagging data whether tagging panel was open or not so we are getting wrong counter number
so found alternative to count original children with class .details within panelContainer to display the correct counter 
although download as CSV have all the content which may not appears on Tagging panel 
*/

const createSummary = (isLink) => {
  const detailsNode = panelContainer && panelContainer.querySelectorAll('.details');
  const childrenLength = detailsNode ? detailsNode.length : 0;
  const title = isLink ? ACTION_LABEL : PAGE_LABEL;
  const additionalClass = isLink ? 'summary--header__link' : 'summary--header_page';

  const summary = Common.createElement('summary', ['summary']);
  const header = Common.createElement('header', ['summary--header', additionalClass]);
  header.textContent = title;
  const counter = Common.createElement('span', ['summary--counter', 'number--circle']);
  counter.innerText = childrenLength + 1;
  summary.append(header, counter);
  return summary;
};

const render = (tag, count) => {
  // clear empty information paragraph when first tag being captured to contentTags Array
  if (count > 0) {
    introParagraph && Common.hideThis(introParagraph);
    const detailsFragment = document.createDocumentFragment();
    const isLink = tag.map(({ name }) => name).includes('pev2'); // link name captured in  `pev2` parameter in adobe
    const details = Common.createElement('details', ['details'], `details_${count}`);
    const summary = createSummary(isLink);
    details.insertAdjacentElement('afterbegin', summary);
    const section = Common.createElement('section', ['section']);
    const articleFragment = document.createDocumentFragment();
    //add row for every tag request
    tag.forEach((t) => {
      const article = createArticle(t);
      articleFragment.appendChild(article);
    });
    section.appendChild(articleFragment);
    details.appendChild(section);
    detailsFragment.appendChild(details);
    panelContainer && panelContainer.appendChild(detailsFragment);
  }
};

/ * when a network request has completed then this function will be called */;

chrome.devtools.network.onRequestFinished.addListener((event) => {
  const { request, response } = event;
  const { url } = request;
  console.log({ url });
  console.log({ taggingCaptureUrlList });
  const [, domain] = url.split('/').filter(Boolean);
  const isTaggingURL = taggingCaptureUrlList.includes(domain);
  const contentHeader = response.headers.find((header) => header.name.toLowerCase() === 'content-type');
  if (isTaggingURL && contentHeader) {
    const { size, mimeType } = response.content;
    // only capture valid response
    if ((mimeType === MIME) & (size > 0)) {
      const tagParams = Common.formatQueryParams(request);
      if (tagParams.length) {
        contentTags.push(tagParams);
        render(tagParams, contentTags.length);
      }
    }
  }
});

// Clear the record if the page is refreshed or the user navigates to another address

chrome.devtools.network.onNavigated.addListener(() => {
  contentTags = [];
  if (panelContainer) {
    panelContainer.innerHTMl = '';
  }
});
