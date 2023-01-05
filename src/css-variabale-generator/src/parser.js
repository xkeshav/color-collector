const text = `:root {
}

body {
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

@media ( max-width: 724px) {

 main {
 color: green;
 }
}
`;

// \{([^}]+)\} << select within curly braces

const REGEX_PATTERN = {
  space: '[\\s\\S]*?',
  comment: '(\\/\\*[\\s\\S]*?\\*\\/)',
  importStatement: '@import .*?;',
  keyFrames: '((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})',
  unifiedCss: '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', //to match css & media queries together
};

const entryObjectList = {
  keyFrames: {
    selector: '@keyframes',
    type: 'keyframes',
    styles: '',
  },
  importStatement: {
    selector: '@imports',
    type: 'imports',
    styles: '',
  },
  mediaQuery: {
    selector: '',
    type: 'media',
    mediaQueryList: [],
  },
};

const baseObject = {
  selector: '',
  rules: [],
};

const spaceRegex = REGEX_PATTERN.space;
const newLocal = '(\\/\\*[\\s\\S]*?\\*\\/)';
const list = [];
const cssImportStatements = [];
let isMediaQuery; // very important to declare here

const stripComment = (source) => {
  const commentRegex = new RegExp(REGEX_PATTERN.comment, 'gi');
  const commentResult = commentRegex.exec(source);
  if (commentResult !== null) {
    return source.replace(commentRegex, '').trim();
  } else {
    return source.replace(commentRegex, '');
  }
};

const handleImportStatements = (source) => {
  const importStatementRegex = new RegExp(REGEX_PATTERN.importStatement, 'gi');
  const entryObject = entryObjectList.importStatement;
  let result;
  while (true) {
    result = importStatementRegex.exec(source);
    if (result === null) {
      break;
    } else {
      const [styles] = result;
      cssImportStatements.push(styles);
      const entry = { ...entryObject, styles };
      list.push(entry);
    }
  }
  // remove import statement from content
  const updatedSource = source.replace(REGEX_PATTERN.importStatement, '');
  return updatedSource;
};

const handleKeyFramesStatement = (source) => {
  const keyframesRegex = new RegExp(REGEX_PATTERN.keyFrames, 'gi');
  const entryObject = entryObjectList.keyFrames;
  let result;
  while (true) {
    result = keyframesRegex.exec(source);
    if (result === null) {
      break;
    } else {
      const [styles] = result;
      const entry = { ...entryObject, styles };
      list.push(entry);
    }
  }
  // remove keyframe statement from content
  const updatedSource = source.replace(REGEX_PATTERN.keyFrames, '');
  return updatedSource;
};

const collectMediaQueryCss = (selector, mediaQueryStyle) => {
  const entryObject = entryObjectList.mediaQuery;
  const mediaQueryList = parseCSS(mediaQueryStyle[3] + '\n}');
  //recursively parse media query inner css
  //console.log({ mediaQueryList });
  const entry = { ...entryObject, mediaQueryList };
  return entry;
};

const collectStandardCss = (selector, standardStyle) => {
  const rules = parseRules(standardStyle[6]);
  const entry = { selector, rules };
  if (selector === '@font-face') {
    Object.assign(entry, { type: 'font-face' });
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
  //get import statements
  source = handleImportStatements(source);
  //get keyframe statements
  source = handleKeyFramesStatement(source);

  /* main code */

  const unifiedRegex = new RegExp(REGEX_PATTERN.unifiedCss, 'gi');

  let unifiedResult;

  while (true) {
    unifiedResult = unifiedRegex.exec(source);
    if (unifiedResult === null) {
      break;
    }
    let selector = unifiedResult[2] === undefined ? unifiedResult[5] : unifiedResult[2];
    selector = selector.split('\r\n').join('\n').trim();
    console.log({ selector });
    selector = stripComment(selector);
    // Never have more than a single line break in a row
    selector = selector.replace(/\n+/, '\n');
    //determine the type
    if (selector.indexOf('@media') !== -1) {
      //we have a media query
      isMediaQuery = true;
      const mediaQueryCss = collectMediaQueryCss(selector, unifiedResult);
      list.push(mediaQueryCss);
    } else {
      //we have standard css
      const standardCSS = collectStandardCss(selector, unifiedResult);
      if (isMediaQuery) {
        // this condition is must otherwise we will be in nested loop for media query styles
        return standardCSS;
      } else {
        list.push(standardCSS);
      }
    }
  }
  return list;
};

const parseRules = function (rules) {
  //convert all windows style line endings to unix style line endings
  rules = rules.split('\r\n').join('\n');
  const ret = [];

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

console.log({ output });
