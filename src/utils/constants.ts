/* eslint-disable @typescript-eslint/naming-convention */

export const PATTERN_LIST = {
	PROPERTY: '(?<PROPERTY>[\\w-]+[^:])(?=: )',
	SELECTOR: '^(?!.*@media)[\\t ]*(?<SELECTOR>[a-zA-Z#.:*[][^{\\/]*\\s*){[\\s\\S]*?}',
	SELECTOR_WITH_MEDIA: '^(?!.*@media)[\\t ]*(?<SELECTOR>[a-zA-Z#.:*[][^{\\/]*\\s*){[\\s\\S]*?}',
	COLOR_HEX_FORMAT: '(?<HEX_COLOR>#[0-9a-f]{3,8})',
	COLOR_HEX_DIGIT: '(?<color>#\\p{Hex_Digit}{3,8})', // works when flag u or v set
	COLOR_NON_HEX_FORMAT: '((?<NON_HEX_COLOR>(?:rgba?|hsla?|hwb)?\\((-?\\d+%?[,\\s]+){2,3}[\\s\/]*[\\d\.]+%?\\)))',
	WORD: '(\\w+)',
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
	'-webkit-text-stroke-color': 'txt__stroke'
};


export const PROPERTY_ALIAS_MAPPER = new Map(Object.entries(COLOR_PROPERTY_LIST));


