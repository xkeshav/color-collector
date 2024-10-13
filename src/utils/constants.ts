/* eslint-disable @typescript-eslint/naming-convention */
export const extensionName = 'cssColorCollector';
export const extensionID = 'xkeshav.css-color-collector';
export const collectCommand = 'css-color-collector.collect';
export const configKey = 'cssColorCollector.colorInSeparateFile';
export const DOCUMENT_MINIMUM_LENGTH = 12; // *{color:red} is the minimum color containing css content

export const PATTERN_LIST = {
	PROPERTY: `(?<PROPERTY>[\\w-]+[^:])(?=:\\s*)`,
	SELECTOR: `(?<SELECTOR>[@:#'"\\.\\w\\-\\,\\*\\s\\n\\r\\t\\(\\)\\[\\]]+(?=\\s*\\{))`,
	COLOR_HEX_FORMAT: '(?<HEX_COLOR>#[0-9a-f]{3,8})\\s?(?!(\\w|\\{|\\s{))',
	COLOR_NON_HEX_FORMAT:`((?<NON_HEX_COLOR>\\b(rgba?|hsla?|hwb|(?:ok)?(?:lab|lch))[ \\t]*\\(([^\\)\\(]*?\\d[^\\)\\(]*)\\)))`,
	// COLOR_FUNCTION: '(?<COLOR_FUNCTION>(\\b(contrast-)?color\\b)\\(.*\\))',
	COLOR_FUNCTION: '',
	WORD: '(\\w+)',
	IMPORT_STMT: `(?<=@)\\bimport\\b\\s*(?<IMPORT>.*)(?=;)`,
	/*148 color names */
	COLOR_NAME: `(?<![\\=\\$'"\\.#\\-])\\s*(?<COLOR_NAME>\\b(?:black|silver|gray|whitesmoke|maroon|red|purple|fuchsia|green|lime|olivedrab|yellow|navy|blue|teal|aquamarine|orange|aliceblue|antiquewhite|aqua|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|goldenrod|gold|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavenderblush|lavender|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olive|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|white|yellowgreen|rebeccapurple)\\b\\s*)(?!-|{:)`,
	ROOT_SELECTOR: `(?<!\\/\\*.*)(?<=:)(?<ROOT_BLOCK>\\b(root)\\b\\s*(?={))`
};

export const COLOR_PROPERTY_LIST = {
	'accent-color': 'accent',
	'background': 'bg',
	'background-color': 'bg',
	'background-image': 'bg__img',
	'border': 'border',
	'border-block': 'border__block',
	'border-block-color': 'border__block',
	'border-block-end-color': 'border__block--end',
	'border-block-start-color': 'border__block--start',
	'border-bottom': 'border__bottom',
	'border-bottom-color': 'border__bottom',
	'border-color': 'border',
	'border-inline': 'border__inline',
	'border-inline-color': 'border__inline',
	'border-inline-end-color': 'border__inline--end',
	'border-inline-start-color': 'border__inline--start',
	'border-left': 'border__left',
	'border-left-color': 'border__left',
	'border-right': 'border__right',
	'border-right-color': 'border__right',
	'box-shadow': 'box__shadow',
	'border-top': 'border__top',
	'border-top-color': 'border__top',
	'caret-color': 'caret',
	'color': 'txt',
	'column-rule': 'column__rule',
	'column-rule-color': 'column__rule',
	'filter': 'filter',
	'opacity': 'opacity',
	'outline': 'outline',
	'outline-color': 'outline',
	'scrollbar-color': 'scrollbar',
	'stroke': 'stroke',
	'text-decoration': 'txt__decor',
	'text-decoration-color': 'txt__decor',
	'text-emphasis-color': 'txt__emphasis',
	'text-shadow': 'txt__shadow',
	'text-stroke': 'txt__stroke',
	'-moz-box-shadow': 'box__shadow',
	'-moz-column-rule': 'column__rule',
	'-moz-column-rule-color': 'column__rule',
	'-webkit-box-shadow': 'box__shadow',
	'-webkit-filter': ' filter',
	'-webkit-text-decoration': 'txt_decor',
	'-webkit-text-decoration-color': 'txt_decor',
	'-webkit-text-emphasis-color': 'txt__emphasis',
	'-webkit-text-fill-color': 'txt__fill',
	'-webkit-text-stroke': 'txt__stroke',
	'-webkit-text-stroke-color': 'txt__stroke',
};

export const PROPERTY_ALIAS_MAPPER = new Map(Object.entries(COLOR_PROPERTY_LIST));
