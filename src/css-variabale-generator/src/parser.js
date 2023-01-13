const text = `:root {
}

@import url ('./this.css');

* {
  transform-style: preserve-3d;
}


body /* beside body */ {
  background-color: #456698;
  color: #4523df;
  font: 1px solid red;
}

main > p {
  color: #4523df;
  padding: 1px solid red;
}

.header,
.header:hover {
  padding: 4px;
}

@media ( max-width: 724px ) { 
 main {
 color: green;
 }
} 

@keyframes jump {
  0% {
    transform: translateY(calc((10 - var(--index)) * (5 / 3 * var(--size)) / 10));
  }
}

`;

// \{([^}]+)\} << select within curly braces

const REGEX_PATTERN = {
  basic: '([\\s\\S]*?){([\\s\\S]*?)}',
  space: '[\\s\\S]*?',
  mediaQuery: '((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})',
  containerQuery: '((@container [\\s\\S]*?){([\\s\\S]*?}\\s*?)})',
  comment: '(\\/\\*[\\s\\S]*?\\*\\/)',
  importStatement: '@import .*?;',
  keyFrames: '((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})',
  unifiedCss: '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})',
  //to match css & media queries together
};

const entryObjectList = {
  keyFrames: {
    type: 'keyframes',
    selector: '@keyframes',
    styles: '',
  },
  importStatement: {
    type: 'imports',
    selector: '@imports',
    styles: '',
  },
  mediaQuery: {
    type: 'media',
    selector: '',
    mediaQueryList: [],
  },
  containerQuery: {
    type: 'container',
    selector: '',
    mediaQueryList: [],
  },
};

const baseObject = {
  selector: '',
  rules: [],
};

const spaceRegex = REGEX_PATTERN.space;
const list = [];
const cssImportStatements = [];
let isMediaQuery;
// very important to declare here
let isContainerQuery;

const stripComment = (source) => {
  const commentRegex = new RegExp(REGEX_PATTERN.comment, 'gi');
  const commentResult = [...source.matchAll(commentRegex)];
  // remove comments  from content
  const updatedSource = commentResult.length > 0 ? source.replaceAll(commentRegex, '').trim() : source.replaceAll(commentRegex, '');
  return updatedSource;
};

const stripImportStatements = (source) => {
  const importStatementRegex = new RegExp(REGEX_PATTERN.importStatement, 'gi');
  const importResult = [...source.matchAll(importStatementRegex)];
  // remove import statement from content
  const updatedSource = importResult.length > 0 ? source.replaceAll(importStatementRegex, '').trim() : source;
  return updatedSource;
};

const handleKeyFramesStatement = (source) => {
  const keyframesRegex = new RegExp(REGEX_PATTERN.keyFrames, 'gi');
  const entryObject = entryObjectList.keyFrames;
  const keyframesResult = source.matchAll(keyframesRegex);
  Array.from(keyframesResult, (m) => {
    let [styles] = m;
    const entry = { ...entryObject, styles };
    list.push(entry);
  });

  console.log({ list });
  //TODO: extract keyframe styles and rules
  // remove keyframe statement from content
  const updatedSource = source.replaceAll(REGEX_PATTERN.keyFrames, '');
  return updatedSource;
};
const collectMediaQueryCss = (selector, mediaQueryStyle) => {
  const entryObject = entryObjectList.mediaQuery;
  const mediaQueryList = parseCSS(mediaQueryStyle[3] + '\n}');
  //recursively parse media query inner css
  //console.log({ mediaQueryList });
  const entry = {
    ...entryObject,
    mediaQueryList,
  };
  return entry;
};
const collectStandardCss = (selector, standardStyle) => {
  const rules = parseRules(standardStyle[6]);
  const entry = {
    selector,
    rules,
  };
  if (selector === '@font-face') {
    Object.assign(entry, {
      type: 'font-face',
    });
  }
  //console.log({ entry });
  return entry;
};
const parseCSS = (source) => {
  if (source === undefined) {
    return [];
  }

  //strip out comments
  source = stripComment(source);
  console.log({ source });
  //get import statements
  source = stripImportStatements(source);
  console.log({ source, list });
  //get keyframe statements
  source = handleKeyFramesStatement(source);

  /* main code */

  const unifiedRegex = new RegExp(REGEX_PATTERN.unifiedCss, 'gi');

  let unifiedResult;

  const matches = source.matchAll(unifiedRegex);
  const op = Array.from(matches, (m) => {
    let selector = m[2] || m[5];
    selector = selector.split('\r\n').join('\n').trim();
    console.log({ selector });
    selector = stripComment(selector);
    console.log({ selector });
  });
  // const matchingAArray = [...matches];

  // console.log({matchingAArray})

  // while ((unifiedResult = unifiedRegex.exec(source)) !== null) {

  //   let selector = unifiedResult[2] === undefined ? unifiedResult[5] : unifiedResult[2];
  //   selector = selector.split('\r\n').join('\n').trim();
  //   console.log({
  //     selector
  //   });
  //   selector = stripComment(selector);
  //   // Never have more than a single line break in a row
  //   selector = selector.replace(/\n+/, '\n');
  //   //determine the type
  //   if (selector.indexOf('@media') !== -1 || selector.indexOf('@container') !== -1) {
  //     //we have a media query
  //     isMediaQuery = true;
  //     const mediaQueryCss = collectMediaQueryCss(selector, unifiedResult);
  //     list.push(mediaQueryCss);
  //   } else {
  //     //we have standard css
  //     const standardCSS = collectStandardCss(selector, unifiedResult);
  //     if (isMediaQuery) {
  //       // this condition is must otherwise we will be in nested loop for media query styles
  //       return standardCSS;
  //     } else {
  //       list.push(standardCSS);
  //     }
  //   }
  // }
  return list;
};
const parseRules = function (rules) {
  const ret = [];
  if (rules === undefined) {
    return ret;
  }
  //convert all windows style line endings to unix style line endings
  rules = rules.split('\r\n').join('\n');

  rules = rules.split(';');

  //process rules line by line
  for (var i = 0; i < rules.length; i++) {
    var line = rules[i];

    //determine if line is a valid css directive, ie color:white;
    line = line.trim();
    if (line.indexOf(':') !== -1) {
      //line contains :
      line = line.split(':');
      var cssDirective = line[0].trim();
      var cssValue = line.slice(1).join(':').trim();

      //more checks
      if (cssDirective.length < 1 || cssValue.length < 1) {
        continue;
        //there is no css directive or value that is of length 1 or 0
        // PLAIN WRONG WHAT ABOUT margin:0; ?
      }

      //push rule
      ret.push({
        directive: cssDirective,
        value: cssValue,
      });
    } else {
      //if there is no ':', but what if it was mis splitted value which starts with base64
      if (line.trim().substr(0, 7) === 'base64,') {
        //hack :)
        ret[ret.length - 1].value += line.trim();
      } else {
        //add rule, even if it is defective
        if (line.length > 0) {
          ret.push({
            directive: '',
            value: line,
            defective: true,
          });
        }
      }
    }
  }

  return ret;
  //we are done!
};

const output = parseCSS(text);

console.log({
  output,
});
