"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRootSelector = exports.combinedPattern = void 0;
const constants_1 = require("./constants");
const regexPatterns = [
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
//# sourceMappingURL=common.js.map