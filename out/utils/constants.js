"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATTERN_LIST = void 0;
exports.PATTERN_LIST = {
    SELECTOR: '^\s?(?<selector>(.+))\{([^}]+|\s+)}',
    COLOR_HEX_FORMAT: '(?<color>#[0-9a-f]{3,8})',
    COLOR_NON_HEX_FORMAT: '(?<color2>(?:rgba?|hsla?|hwb)?\\((-?\\d+%?[,\\s]+){2,3}[\\s\/]*[\\d\.]+%?\\))',
    WORD: '(\\w+)',
};
//# sourceMappingURL=constants.js.map