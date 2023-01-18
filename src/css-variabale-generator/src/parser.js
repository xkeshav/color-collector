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

@media only screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
 main {
 color: green;
 }
 
 p {
  color: #4523df;
  padding: 1px solid red;
  }
}

/* comment inside media*/
@keyframes expand {
  to {
    font-size:20px;
  }

  from {
    font-size: 30px;
  }
}



@keyframes identifier {
/*on very first */
  0% {
    top: 0;
    left: 0;
  }
  30% {
    top: 50px;
  }
  68%,
  72% {
    left: 50px;
  }
  100% {
    top: 100px;
    left: 100%;
  }
}

`;

// \{([^}]+)\} << select within curly braces

// (@media[^{]*) (\{)  media query

// /(?<selector>(?:(?:[^,{]+),?)*?)\{((?<name>(\W*[^}:])+):?(?:<value>[^}]+);?)*?\}/gm  << named capture

const REGEX_PATTERN = {
  basic: '([\\s\\S]*?){([\\s\\S]*?)}',
  space: '[\\s\\S]*?',
  mediaQuery: '((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})',
  containerQuery: '((@container [\\s\\S]*?){([\\s\\S]*?}\\s*?)})',
  comment: '(\\/\\*[\\s\\S]*?\\*\\/)',
  importStatement: '@import .*?;',
  keyFrames: '((@.*?keyframes ([\\s\\S]*?)){([\\s\\S]*?}\\s*?)})',
  unifiedCss: '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})',
  //to match css & media queries together
};

const entryObjectList = {
  keyFrames: {
    type: 'keyframes',
    selector: '@keyframes',
    keyFramesList: [],
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
    containerQueryList: [],
  },
};

const baseObject = {
  selector: '',
  rules: [],
};

const spaceRegex = REGEX_PATTERN.space;
const list = [];
const cssImportStatements = [];
let keyFramesInnerCss = [];
let isMediaQuery, isKeyframeQuery;
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
  //TODO: extract keyframe styles and rules
  keyFramesInnerCss = [...keyframesResult];
  // remove keyframe statement from content
  const updatedSource = source.replaceAll(keyframesRegex, '');
  return updatedSource;
};

// for (const match of keyframesResult) {
//     console.log({ match });
//     const selector = match[3];
//     const entry = collectKeyFramesCss(selector, match[4]);
//     console.log({ entry });
// }

const collectMediaQueryCss = (selector, mediaQueryStyle) => {
  const entryObject = entryObjectList.mediaQuery;
  const mediaQueryList = parseCSS(mediaQueryStyle + '\n}', { isMediaQuery: true });
  //recursively parse media query inner css
  console.log({ mediaQueryList });
  const entry = {
    ...entryObject,
    mediaQueryList,
  };
  return entry;
};

const collectKeyFramesCss = (selector, keyFramesStyle) => {
  const entryObject = entryObjectList.keyFrames;
  const keyFramesList = parseCSS(keyFramesStyle + '\n}', { isKeyFrames: true });
  //recursively parse keyframes query inner css
  console.log({ keyFramesList });
  const entry = {
    ...entryObject,
    keyFramesList,
  };
  return entry;
};

const collectStandardCss = (selector, standardStyle) => {
  const rules = parseRules(standardStyle);
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
const parseCSS = (source, options = { isStandard: true }) => {
  if (source === undefined) {
    return [];
  }

  //strip out comments
  source = stripComment(source);
  //get import statements
  source = stripImportStatements(source);
  //get keyframe statements
  source = handleKeyFramesStatement(source);

  /* main code */

  const unifiedRegex = new RegExp(REGEX_PATTERN.unifiedCss, 'gi');

  let unifiedResult;
  let selector;

  const matches = source.matchAll(unifiedRegex);
  const matchingArray = [...matches];
  console.log({ matchingArray });

  for (let m of matchingArray) {
    // }
    // matchingArray.forEach((m) => {
    selector = m[2] || m[5];
    selector = selector.split('\r\n').join('\n').trim();
    selector = stripComment(selector);
    selector = selector.replace(/\n+/, '\n');
    console.log({ selector });
    //  determine the type
    console.log({ m });
    // if (selector.indexOf('@keyframes') !== -1) {
    //   console.log({ selector, source });
    // }
    if (selector.indexOf('@media') !== -1 || selector.indexOf('@container') !== -1) {
      console.log('inside media query');
      //we have a media query
      const mediaQueryCss = collectMediaQueryCss(selector, m[3]);
      list.push(mediaQueryCss);
    } else {
      console.log('inside normal query');
      //we have standard css
      const standardCSS = collectStandardCss(selector, m[6]);
      console.log({ standardCSS });
      if (options.isMediaQuery) {
        // this condition is must otherwise we will be in nested loop for media query styles
        return standardCSS;
      } else if (options.isKeyFrames) {
        return standardCSS;
      }
      if (options.isStandard) {
        list.push(standardCSS);
      }
    }
  }

  console.log({ list });

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
