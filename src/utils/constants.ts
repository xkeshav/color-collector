/* eslint-disable @typescript-eslint/naming-convention */

export const PATTERN_LIST = {
	SELECTOR: '^\s?(?<selector>(.+))\{([^}]+|\s+)}',
	COLOR_HEX_FORMAT: '(?<color>#[0-9a-f]{3,8})',
	COLOR_NON_HEX_FORMAT: '(?<color2>(?:rgba?|hsla?|hwb)?\\((-?\\d+%?[,\\s]+){2,3}[\\s\/]*[\\d\.]+%?\\))',
	WORD: '(\\w+)',
};

