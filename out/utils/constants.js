"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATTERN_LIST = void 0;
exports.PATTERN_LIST = {
    PROPERTY: '(?<PROPERTY>[\\w-]+[^:])(?=:.*)',
    MEDIA_SELECTOR: '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){(?:[^}][\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){(?:[\\s\\S]*?)})',
    SELECTOR: '^(?!.*@media)[\\t ]*(?<SELECTOR>[a-zA-Z#.:*[][^{\\/]*\\s*){[\\s\\S]*?}',
    SELECTOR_WITH_MEDIA: /^(?!.*@media)[\t ]*(?<SELECTOR>[a-zA-Z#.:*[][^{\/]*\s*){[\s\S]*?}/,
    COLOR_HEX_FORMAT: '(?<HEX_COLOR>#[0-9a-f]{3,8})',
    COLOR_HEX_DIGIT: '(?<color>#\\p{Hex_Digit}{3,8})',
    COLOR_NON_HEX_FORMAT: '((?<NON_HEX_COLOR>(?:rgba?|hsla?|hwb)?\\((-?\\d+%?[,\\s]+){2,3}[\\s\/]*[\\d\.]+%?\\)))',
    WORD: '(\\w+)',
};
//# sourceMappingURL=constants.js.map