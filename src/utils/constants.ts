/* eslint-disable @typescript-eslint/naming-convention */

export const PATTERN_LIST = {
	PROPERTY: '(?<PROPERTY>[\\w-]+[^:])(?=:.*)',
	MEDIA_SELECTOR: '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){(?:[^}][\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){(?:[\\s\\S]*?)})',
	SELECTOR: '^(?!.*@media)[\\t ]*(?<SELECTOR>[a-zA-Z#.:*[][^{\\/]*\\s*){[\\s\\S]*?}',
	SELECTOR_WITH_MEDIA: /^(?!.*@media)[\t ]*(?<SELECTOR>[a-zA-Z#.:*[][^{\/]*\s*){[\s\S]*?}/,
	COLOR_HEX_FORMAT: '(?<HEX_COLOR>#[0-9a-f]{3,8})',
	COLOR_HEX_DIGIT: '(?<color>#\\p{Hex_Digit}{3,8})', // works when flag u or v set
	COLOR_NON_HEX_FORMAT: '((?<NON_HEX_COLOR>(?:rgba?|hsla?|hwb)?\\((-?\\d+%?[,\\s]+){2,3}[\\s\/]*[\\d\.]+%?\\)))',
	WORD: '(\\w+)',
};

