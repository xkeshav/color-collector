"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const constants_1 = require("./constants");
const cssDocument_1 = require("./cssDocument");
const { sample } = cssDocument_1.cssDocument;
console.log({ sample });
const selectorRegex = new RegExp(constants_1.PATTERN_LIST.SELECTOR, 'imgd');
const selectorMatchList = sample.matchAll(selectorRegex);
const colorRegex = new RegExp(common_1.combinedPattern, 'imgd');
const colorMatchList = sample.matchAll(colorRegex);
const variableList = {};
let i = 0;
for (const sel of selectorMatchList) {
    const selectorName = (_a = sel.groups) === null || _a === void 0 ? void 0 : _a.selector;
    const wordRegex = new RegExp(constants_1.PATTERN_LIST.WORD, 'img');
    const [selector] = selectorName.match(wordRegex);
    console.log({ selector });
    for (const match of colorMatchList) {
        i++;
        const { groups, indices } = match;
        const { color: colorValue, color2: color2value } = groups;
        const { groups: { color, color2 } } = indices;
        const variableName = `--var-${selector}-${i}`;
        Object.assign(variableList, { [variableName]: colorValue || color2value });
        //console.log({ match });
        const colorCode = color || color2;
        console.log({ colorCode });
        let [start, end] = colorCode;
    }
}
//# sourceMappingURL=trail.js.map