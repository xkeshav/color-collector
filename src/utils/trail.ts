import { RegExpMatchArrayWithIndices } from '../models/base';
import { combinedPattern } from './common';
import { PATTERN_LIST } from './constants';

import { cssDocument } from './cssDocument';

const { sample } = cssDocument;

console.log({ sample });

const selectorRegex = new RegExp(PATTERN_LIST.SELECTOR, 'imgd');
const selectorMatchList = sample.matchAll(selectorRegex);

const colorRegex = new RegExp(combinedPattern, 'imgd');
const colorMatchList = sample.matchAll(colorRegex);

const variableList = {};

let i = 0;

for (const sel of selectorMatchList) {
	const selectorName = sel.groups?.selector;
	const wordRegex = new RegExp(PATTERN_LIST.WORD, 'img');
	const [selector] = selectorName.match(wordRegex);
	console.log({ selector });
	for (const match of colorMatchList) {
		i++;
		const { groups, indices } = match as RegExpMatchArrayWithIndices;
		const { color: colorValue, color2: color2value } = groups;
		const { groups: { color, color2 } } = indices;
		const variableName = `--var-${selector}-${i}`;
		Object.assign(variableList, { [variableName]: colorValue || color2value });
		//console.log({ match });
		const colorCode = color || color2;
		console.log({ colorCode });
		let [start, end] = colorCode;
	}
}