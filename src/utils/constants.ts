/* eslint-disable @typescript-eslint/naming-convention */

export const PATTERN_LIST = {
	PROPERTY: '(?<PROPERTY>[\\w-]+[^:])(?=:\s*)',
	SELECTOR_WITH_MEDIA: '(^(?!.*@media)[\\t ]*(?<SELECTOR>[@a-zA-Z#.:*[][^{\\/]*\\s*){[\\s\\S]*?})',
	COLOR_HEX_FORMAT: '(?<HEX_COLOR>#[0-9a-f]{3,8})',
	COLOR_NON_HEX_FORMAT: '((?<NON_HEX_COLOR>(?:rgba?|hsla?|hsv|hwb)?\\((:?-?[\\d\.]+%?(deg|rad|grad|turn)?[,\\s]+){2,3}[\\s\/]*[\\d\.]+%?\\)))',
	WORD: '(\\w+)',
	IMPORT_STMT: '@import',
	COLOR_NAME:'(?<COLOR_NAME>\\b(black|silver|gray|whitesmoke|maroon|red|purple|fuchsia|green|lime|olivedrab|yellow|navy|blue|teal|aquamarine|orange|aliceblue|antiquewhite|aqua|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|goldenrod|gold|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavenderblush|lavender|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olive|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|white|yellowgreen|rebeccapurple)\\b)'
};


const COLOR_PROPERTY_LIST = {
	'background': 'bg',
	'background-color': 'bg',
	'background-image': 'bg__img',
	'border': 'border',
	'border-color': 'border',
	'border-bottom-color': 'border__bottom',
	'border-left-color': 'border__left',
	'border-right-color': 'border__right',
	'border-top-color': 'border__top',
	'border-block-color': 'border__block',
	'border-inline-color': 'border__inline',
	'border-block-start-color': 'border__block--start',
	'border-block-end-color': 'border__block--end',
	'border-inline-start-color': 'border__inline--start',
	'border-inline-end-color': 'border__inline--end',
	'box-shadow': 'box__shadow',
	'caret-color': 'caret',
	'color': 'txt',
	'column-rule': 'column__rule',
	'column-rule-color': 'column__rule',
	'filter': 'filter',
	'opacity': 'opacity',
	'outline': 'outline',
	'outline-color': 'outline',
	'scrollbar-color': 'scrollbar',
	'text-decoration': 'txt__decoration',
	'text-decoration-color': 'txt__decoration',
	'text-shadow': 'txt__shadow',
	'text-emphasis-color': 'txt__emphasis',
	'-webkit-text-stroke-color': 'txt__stroke',
	'-webkit-text-fill-color': 'txt__fill'
};


export const PROPERTY_ALIAS_MAPPER = new Map(Object.entries(COLOR_PROPERTY_LIST));


