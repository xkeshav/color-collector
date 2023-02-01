"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDuplicateNonHexColor = exports.checkDuplicateHexColor = exports.hexColorVariation = exports.setVariableName = exports.getParentSelectorName = exports.createRootSelector = exports.combinedColorPattern = void 0;
const constants_1 = require("./constants");
const colorPatterns = [
    constants_1.PATTERN_LIST.PROPERTY,
    constants_1.PATTERN_LIST.COLOR_HEX_FORMAT,
    constants_1.PATTERN_LIST.COLOR_NON_HEX_FORMAT,
    constants_1.PATTERN_LIST.COLOR_NAME
];
exports.combinedColorPattern = colorPatterns.map((rx) => rx).join('|');
const createRootSelector = (list) => {
    const op = Object.entries(list).reduce((p, [k, v]) => p += `\n\t${k}: ${v};`, ``);
    return `:root {${op}\n}\n`;
};
exports.createRootSelector = createRootSelector;
/* find the parent selector name, in which we capture the color so that we can assign this parent selector name to identify */
const getParentSelectorName = (selectorList, start) => {
    var _a;
    const selectorPositionIndex = Array.from(selectorList.keys());
    const selectorKey = selectorPositionIndex.findLast((index) => index < start);
    const selectorName = (_a = selectorList.get(selectorKey)) !== null && _a !== void 0 ? _a : 'defaultSelector';
    return selectorName;
};
exports.getParentSelectorName = getParentSelectorName;
const setVariableName = ({ selectorName, propertyName, num }) => {
    var _a;
    const property = (_a = constants_1.PROPERTY_ALIAS_MAPPER.get(propertyName)) !== null && _a !== void 0 ? _a : 'defaultElement'; // default element name if not found
    return `--${selectorName}__${property}--${num}`;
};
exports.setVariableName = setVariableName;
/* check all color variation for a given hex value
  #fff === #ffff === #ffffff === #ffffffff
  #abcd === #aabbccdd
  #abcf === #abc === #aabbcc === #aabbccff
  #aabbcc === #abc === #abcf === #aabbccff
  #aabb2233 === #ab23
*/
const hexColorVariation = (value) => {
    const cv = value.slice(1); // remove # from start
    const initial = [cv];
    if (cv.length === 3) {
        const longHexValue = [...cv].reduce((p, n) => p.concat(n.repeat(2)), '');
        initial.push(cv + 'f', longHexValue, longHexValue + 'ff');
    }
    if (cv.length === 4) {
        const longHexValue = [...cv].reduce((p, n) => p.concat(n.repeat(2)), '');
        if (cv.endsWith('f')) {
            const shortHexValue = longHexValue.slice(0, -2);
            initial.push(cv.slice(0, -1), shortHexValue, longHexValue);
        }
        else {
            initial.push(longHexValue);
        }
    }
    if (cv.length === 6) {
        const longHexValue = cv + 'ff';
        if (cv[0] === cv[1] && cv[2] === cv[3] && cv[4] === cv[5]) {
            const shortHexValue = `${cv[1]}${cv[3]}${cv[5]}`;
            initial.push(shortHexValue, shortHexValue + 'f', longHexValue);
        }
        else {
            initial.push(longHexValue);
        }
    }
    if (cv.length === 8) {
        if (cv[0] === cv[1] && cv[2] === cv[3] && cv[4] === cv[5] && cv[6] === cv[7]) {
            const shortHexValue = `${cv[1]}${cv[3]}${cv[5]}${cv[7] === 'f' ? '' : cv[7]}`;
            initial.push(shortHexValue, shortHexValue + 'f');
        }
        if (cv.endsWith('ff')) {
            initial.push(cv.slice(0, -2));
        }
    }
    return initial.map(i => `#${i}`);
};
exports.hexColorVariation = hexColorVariation;
// check all variation of a hex value
const checkDuplicateHexColor = (colorValue, list) => {
    let isDuplicateColor = false;
    let colorVariable = '';
    const hexVariationList = (0, exports.hexColorVariation)(colorValue);
    const hexColorEntry = Object.entries(list).find(([_, vv]) => hexVariationList.includes(vv));
    if (hexColorEntry !== undefined) {
        [colorVariable] = hexColorEntry;
        isDuplicateColor = true;
    }
    return [isDuplicateColor, colorVariable];
};
exports.checkDuplicateHexColor = checkDuplicateHexColor;
/* check all non hex color value whether it is named color or in other format */
const checkDuplicateNonHexColor = (colorValue, list) => {
    let isDuplicateColor = false;
    let colorVariable = '';
    const nonHexColorEntry = Object.entries(list).find(([_, vv]) => colorValue === vv);
    if (nonHexColorEntry !== undefined) {
        [colorVariable] = nonHexColorEntry;
        isDuplicateColor = true;
    }
    return [isDuplicateColor, colorVariable];
};
exports.checkDuplicateNonHexColor = checkDuplicateNonHexColor;
//# sourceMappingURL=common.js.map