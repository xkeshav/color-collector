"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVariableName = exports.getParentSelectorName = exports.createRootSelector = exports.combinedPattern = void 0;
const constants_1 = require("./constants");
const regexPatterns = [
    constants_1.PATTERN_LIST.PROPERTY,
    constants_1.PATTERN_LIST.COLOR_HEX_FORMAT,
    constants_1.PATTERN_LIST.COLOR_NON_HEX_FORMAT
];
;
exports.combinedPattern = regexPatterns.map((rx) => rx).join('|');
const createRootSelector = (list) => {
    const op = Object.entries(list).reduce((p, [k, v]) => p += `${k}: ${v};\n`, ``);
    return `:root { \r\n${op}}`;
};
exports.createRootSelector = createRootSelector;
const getParentSelectorName = (selectorList, start) => {
    var _a;
    const selectorPositionIndex = Array.from(selectorList.keys());
    const selectorKey = selectorPositionIndex.findLast((sl) => sl < start);
    const selectorName = (_a = selectorList.get(selectorKey)) !== null && _a !== void 0 ? _a : 'thisBlock'; // default selector name if not found
    return selectorName;
};
exports.getParentSelectorName = getParentSelectorName;
const setVariableName = ({ hexCode, nonHexCode, selectorName, previousProperty, num, variableList }) => {
    var _a;
    const variableValue = hexCode || nonHexCode;
    const element = (_a = constants_1.PROPERTY_ALIAS_MAPPER.get(previousProperty)) !== null && _a !== void 0 ? _a : 'thisElement';
    const variableName = `--${selectorName}__${element}--${num}`;
    Object.assign(variableList, { [variableName]: variableValue });
    return variableName;
};
exports.setVariableName = setVariableName;
//# sourceMappingURL=common.js.map